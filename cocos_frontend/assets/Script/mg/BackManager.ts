
import * as cc from 'cc';

import '../runtime';
import { _decorator } from 'cc';
import LoginManager from "./LoginManager";
import { computeEthAddressFromPublicKey, isHexString, hexToBytes } from '../eth-utils';
import { idlFactoryBack } from "./backend.did";

import { BACKEND_CANISTER_ID_LOCAL_FALLBACK, DFX_NETWORK } from "./DefData";
import { createIcpAgent } from './IcpAgentFactory';

function getIcpSdkAgent(): any {
    const mod = (globalThis as any)?.DfinityAgent;
    if (!mod) throw new Error('DfinityAgent not loaded. Ensure lib3/icp-sdk-agent.js is loaded before application.js');
    return mod;
}

export default class BackManager {
    public static readonly Instance: BackManager = new BackManager();
    private constructor() {}
    private backendActor: any = null;
    Init() {

    }
    private getGlobal(): any {
        // return (typeof globalThis !== 'undefined'
        // ? globalThis
        // : (typeof window !== 'undefined'
        // ? window
        // : (typeof self !== 'undefined' ? self : {})));
    }
    private getBackendCanisterId(): string {
           return BACKEND_CANISTER_ID_LOCAL_FALLBACK;
    }
    private getAgentHost(): string | undefined {
       
       // 如果是本地开发环境，强制指向本地 replica 地址，避免 Cocos Preview (localhost:7456) 拦截请求
        if (DFX_NETWORK === 'local') {
        return 'http://127.0.0.1:4943';
        }
       // 如果是 IC 主网，host 设为 undefined 或 "https://ic0.app"，HttpAgent 默认会连接主网
        return "https://ic0.app";
    }
    private async ensureBackendActor(): Promise<any> {
        if (this.backendActor) return this.backendActor;
       //if (this.isEditorOrPreview()) throw new Error('Backend actor disabled in editor/preview');

        await LoginManager.Instance.ensureAuthClient();
        const identity = await LoginManager.Instance.getIdentity();

        const canisterId = this.getBackendCanisterId();
        if (!canisterId) throw new Error('Backend canisterId not found');

        const host = this.getAgentHost();
        cc.log("BackManager: creating agent with host:", host);
		const agent = await createIcpAgent({
			identity,
			host,
			isLocal: DFX_NETWORK === 'local',
			verifyQuerySignatures: false,
			fetchRootKey: true,
		});

        const Actor = getIcpSdkAgent()?.Actor;
        if (!Actor) throw new Error('DfinityAgent.Actor missing');

        this.backendActor = Actor.createActor(idlFactoryBack, { agent, canisterId });
        return this.backendActor;
    }
    async GetEthAddress(): Promise<string> {
        cc.log("BackManager: GetEthAddress called");
        const actor = await this.ensureBackendActor();
        cc.log("BackManager: actor ensured");

        const publicKey = await actor.get_eth_public_key();
        cc.log("BackManager: publicKey received:", publicKey);
        const pkBytes = new Uint8Array(publicKey);
        cc.log("BackManager: GetEthAddress publicKey bytes:", pkBytes);

        return computeEthAddressFromPublicKey(pkBytes);
    }
    async Sign(data: Uint8Array | number[] | string): Promise<Uint8Array> {
        cc.log("BackManager: Sign called");
        const actor = await this.ensureBackendActor();
        cc.log("BackManager: actor ensured for signing");

        let bytes: Uint8Array;
         if (typeof data === 'string') {
         try {
         bytes = isHexString(data) ? hexToBytes(data) : new TextEncoder().encode(data);
         } catch (e) {
             // 如果不是 hex 字符串，按 UTF-8 编码
         bytes = new TextEncoder().encode(data);
         }
        } else if (data instanceof Uint8Array) {
        bytes = data;
        } else if (Array.isArray(data)) {
        bytes = new Uint8Array(data);
        } else {
        throw new Error('BackManager.Sign: unsupported data type');
        }

        cc.log("BackManager: signing bytes length=", bytes.length);
        const sigBlob = await actor.sign(Array.from(bytes));
        const sigBytes = new Uint8Array(sigBlob);
        cc.log("BackManager: signature bytes length=", sigBytes.length);
        return sigBytes;
    }
}

