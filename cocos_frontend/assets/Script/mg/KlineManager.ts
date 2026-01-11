
import * as cc from 'cc';
import { _decorator } from 'cc';
import LoginManager from "./LoginManager";
import { idlFactoryKline } from "../did/kline.did";

import {  DFX_NETWORK } from "./DefData";
import { createIcpAgent } from './IcpAgentFactory';

export const KLINE_CID = "kvpy3-faaaa-aaaaf-qb7aq-cai";


function getIcpSdkAgent(): any {
    const mod = (globalThis as any)?.DfinityAgent;
    if (!mod) throw new Error('DfinityAgent not loaded. Ensure lib3/icp-sdk-agent.js is loaded before application.js');
    return mod;
}

export class DayLineData {
    date: number;
    closing_price: number;

}

export class CoinLineData{
    nId:number;
    sName: string;
    mapPrice: Map<number, DayLineData> = new Map<number, DayLineData>();

}

export class CoinPercentData{
    nId:number;
    sName: string;
    nPercent: number;
    nStartPrice: number;
    nEndPrice: number;
}

export default class KlineManager {
    public static readonly Instance: KlineManager = new KlineManager();
    private constructor() {}
    private klineActor: any = null;
    Init() {
        this.requireCoinLineData();

    }
    vcurrencies: string[] = [];

    private vCoinData: CoinLineData[] = [];
    private mapCoinData: Map<string, CoinLineData> = new Map<string, CoinLineData>();

    getCoinDataArray(nstartTime:number, nendTime:number): CoinLineData[] {

        const vCoinD: CoinLineData[] = [];

        for(const coindata of this.vCoinData){
            
            const vFilteredPrices: DayLineData[] = [];
        
            for(const daydata of coindata.mapPrice.values()){
                if(daydata.date >= nstartTime && daydata.date <= nendTime){
                    vFilteredPrices.push(daydata);
                }
            }

            const coinLineData = new CoinLineData();
            coinLineData.sName = coindata.sName;
            coinLineData.mapPrice = new Map<number, DayLineData>();
            for (const dayData of vFilteredPrices) {
                coinLineData.mapPrice.set(dayData.date, dayData);
            }

            vCoinD.push(coinLineData);
        }

        return vCoinD;

    }

    GetRankStartToEnd(nStartTiem:number, nEndTime:number): CoinPercentData[] {
        
        const vCoinD: CoinLineData[] = this.getCoinDataArray(nStartTiem, nEndTime);
        
        const vCoinPer: CoinPercentData[] = [];
        for(const coindata of vCoinD){
            if(coindata.mapPrice.size >= 2){
                const nFirstPrice = coindata.mapPrice.values().next().value.closing_price;
                const nLastPrice = Array.from(coindata.mapPrice.values())[coindata.mapPrice.size -1].closing_price;
                const nPercent = ((nLastPrice - nFirstPrice) / nFirstPrice) * 100;

                const coinPerData = new CoinPercentData();
                coinPerData.sName = coindata.sName;
                coinPerData.nPercent = parseFloat(nPercent.toFixed(1)); //保留一位小数
                coinPerData.nStartPrice = nFirstPrice;
                coinPerData.nEndPrice = nLastPrice;
                vCoinPer.push(coinPerData);
            }
        }
        
        vCoinPer.sort((a, b) => b.nPercent - a.nPercent);   
        for(let i = 0; i < vCoinPer.length; i++){
            vCoinPer[i].nId = i + 1; //排名从1开始
        }
        
        return vCoinPer;
    }

    getCoinData(): CoinLineData[]{
        return this.vCoinData;
    }

    async saveKLineData(symbol: string, nstartTime:number, nendTime:number, vdata: [bigint, bigint][]): Promise<void> {
        const actor = await this.ensureKlineActor();
        await actor.storeKLineData(symbol, vdata);
    }

    async GetKLineDataBySymbol(symbol: string, nstartTime:number, nendTime:number): Promise<DayLineData[]> {
        const vDayLineData: DayLineData[] = [];
        const actor = await this.ensureKlineActor();

        const vdata = await actor.getKLineData(symbol, BigInt(nstartTime), BigInt(nendTime));

        for(const dayItem of vdata){
            const daydata = new DayLineData();
            daydata.date = Number(dayItem[0]);
            // Check if dayItem[1] is object or value. Based on error trace it is value (IDL.Nat)
            // If it was record { close: Nat }, then dayItem[1].close.
            // But kline.did.ts says Tuple(Nat, Nat).
            daydata.closing_price = Number(dayItem[1])/10000; //后端存的是放大了10000倍的价格
            vDayLineData.push(daydata);
        }
        return vDayLineData;
    }


    async requireCoinLineData(){
        cc.log("KlineManager: requireCoinLineData start (getAllData version)");

        if (this.vcurrencies.length > 0) {
            return;
        }   

        
        const actor = await this.ensureKlineActor();
        this.vCoinData = [];
        this.mapCoinData.clear();
        this.vcurrencies = [];

        // getAllData returns all symbols and their kline data
        const allData = await actor.getAllData();

        for(const item of allData){
            const symbol = item[0];
            const vdata = item[1];
            this.vcurrencies.push(symbol);

            if(vdata && vdata.length > 0){
               
                const coindata = new CoinLineData();
                coindata.nId = this.vCoinData.length + 1;
                coindata.sName = symbol;

                for(const dayItem of vdata){
                    const daydata = new DayLineData();
                    daydata.date = Number(dayItem[0]);
                    // Check if dayItem[1] is object or value. Based on error trace it is value (IDL.Nat)
                    // If it was record { close: Nat }, then dayItem[1].close.
                    // But kline.did.ts says Tuple(Nat, Nat).
                    daydata.closing_price = Number(dayItem[1]);
                    coindata.mapPrice.set(daydata.date, daydata);

                    let strDateTime = this.datestampToString(daydata.date);
                    cc.log(`KlineManager: symbol=${symbol}, date=${strDateTime}, closing_price=${daydata.closing_price}`); 
                }

                this.vCoinData.push(coindata);
                this.mapCoinData.set(symbol, coindata);
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



    strToDatestamp(dateStr: string): number {
        

        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1; // 月份从 0 开始
        const day = parseInt(dateStr.substring(6, 8));
        const date: number = new Date(year, month, day).getTime()/1000;
        return date;
    }

    //20250112
    datestampToString(dateStamp: number): string {
        //把时间戳转换成日期字符串YYYYMMDD
        const date = new Date(dateStamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;

        
    }


    

   

  



}

