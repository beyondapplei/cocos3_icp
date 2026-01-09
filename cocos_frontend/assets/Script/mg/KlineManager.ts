
import * as cc from 'cc';
import { _decorator } from 'cc';
import LoginManager from "./LoginManager";
import { idlFactoryKline } from "../did/kline.did";

import { BACKEND_CANISTER_ID_LOCAL_FALLBACK, DFX_NETWORK } from "./DefData";
import { createIcpAgent } from './IcpAgentFactory';

export const KLINE_CID = "kvpy3-faaaa-aaaaf-qb7aq-cai";


function getIcpSdkAgent(): any {
    const mod = (globalThis as any)?.DfinityAgent;
    if (!mod) throw new Error('DfinityAgent not loaded. Ensure lib3/icp-sdk-agent.js is loaded before application.js');
    return mod;
}

class DayLineData {
    date: number;
    closing_price: number;

}

class CoinLineData{
    nId:number;
    sName: string;
    vPrice: DayLineData[] = [];

}

export default class KlineManager {
    public static readonly Instance: KlineManager = new KlineManager();
    private constructor() {}
    private klineActor: any = null;
    Init() {

    }
    private vcurrencies: string[] = [];

    private vCoinData: CoinLineData[] = [];
    private mapCoinData: Map<string, CoinLineData> = new Map<string, CoinLineData>();

    getCoinData(): CoinLineData[]{
        return this.vCoinData;
    }

    async requireCoinLineData(){
        await this.getStoredCurrencies();
        const actor = await this.ensureKlineActor();
        this.vCoinData = [];

        for(const symbol of this.vcurrencies){
            const vdata = await actor.getCurrencyData(symbol); //返回(IDL.Vec(IDL.Tuple(IDL.Nat, KLineData)))
            if(vdata && vdata.length > 0){
               
                const coindata = new CoinLineData();

                for(const item of vdata){
                    const daydata = new DayLineData();
                    daydata.date = Number(item[0]);
                    daydata.closing_price = Number(item[1].close);
                    coindata.vPrice.push(daydata);
                    cc.log('requireCoinLineData symbol='+symbol+' date='+daydata.date+' close='+daydata.closing_price);
                }

                coindata.nId = this.vCoinData.length + 1;
                coindata.sName = symbol;
            
                
                this.vCoinData.push(coindata);
            }
        }

    }



    private getAgentHost(): string | undefined {
       
        return "https://ic0.app";
    }
    private async ensureKlineActor(): Promise<any> {
        if (this.klineActor) return this.klineActor;
       //if (this.isEditorOrPreview()) throw new Error('Backend actor disabled in editor/preview');

        await LoginManager.Instance.ensureAuthClient();
        const identity = await LoginManager.Instance.getIdentity();

        const canisterId = KLINE_CID;
        if (!canisterId) throw new Error('Backend canisterId not found');

        const host = this.getAgentHost();
        cc.log("BackManager: creating agent with host:", host);
		const agent = await createIcpAgent({
			identity,
			host,
			isLocal: DFX_NETWORK === 'local',
			verifyQuerySignatures: false,
			fetchRootKey: true,
            forceApiV2: DFX_NETWORK === 'local',
		});

        const Actor = getIcpSdkAgent()?.Actor;
        if (!Actor) throw new Error('DfinityAgent.Actor missing');

        this.klineActor = Actor.createActor(idlFactoryKline, { agent, canisterId });
        return this.klineActor;
    }

   async getStoredCurrencies(){

        const actor = await this.ensureKlineActor();
        this.vcurrencies = await actor.getStoredCurrencies();

    }

    

   

  



}

