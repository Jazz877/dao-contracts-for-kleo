/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.5.8.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
export type Addr = string;
export type ProposalModuleStatus = "Enabled" | "Disabled";
export type ActiveProposalModulesResponse = ProposalModule[];
export interface ProposalModule {
  address: Addr;
  prefix: string;
  status: ProposalModuleStatus;
  [k: string]: unknown;
}
export interface AdminNominationResponse {
  nomination?: Addr | null;
  [k: string]: unknown;
}
export type AdminResponse = Addr | null;
export interface ConfigResponse {
  automatically_add_cw20s: boolean;
  automatically_add_cw721s: boolean;
  description: string;
  image_url?: string | null;
  name: string;
  [k: string]: unknown;
}
export type Uint128 = string;
export interface Cw20BalancesResponse {
  addr: Addr;
  balance: Uint128;
  [k: string]: unknown;
}
export type Cw20TokenListResponse = Addr[];
export type Cw721TokenListResponse = Addr[];
export type PauseInfoResponse = {
  Paused: {
    expiration: Expiration;
    [k: string]: unknown;
  };
} | {
  Unpaused: {
    [k: string]: unknown;
  };
};
export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {
    [k: string]: unknown;
  };
};
export type Timestamp = Uint64;
export type Uint64 = string;
export interface DumpStateResponse {
  active_proposal_module_count: number;
  admin: Addr;
  config: Config;
  pause_info: PauseInfoResponse;
  proposal_modules: ProposalModule[];
  total_proposal_module_count: number;
  version: ContractVersion;
  voting_module: Addr;
  [k: string]: unknown;
}
export interface Config {
  automatically_add_cw20s: boolean;
  automatically_add_cw721s: boolean;
  description: string;
  image_url?: string | null;
  name: string;
  [k: string]: unknown;
}
export interface ContractVersion {
  contract: string;
  version: string;
  [k: string]: unknown;
}
export type ExecuteMsg = {
  execute_admin_msgs: {
    msgs: CosmosMsgForEmpty[];
    [k: string]: unknown;
  };
} | {
  execute_proposal_hook: {
    msgs: CosmosMsgForEmpty[];
    [k: string]: unknown;
  };
} | {
  pause: {
    duration: Duration;
    [k: string]: unknown;
  };
} | {
  receive: Cw20ReceiveMsg;
} | {
  receive_nft: Cw721ReceiveMsg;
} | {
  remove_item: {
    key: string;
    [k: string]: unknown;
  };
} | {
  set_item: {
    addr: string;
    key: string;
    [k: string]: unknown;
  };
} | {
  nominate_admin: {
    admin?: string | null;
    [k: string]: unknown;
  };
} | {
  accept_admin_nomination: {
    [k: string]: unknown;
  };
} | {
  withdraw_admin_nomination: {
    [k: string]: unknown;
  };
} | {
  update_config: {
    config: Config;
    [k: string]: unknown;
  };
} | {
  update_cw20_list: {
    to_add: string[];
    to_remove: string[];
    [k: string]: unknown;
  };
} | {
  update_cw721_list: {
    to_add: string[];
    to_remove: string[];
    [k: string]: unknown;
  };
} | {
  update_proposal_modules: {
    to_add: ModuleInstantiateInfo[];
    to_disable: string[];
    [k: string]: unknown;
  };
} | {
  update_voting_module: {
    module: ModuleInstantiateInfo;
    [k: string]: unknown;
  };
};
export type CosmosMsgForEmpty = {
  bank: BankMsg;
} | {
  custom: Empty;
} | {
  staking: StakingMsg;
} | {
  distribution: DistributionMsg;
} | {
  stargate: {
    type_url: string;
    value: Binary;
    [k: string]: unknown;
  };
} | {
  ibc: IbcMsg;
} | {
  wasm: WasmMsg;
} | {
  gov: GovMsg;
};
export type BankMsg = {
  send: {
    amount: Coin[];
    to_address: string;
    [k: string]: unknown;
  };
} | {
  burn: {
    amount: Coin[];
    [k: string]: unknown;
  };
};
export type StakingMsg = {
  delegate: {
    amount: Coin;
    validator: string;
    [k: string]: unknown;
  };
} | {
  undelegate: {
    amount: Coin;
    validator: string;
    [k: string]: unknown;
  };
} | {
  redelegate: {
    amount: Coin;
    dst_validator: string;
    src_validator: string;
    [k: string]: unknown;
  };
};
export type DistributionMsg = {
  set_withdraw_address: {
    address: string;
    [k: string]: unknown;
  };
} | {
  withdraw_delegator_reward: {
    validator: string;
    [k: string]: unknown;
  };
};
export type Binary = string;
export type IbcMsg = {
  transfer: {
    amount: Coin;
    channel_id: string;
    timeout: IbcTimeout;
    to_address: string;
    [k: string]: unknown;
  };
} | {
  send_packet: {
    channel_id: string;
    data: Binary;
    timeout: IbcTimeout;
    [k: string]: unknown;
  };
} | {
  close_channel: {
    channel_id: string;
    [k: string]: unknown;
  };
};
export type WasmMsg = {
  execute: {
    contract_addr: string;
    funds: Coin[];
    msg: Binary;
    [k: string]: unknown;
  };
} | {
  instantiate: {
    admin?: string | null;
    code_id: number;
    funds: Coin[];
    label: string;
    msg: Binary;
    [k: string]: unknown;
  };
} | {
  migrate: {
    contract_addr: string;
    msg: Binary;
    new_code_id: number;
    [k: string]: unknown;
  };
} | {
  update_admin: {
    admin: string;
    contract_addr: string;
    [k: string]: unknown;
  };
} | {
  clear_admin: {
    contract_addr: string;
    [k: string]: unknown;
  };
};
export type GovMsg = {
  vote: {
    proposal_id: number;
    vote: VoteOption;
    [k: string]: unknown;
  };
};
export type VoteOption = "yes" | "no" | "abstain" | "no_with_veto";
export type Duration = {
  height: number;
} | {
  time: number;
};
export type Admin = {
  address: {
    addr: string;
    [k: string]: unknown;
  };
} | {
  core_contract: {
    [k: string]: unknown;
  };
} | {
  none: {
    [k: string]: unknown;
  };
};
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface Empty {
  [k: string]: unknown;
}
export interface IbcTimeout {
  block?: IbcTimeoutBlock | null;
  timestamp?: Timestamp | null;
  [k: string]: unknown;
}
export interface IbcTimeoutBlock {
  height: number;
  revision: number;
  [k: string]: unknown;
}
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
  [k: string]: unknown;
}
export interface Cw721ReceiveMsg {
  msg: Binary;
  sender: string;
  token_id: string;
  [k: string]: unknown;
}
export interface ModuleInstantiateInfo {
  admin: Admin;
  code_id: number;
  label: string;
  msg: Binary;
  [k: string]: unknown;
}
export interface GetItemResponse {
  item?: string | null;
  [k: string]: unknown;
}
export interface InfoResponse {
  info: ContractVersion;
  [k: string]: unknown;
}
export interface InstantiateMsg {
  admin?: string | null;
  automatically_add_cw20s: boolean;
  automatically_add_cw721s: boolean;
  description: string;
  image_url?: string | null;
  initial_items?: InitialItem[] | null;
  name: string;
  proposal_modules_instantiate_info: ModuleInstantiateInfo[];
  voting_module_instantiate_info: ModuleInstantiateInfo;
  [k: string]: unknown;
}
export interface InitialItem {
  key: string;
  value: string;
  [k: string]: unknown;
}
export type ListItemsResponse = string[];
export type MigrateMsg = "FromV1" | "FromCompatible";
export type ProposalModulesResponse = ProposalModule[];
export type QueryMsg = {
  admin: {
    [k: string]: unknown;
  };
} | {
  admin_nomination: {
    [k: string]: unknown;
  };
} | {
  config: {
    [k: string]: unknown;
  };
} | {
  cw20_balances: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  cw20_token_list: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  cw721_token_list: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  dump_state: {
    [k: string]: unknown;
  };
} | {
  get_item: {
    key: string;
    [k: string]: unknown;
  };
} | {
  list_items: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  proposal_modules: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  active_proposal_modules: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  pause_info: {
    [k: string]: unknown;
  };
} | {
  voting_module: {
    [k: string]: unknown;
  };
} | {
  voting_power_at_height: {
    address: string;
    height?: number | null;
    [k: string]: unknown;
  };
} | {
  total_power_at_height: {
    height?: number | null;
    [k: string]: unknown;
  };
} | {
  info: {
    [k: string]: unknown;
  };
};
export interface TotalPowerAtHeightResponse {
  height: number;
  power: Uint128;
  [k: string]: unknown;
}
export type VotingModuleResponse = string;
export interface VotingPowerAtHeightResponse {
  height: number;
  power: Uint128;
  [k: string]: unknown;
}
export interface CwCoreReadOnlyInterface {
  contractAddress: string;
  admin: () => Promise<AdminResponse>;
  adminNomination: () => Promise<AdminNominationResponse>;
  config: () => Promise<ConfigResponse>;
  cw20Balances: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<Cw20BalancesResponse>;
  cw20TokenList: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<Cw20TokenListResponse>;
  cw721TokenList: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<Cw721TokenListResponse>;
  dumpState: () => Promise<DumpStateResponse>;
  getItem: ({
    key
  }: {
    key: string;
  }) => Promise<GetItemResponse>;
  listItems: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<ListItemsResponse>;
  proposalModules: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<ProposalModulesResponse>;
  activeProposalModules: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<ActiveProposalModulesResponse>;
  pauseInfo: () => Promise<PauseInfoResponse>;
  votingModule: () => Promise<VotingModuleResponse>;
  votingPowerAtHeight: ({
    address,
    height
  }: {
    address: string;
    height?: number;
  }) => Promise<VotingPowerAtHeightResponse>;
  totalPowerAtHeight: ({
    height
  }: {
    height?: number;
  }) => Promise<TotalPowerAtHeightResponse>;
  info: () => Promise<InfoResponse>;
}
export class CwCoreQueryClient implements CwCoreReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.admin = this.admin.bind(this);
    this.adminNomination = this.adminNomination.bind(this);
    this.config = this.config.bind(this);
    this.cw20Balances = this.cw20Balances.bind(this);
    this.cw20TokenList = this.cw20TokenList.bind(this);
    this.cw721TokenList = this.cw721TokenList.bind(this);
    this.dumpState = this.dumpState.bind(this);
    this.getItem = this.getItem.bind(this);
    this.listItems = this.listItems.bind(this);
    this.proposalModules = this.proposalModules.bind(this);
    this.activeProposalModules = this.activeProposalModules.bind(this);
    this.pauseInfo = this.pauseInfo.bind(this);
    this.votingModule = this.votingModule.bind(this);
    this.votingPowerAtHeight = this.votingPowerAtHeight.bind(this);
    this.totalPowerAtHeight = this.totalPowerAtHeight.bind(this);
    this.info = this.info.bind(this);
  }

  admin = async (): Promise<AdminResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      admin: {}
    });
  };
  adminNomination = async (): Promise<AdminNominationResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      admin_nomination: {}
    });
  };
  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  cw20Balances = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<Cw20BalancesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      cw20_balances: {
        limit,
        start_after: startAfter
      }
    });
  };
  cw20TokenList = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<Cw20TokenListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      cw20_token_list: {
        limit,
        start_after: startAfter
      }
    });
  };
  cw721TokenList = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<Cw721TokenListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      cw721_token_list: {
        limit,
        start_after: startAfter
      }
    });
  };
  dumpState = async (): Promise<DumpStateResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      dump_state: {}
    });
  };
  getItem = async ({
    key
  }: {
    key: string;
  }): Promise<GetItemResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_item: {
        key
      }
    });
  };
  listItems = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<ListItemsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_items: {
        limit,
        start_after: startAfter
      }
    });
  };
  proposalModules = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<ProposalModulesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      proposal_modules: {
        limit,
        start_after: startAfter
      }
    });
  };
  activeProposalModules = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<ActiveProposalModulesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      active_proposal_modules: {
        limit,
        start_after: startAfter
      }
    });
  };
  pauseInfo = async (): Promise<PauseInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      pause_info: {}
    });
  };
  votingModule = async (): Promise<VotingModuleResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      voting_module: {}
    });
  };
  votingPowerAtHeight = async ({
    address,
    height
  }: {
    address: string;
    height?: number;
  }): Promise<VotingPowerAtHeightResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      voting_power_at_height: {
        address,
        height
      }
    });
  };
  totalPowerAtHeight = async ({
    height
  }: {
    height?: number;
  }): Promise<TotalPowerAtHeightResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_power_at_height: {
        height
      }
    });
  };
  info = async (): Promise<InfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      info: {}
    });
  };
}
export interface CwCoreInterface extends CwCoreReadOnlyInterface {
  contractAddress: string;
  sender: string;
  executeAdminMsgs: ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  executeProposalHook: ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  pause: ({
    duration
  }: {
    duration: object;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  receive: ({
    amount,
    msg,
    sender
  }: {
    amount: string;
    msg: string;
    sender: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  receiveNft: ({
    msg,
    sender,
    tokenId
  }: {
    msg: string;
    sender: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  removeItem: ({
    key
  }: {
    key: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  setItem: ({
    addr,
    key
  }: {
    addr: string;
    key: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  nominateAdmin: ({
    admin
  }: {
    admin?: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  acceptAdminNomination: (fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  withdrawAdminNomination: (fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  updateConfig: ({
    config
  }: {
    config: Config;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  updateCw20List: ({
    toAdd,
    toRemove
  }: {
    toAdd: string[];
    toRemove: string[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  updateCw721List: ({
    toAdd,
    toRemove
  }: {
    toAdd: string[];
    toRemove: string[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  updateProposalModules: ({
    toAdd,
    toDisable
  }: {
    toAdd: ModuleInstantiateInfo[];
    toDisable: string[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
  updateVotingModule: ({
    module
  }: {
    module: ModuleInstantiateInfo;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: readonly Coin[]) => Promise<ExecuteResult>;
}
export class CwCoreClient extends CwCoreQueryClient implements CwCoreInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.executeAdminMsgs = this.executeAdminMsgs.bind(this);
    this.executeProposalHook = this.executeProposalHook.bind(this);
    this.pause = this.pause.bind(this);
    this.receive = this.receive.bind(this);
    this.receiveNft = this.receiveNft.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.setItem = this.setItem.bind(this);
    this.nominateAdmin = this.nominateAdmin.bind(this);
    this.acceptAdminNomination = this.acceptAdminNomination.bind(this);
    this.withdrawAdminNomination = this.withdrawAdminNomination.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.updateCw20List = this.updateCw20List.bind(this);
    this.updateCw721List = this.updateCw721List.bind(this);
    this.updateProposalModules = this.updateProposalModules.bind(this);
    this.updateVotingModule = this.updateVotingModule.bind(this);
  }

  executeAdminMsgs = async ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      execute_admin_msgs: {
        msgs
      }
    }, fee, memo, funds);
  };
  executeProposalHook = async ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      execute_proposal_hook: {
        msgs
      }
    }, fee, memo, funds);
  };
  pause = async ({
    duration
  }: {
    duration: object;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      pause: {
        duration
      }
    }, fee, memo, funds);
  };
  receive = async ({
    amount,
    msg,
    sender
  }: {
    amount: string;
    msg: string;
    sender: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      receive: {
        amount,
        msg,
        sender
      }
    }, fee, memo, funds);
  };
  receiveNft = async ({
    msg,
    sender,
    tokenId
  }: {
    msg: string;
    sender: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      receive_nft: {
        msg,
        sender,
        token_id: tokenId
      }
    }, fee, memo, funds);
  };
  removeItem = async ({
    key
  }: {
    key: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_item: {
        key
      }
    }, fee, memo, funds);
  };
  setItem = async ({
    addr,
    key
  }: {
    addr: string;
    key: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_item: {
        addr,
        key
      }
    }, fee, memo, funds);
  };
  nominateAdmin = async ({
    admin
  }: {
    admin?: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      nominate_admin: {
        admin
      }
    }, fee, memo, funds);
  };
  acceptAdminNomination = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      accept_admin_nomination: {}
    }, fee, memo, funds);
  };
  withdrawAdminNomination = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      withdraw_admin_nomination: {}
    }, fee, memo, funds);
  };
  updateConfig = async ({
    config
  }: {
    config: Config;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_config: {
        config
      }
    }, fee, memo, funds);
  };
  updateCw20List = async ({
    toAdd,
    toRemove
  }: {
    toAdd: string[];
    toRemove: string[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_cw20_list: {
        to_add: toAdd,
        to_remove: toRemove
      }
    }, fee, memo, funds);
  };
  updateCw721List = async ({
    toAdd,
    toRemove
  }: {
    toAdd: string[];
    toRemove: string[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_cw721_list: {
        to_add: toAdd,
        to_remove: toRemove
      }
    }, fee, memo, funds);
  };
  updateProposalModules = async ({
    toAdd,
    toDisable
  }: {
    toAdd: ModuleInstantiateInfo[];
    toDisable: string[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_proposal_modules: {
        to_add: toAdd,
        to_disable: toDisable
      }
    }, fee, memo, funds);
  };
  updateVotingModule = async ({
    module
  }: {
    module: ModuleInstantiateInfo;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_voting_module: {
        module
      }
    }, fee, memo, funds);
  };
}