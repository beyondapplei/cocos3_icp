// // Revert to bundled file

import * as cc from 'cc';
import { _decorator } from 'cc';
import UIManager from "../mg/UIManager";
import LoginManager from "./LoginManager";
import { DFX_NETWORK, LEAGER_ICP_ID_LOCAL } from "./DefData";

import { createIcpAgent } from './IcpAgentFactory';


import { idlFactoryLedger } from "./icp_ledger.did";

function getIcpSdkAgent(): any {
    const mod = (globalThis as any)?.DfinityAgent;
    if (!mod) throw new Error('DfinityAgent not loaded. Ensure lib3/icp-sdk-agent.js is loaded before application.js');
    return mod;
}

function getIcpPrincipal(): any {
    const Principal = getIcpSdkAgent()?.Principal;
    if (!Principal) throw new Error('DfinityAgent.Principal missing');
    return Principal;
}

export default class ICPManager {
    public static readonly Instance: ICPManager = new ICPManager();
    private ICPManager(){
    }           
 
    Init(){


    }
    private ledgerActor: any = null;
    private ledgerCanisterId: string | null = null;
    private getAgentHost(): string | undefined {
        if (DFX_NETWORK === 'local') {
        return 'http://127.0.0.1:4943';
        }
        return 'https://ic0.app';
    }
    private getDefaultLedgerCanisterId(): string {
        if (DFX_NETWORK === 'local') {
        return LEAGER_ICP_ID_LOCAL;
        }
        return 'ryjl3-tyaaa-aaaaa-aaaba-cai';
    }
    private async ensureLedgerActor(strLedgerCanisterId?: string): Promise<any> {

        const canisterId = (strLedgerCanisterId && strLedgerCanisterId.trim())
        ? strLedgerCanisterId.trim()
        : this.getDefaultLedgerCanisterId();

        cc.log("ICPManager: ensureLedgerActor using canisterId:", canisterId);

        if (this.ledgerActor && this.ledgerCanisterId === canisterId) {
        return this.ledgerActor;
        }

        await LoginManager.Instance.ensureAuthClient();
        const identity = await LoginManager.Instance.getIdentity();

        const host = this.getAgentHost();
       // Cocos 运行环境下，query 签名验证会触发 fetchSubnetKeys -> canisterStatus.request，
       // 某些环境会在 encodePath 阶段出现 "[object Set]" 的路径编码异常。
       // 为保证查询/转账流程可用，这里先关闭 query 签名验证。
		const agent = await createIcpAgent({
			identity,
			host,
			isLocal: DFX_NETWORK === 'local',
			verifyQuerySignatures: false,
			fetchRootKey: true,
		});
       //如果不是本地环境，不用调用 fetchRootKey

        const Actor = getIcpSdkAgent()?.Actor;
        if (!Actor) throw new Error('DfinityAgent.Actor missing');

        const canisterPrincipal = getIcpPrincipal().fromText(canisterId);
        this.ledgerActor = Actor.createActor(idlFactoryLedger, { agent, canisterId: canisterPrincipal });
        this.ledgerCanisterId = canisterId;
        return this.ledgerActor;
    }
    private parseIcpToE8s(amountText: string): number {
        const s = (amountText || '').trim();
        if (!s) throw new Error('amount is empty');
        if (!/^[0-9]+(\.[0-9]+)?$/.test(s)) throw new Error('invalid amount');

        const [intPart, fracPartRaw] = s.split('.');
        const fracPart = (fracPartRaw || '');
        if (fracPart.length > 8) throw new Error('too many decimals (max 8)');

        const fracPadded = (fracPart + '00000000').slice(0, 8);

       // 用 number 表示 e8s（TS target=es5，不使用 BigInt）。
       // 注意：只能安全表示 <= Number.MAX_SAFE_INTEGER 的 e8s。
        const e8s = parseInt(intPart, 10) * 100000000 + parseInt(fracPadded, 10);
        if (!Number.isFinite(e8s) || e8s < 0) {
        throw new Error('invalid amount');
        }
        if (e8s > Number.MAX_SAFE_INTEGER) {
        throw new Error('amount too large');
        }
        return e8s;
    }
    async GetBalance(principalText: string, strLedgerCanisterId: string): Promise<string> {
        const pText = (principalText || '').trim();
        if (!pText) return 'Balance: 0 ICP';

        const actor = await this.ensureLedgerActor(strLedgerCanisterId);

        cc.log("GetBalance principalText=",principalText);

        const owner = getIcpPrincipal().fromText(pText);
        const balanceE8sAny: any = await actor.icrc1_balance_of({ owner, subaccount: [] });
        const balanceE8sNum = Number(balanceE8sAny && balanceE8sAny.toString ? balanceE8sAny.toString() : balanceE8sAny);
        const balance = balanceE8sNum / 1e8;
        cc.log("GetBalance balance=", balance);
        return `Balance: ${balance.toFixed(8)} ICP`;
    }
    async SendICP(toPrincipalText: string, amountText: string, strLedgerCanisterId: string): Promise<string> {

        const toText = (toPrincipalText || '').trim();
        if (!toText) throw new Error('to address is empty');

        const actor = await this.ensureLedgerActor(strLedgerCanisterId);
        cc.log("SendICP toText=",toText);
		const toOwner = getIcpPrincipal().fromText(toText);
        cc.log("SendICP toOwner=", toOwner);
        const amountE8s = this.parseIcpToE8s(amountText);

        cc.log(`SendICP to=${toText} amount=${amountText} (${amountE8s} e8s)`);

       // Standard ICP fee is 10_000 e8s (0.0001 ICP)
       // const feeE8s = 10000;

        const res = await actor.icrc1_transfer({
        from_subaccount: [],
        to: { owner: toOwner, subaccount: [] },
        fee: [], // Use default fee
        memo: [],
        created_at_time: [],
        amount: amountE8s,
        });

        if (res && (res.Ok !== undefined)) {
        UIManager.ShowTip(`SendICP ok, blockIndex=${res.Ok}`);
        return `OK: blockIndex=${res.Ok}`;
        }
        const err = res && res.Err ? res.Err : res;
        // JSON.stringify cannot handle BigInt by default
        const errStr = JSON.stringify(err, (key, value) => (typeof value === 'bigint' ? value.toString() : value));
        throw new Error(`SendICP failed: ${errStr}`);
    }
    
}

