
import * as cc from 'cc';
import { _decorator } from 'cc';
import LoginManager from "./LoginManager";
import { idlFactoryKline } from "../did/kline.did";

import {  DFX_NETWORK } from "./DefData";

import KlineManager, { CoinPercentData,DayLineData } from './KlineManager';



export default class BitgetManager {
    public static readonly Instance: BitgetManager = new BitgetManager();
    private constructor() {}

    Init() {
      

    }
    private vcurrencies: string[] = [];

    //https://api.bitget.com/api/v2/spot/market/candles?symbol=btcusdt&granularity=1day
    async GetBitgetCoinData(symbol: string,startTime?: string, endTime?: string): Promise<DayLineData[]> {
        // Bitget V2 API: GET /api/v2/spot/market/candles
        symbol = symbol.replace("/", "");
        let url = `https://api.bitget.com/api/v2/spot/market/candles?symbol=${symbol}usdt&granularity=1day`;
        
        if (startTime) url += `&startTime=${startTime}`;
        if (endTime) url += `&endTime=${endTime}`;
        // Bitget V2 limit默认可能较小，也可以显式加上 limit=1000 (最大值)
        url += `&limit=1000`;

        cc.log("Bitget API URL:", url);

        try {
            const response = await fetch(url);
            const resData = await response.json();
            
            const vPrice: DayLineData[] = [];
            if (resData.code === "00000" && resData.data) {
                // response data: [[ts, o, h, l, c, vol, quoteVol, ...], ...]
                for (let i = 0; i < resData.data.length; i++) {
                    const item = resData.data[i];
                    let dayData = new DayLineData();
                    dayData.date = Number(item[0])/1000; // timestamp string -> number
                    dayData.closing_price = Number(item[4]); // close price string -> number
                    vPrice.push(dayData);
                }
                
                // Bitget API 返回数据顺序通常是最新的在前 (descending)，还是旧的在前？
                // 通常K线接口如果不指定顺序，很多时候是最新的在前面。
                // 我们按照时间升序排列比较好处理
                //vPrice.sort((a, b) => a.date - b.date);
            } else {
                cc.error("Bitget API Error:", resData.msg);
            }
            return vPrice;
        } catch (e) {
            cc.error("Fetch Bitget Error:", e);
            return [];
        }
    }




    

   

  



}

