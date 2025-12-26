import type { Principal } from '@icp-sdk/core/principal';
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export interface _SERVICE {
  'get_eth_public_key' : ActorMethod<[], Uint8Array | number[]>,
  'greet' : ActorMethod<[string], string>,
  'setGreeting' : ActorMethod<[string], undefined>,
  'sign' : ActorMethod<[Uint8Array | number[]], Uint8Array | number[]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
