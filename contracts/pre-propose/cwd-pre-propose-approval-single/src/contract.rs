#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Addr, Binary, Deps, DepsMut, Empty, Env, MessageInfo, Order, Response, StdResult,
    SubMsg, WasmMsg,
};
use cw2::set_contract_version;
use cw_paginate::paginate_map_values;
use cwd_pre_propose_base::{
    error::PreProposeError, msg::ExecuteMsg as ExecuteBase, state::PreProposeContract,
};
use cwd_proposal_single::msg::ProposeMsg;
use cwd_voting::deposit::DepositRefundPolicy;

use crate::msg::{
    ApproverProposeMessage, ExecuteExt, ExecuteMsg, InstantiateExt, InstantiateMsg, ProposeMessage,
    ProposeMessageInternal, QueryExt, QueryMsg,
};
use crate::state::{
    advance_approval_id, PendingProposal, APPROVER, DEPOSIT_SNAPSHOT, PENDING_PROPOSALS,
};

pub(crate) const CONTRACT_NAME: &str = "crates.io:cwd-pre-propose-approval-single";
pub(crate) const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

type PrePropose = PreProposeContract<InstantiateExt, ExecuteExt, QueryExt, ProposeMessage>;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    mut deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, PreProposeError> {
    let approver = deps.api.addr_validate(&msg.extension.approver)?;
    APPROVER.save(deps.storage, &approver)?;

    let resp = PrePropose::default().instantiate(deps.branch(), env, info, msg)?;
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    Ok(resp.add_attribute("approver", approver.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, PreProposeError> {
    match msg {
        ExecuteMsg::Propose { msg } => execute_propose(deps, env, info, msg),
        ExecuteMsg::ProposalCreatedHook {
            proposal_id,
            proposer,
        } => execute_proposal_created_hook(deps, info, proposal_id, proposer),

        // TODO(zeke): why not use behavior of base?
        ExecuteMsg::AddProposalSubmittedHook { address } => {
            execute_add_approver_hook(deps, info, address)
        }
        // TODO(zeke): why not use behavior of base?
        ExecuteMsg::RemoveProposalSubmittedHook { address } => {
            execute_remove_approver_hook(deps, info, address)
        }

        ExecuteMsg::Extension { msg } => match msg {
            ExecuteExt::Approve { id } => execute_approve(deps, info, id),
            ExecuteExt::Reject { id } => execute_reject(deps, info, id),
            ExecuteExt::UpdateApprover { address } => execute_update_approver(deps, info, address),
        },
        // Default pre-propose-base behavior for all other messages
        _ => PrePropose::default().execute(deps, env, info, msg),
    }
}

pub fn execute_propose(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ProposeMessage,
) -> Result<Response, PreProposeError> {
    let pre_propose_base = PrePropose::default();
    let config = pre_propose_base.config.load(deps.storage)?;

    pre_propose_base.check_can_submit(deps.as_ref(), info.sender.clone())?;

    // Take deposit, if configured.
    let deposit_messages = if let Some(ref deposit_info) = config.deposit_info {
        deposit_info.check_native_deposit_paid(&info)?;
        deposit_info.get_take_deposit_messages(&info.sender, &env.contract.address)?
    } else {
        vec![]
    };

    let approval_id = advance_approval_id(deps.storage)?;

    let propose_msg_internal = match msg {
        ProposeMessage::Propose {
            title,
            description,
            msgs,
        } => ProposeMsg {
            title,
            description,
            msgs,
            proposer: Some(info.sender.into_string()),
        },
    };

    // Prepare proposal submitted hooks msg to notify approver.  Make
    // a proposal on the approver DAO to approve this pre-proposal

    // TODO(zeke): is this actually what we should be feeding to the
    // proposal submitted hooks? this locks them into being an
    // approver.
    let hooks_msgs =
        pre_propose_base
            .proposal_submitted_hooks
            .prepare_hooks(deps.storage, |a| {
                let execute_msg = WasmMsg::Execute {
                    contract_addr: a.into_string(),
                    msg: to_binary(&ExecuteBase::<ApproverProposeMessage, Empty>::Propose {
                        msg: ApproverProposeMessage::Propose {
                            title: propose_msg_internal.title.clone(),
                            description: propose_msg_internal.description.clone(),
                            approval_id,
                        },
                    })?,
                    funds: vec![],
                };
                Ok(SubMsg::new(execute_msg))
            })?;

    // Save the proposal and its information as pending.
    PENDING_PROPOSALS.save(
        deps.storage,
        approval_id,
        &PendingProposal {
            approval_id,
            msg: propose_msg_internal,
            deposit: config.deposit_info,
        },
    )?;

    Ok(Response::default()
        .add_messages(deposit_messages)
        .add_submessages(hooks_msgs)
        .add_attribute("method", "pre-propose")
        .add_attribute("id", approval_id.to_string()))
}

pub fn execute_approve(
    deps: DepsMut,
    info: MessageInfo,
    id: u64,
) -> Result<Response, PreProposeError> {
    // Check sender is the approver
    let approver = APPROVER.load(deps.storage)?;
    if approver != info.sender {
        return Err(PreProposeError::Unauthorized {});
    }

    // Load proposal and send propose message to the proposal module
    let proposal = PENDING_PROPOSALS.may_load(deps.storage, id)?;
    match proposal {
        Some(proposal) => {
            let proposal_module = PrePropose::default().proposal_module.load(deps.storage)?;
            let propose_messsage = WasmMsg::Execute {
                contract_addr: proposal_module.into_string(),
                msg: to_binary(&ProposeMessageInternal::Propose(proposal.msg))?,
                funds: vec![],
            };

            PENDING_PROPOSALS.remove(deps.storage, id);
            DEPOSIT_SNAPSHOT.save(deps.storage, &proposal.deposit)?;

            Ok(Response::default()
                .add_message(propose_messsage)
                .add_attribute("method", "proposal_approved")
                .add_attribute("proposal", id.to_string()))
        }
        None => Err(PreProposeError::ProposalNotFound {}),
    }
}

pub fn execute_proposal_created_hook(
    deps: DepsMut,
    info: MessageInfo,
    id: u64,
    proposer: String,
) -> Result<Response, PreProposeError> {
    let proposer = deps.api.addr_validate(&proposer)?;
    let pre_propose = PrePropose::default();
    let proposal_module = pre_propose.proposal_module.load(deps.storage)?;
    if info.sender != proposal_module {
        return Err(PreProposeError::NotModule {});
    }

    let deposit = DEPOSIT_SNAPSHOT.load(deps.storage)?;
    DEPOSIT_SNAPSHOT.remove(deps.storage);

    pre_propose
        .deposits
        .save(deps.storage, id, &(deposit, proposer))?;

    Ok(Response::default()
        .add_attribute("method", "execute_new_proposal_hook")
        .add_attribute("proposal_id", id.to_string()))
}

pub fn execute_reject(
    deps: DepsMut,
    info: MessageInfo,
    id: u64,
) -> Result<Response, PreProposeError> {
    // Check sender is the approver
    let approver = APPROVER.load(deps.storage)?;
    if approver != info.sender {
        return Err(PreProposeError::Unauthorized {});
    }

    let PendingProposal {
        deposit,
        msg: ProposeMsg { proposer, .. },
        ..
    } = PENDING_PROPOSALS
        .may_load(deps.storage, id)?
        .ok_or(PreProposeError::ProposalNotFound {})?;

    PENDING_PROPOSALS.remove(deps.storage, id);

    let messages = if let Some(ref deposit_info) = deposit {
        // Refund can be issued if proposal if deposits are always
        // refunded. `OnlyPassed` and `Never` refund deposit policies
        // do not apply here.
        if deposit_info.refund_policy == DepositRefundPolicy::Always {
            // We'll never put a proposal in the pending map unless we
            // have set its proposer. Failing to do so would mean the
            // proposal could never be submitted to the proposal
            // module as no sender would be specified. Thus, we can
            // safely unwrap.
            //
            // If we're wrong here, worst case is that proposals can't
            // be rejected and sit in the pending phase forever. This
            // is effectively rejection, minus you getting your
            // proposal back, and the DAO could still make a proposal
            // to do an upgrade.
            //
            // We could encode this in the type sytem, but rust being
            // not able to extend / modify structs from other modules
            // (the macros just can't access the fields) means that
            // we'd stop getting the type safety provided by using the
            // `ProposeMsg` directly from proposal single. IMO, that
            // type safety is better than rolling our own proposal
            // type that is a duplicate of the single choice one so
            // that we can remove this unwrap.
            let proposer = Addr::unchecked(proposer.unwrap());
            deposit_info.get_return_deposit_message(&proposer)?
        } else {
            // If the proposer doesn't get the deposit, the DAO does.
            let dao = PrePropose::default().dao.load(deps.storage)?;
            deposit_info.get_return_deposit_message(&dao)?
        }
    } else {
        vec![]
    };

    Ok(Response::default()
        .add_attribute("method", "proposal_rejected")
        .add_attribute("proposal", id.to_string())
        .add_attribute("deposit_info", to_binary(&deposit)?.to_string())
        .add_messages(messages))
}

pub fn execute_update_approver(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, PreProposeError> {
    // Check sender is the approver
    let approver = APPROVER.load(deps.storage)?;
    if approver != info.sender {
        return Err(PreProposeError::Unauthorized {});
    }

    // Validate address and save new approver
    let addr = deps.api.addr_validate(&address)?;
    APPROVER.save(deps.storage, &addr)?;

    Ok(Response::default())
}

pub fn execute_add_approver_hook(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, PreProposeError> {
    let pre_propose_base = PrePropose::default();

    let dao = pre_propose_base.dao.load(deps.storage)?;
    let approver = APPROVER.load(deps.storage)?;

    // Check sender is the approver or the parent DAO
    if approver != info.sender && dao != info.sender {
        return Err(PreProposeError::Unauthorized {});
    }

    let addr = deps.api.addr_validate(&address)?;
    pre_propose_base
        .proposal_submitted_hooks
        .add_hook(deps.storage, addr)?;

    Ok(Response::default())
}

pub fn execute_remove_approver_hook(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, PreProposeError> {
    let pre_propose_base = PrePropose::default();

    let dao = pre_propose_base.dao.load(deps.storage)?;
    let approver = APPROVER.load(deps.storage)?;

    // Check sender is the approver or the parent DAO
    if approver != info.sender && dao != info.sender {
        return Err(PreProposeError::Unauthorized {});
    }

    // Validate address
    let addr = deps.api.addr_validate(&address)?;

    // remove hook
    pre_propose_base
        .proposal_submitted_hooks
        .remove_hook(deps.storage, addr)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::QueryExtension { msg } => match msg {
            QueryExt::Approver {} => to_binary(&APPROVER.load(deps.storage)?),
            QueryExt::PendingProposal { id } => {
                to_binary(&PENDING_PROPOSALS.load(deps.storage, id)?)
            }
            QueryExt::PendingProposals { start_after, limit } => to_binary(&paginate_map_values(
                deps,
                &PENDING_PROPOSALS,
                start_after,
                limit,
                Order::Descending,
            )?),
            QueryExt::ReversePendingProposals { start_after, limit } => {
                to_binary(&paginate_map_values(
                    deps,
                    &PENDING_PROPOSALS,
                    start_after,
                    limit,
                    Order::Ascending,
                )?)
            }
        },
        _ => PrePropose::default().query(deps, env, msg),
    }
}
