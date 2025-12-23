import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'get_eth_public_key' : ActorMethod<[], Uint8Array | number[]>,
  'greet' : ActorMethod<[string], string>,
  'setGreeting' : ActorMethod<[string], undefined>,
  'sign' : ActorMethod<[Uint8Array | number[]], Uint8Array | number[]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
