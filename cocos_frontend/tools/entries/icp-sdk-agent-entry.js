// Bundling entry for Cocos lib3: icp-sdk-agent.js
// Exposes a global `DfinityAgent` compatible with the existing project usage.

export { Actor, HttpAgent, AnonymousIdentity, Cbor } from '@icp-sdk/core/agent';
export { Principal } from '@icp-sdk/core/principal';
export { IDL } from '@icp-sdk/core/candid';
