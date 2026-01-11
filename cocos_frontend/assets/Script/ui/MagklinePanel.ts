
import * as cc from 'cc';
import { _decorator, EditBox, Label } from 'cc';

const {ccclass, property} = _decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import { EUIPanelType } from "../CommonEnum";
import {TableView,CellData} from "./TableView";
import ResManager from "../mg/ResManager";
import ICPManager from "../mg/ICPManager";
import LoginManager from "../mg/LoginManager";
import { LEAGER_ICP_ID_LOCAL } from "../mg/DefData";

import KlineManager from "../mg/KlineManager";
import BitgetManager from '../mg/BitgetManager';

@ccclass('MagklinePanel')
export default class MagklinePanel extends UIPanel {
    tableview: TableView;
  
    editBox: EditBox;
    nIndexReq: number;
    nOrderState: number;
    labelrec: Label;
    labelbalance: Label;
    boxtoaddress: EditBox;
    boxamount: EditBox;
    onLoad(){

        const btnNode =  this.node.getChildByName('btnbegin');
        btnNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this, 109825), this);

        const btnBack =  this.node.getChildByName('btnback');
        btnBack.on(cc.Node.EventType.TOUCH_END, this.clickBack.bind(this, 1098215), this);

        this.labelrec = this.node.getChildByName('labelrec').getComponent(cc.Label);
        this.labelbalance = this.node.getChildByName('labelbalance').getComponent(cc.Label);

        this.boxtoaddress = this.node.getChildByName('boxtoaddress').getComponent(cc.EditBox);
        this.boxamount = this.node.getChildByName('boxamount').getComponent(cc.EditBox);

        this.labelrec.string = "ICP Rec Address:\n" + "abcd-efgh-ijkl-mnop-qrst-uvwx-yz12-3456-7890";
        this.labelbalance.string = "Balance: 123.456 ICP";

    }
    start () {
    }
    RefreshUI(){

    }
    RefreshData() {

    }
    OnOpen( strParam: string)
    {
        let principalText = LoginManager.Instance.getPrincipalText();
           
        this.labelrec.string =  principalText || "";
        this.labelbalance.string = "Balance: loading...";
      

    }

    
    OnClose()
    {
        
    }

    clickBack(nTag){
        console.log('clickback'+nTag);
        UIManager.Instance.OpenPanel(EUIPanelType.HOMELIST);
    }

    clickBegin(nTag){
        //同步数据
        console.log('clickbegin'+nTag);

        let sStartTime = (this.boxtoaddress && this.boxtoaddress.string) ? this.boxtoaddress.string.trim() : '';
        let nEndTime = (this.boxamount && this.boxamount.string) ? this.boxamount.string.trim() : '';
        if (!sStartTime || !nEndTime) {
            UIManager.ShowTip('请输入');
            return;
        }

        const startdate: number = KlineManager.Instance.strToDatestamp(sStartTime) ;
        const enddate: number = KlineManager.Instance.strToDatestamp(nEndTime) ;

        this.updateKlineData(startdate, enddate);
          
        

    }


    async updateKlineData(startdate: number, enddate: number) {

        

        for (let coin of KlineManager.Instance.vcurrencies) {
            cc.log(`Updating Kline Data for Coin: ${coin}`);
            await this.UpdateCoin(coin, startdate, enddate);
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3000ms 延时   
        }       

       

    }

    async UpdateCoin(sCoin: string, startdate: number, enddate: number){

        let vKlineData = await KlineManager.Instance.GetKLineDataBySymbol(sCoin, startdate, enddate);
        for (let i = 0; i < vKlineData.length; i++) {
            let dayData = vKlineData[i];
            let strDateTime = KlineManager.Instance.datestampToString(dayData.date);
            cc.log(`cid Date: ${strDateTime}, Closing Price: ${dayData.closing_price}`);
        }

        let urlstartdate = startdate * 1000;
        let urlenddate = enddate * 1000;
        let vDaylineData = await BitgetManager.Instance.GetBitgetCoinData(sCoin, urlstartdate.toString(), urlenddate.toString())
        for (let i = 0; i < vDaylineData.length; i++) {
            let dayData = vDaylineData[i];
            let strDateTime = KlineManager.Instance.datestampToString(dayData.date);
            cc.log(`Date: ${strDateTime}, Closing Price: ${dayData.closing_price}`);
        } 

        await KlineManager.Instance.saveKLineData(sCoin, startdate, enddate, vDaylineData.map(item => [BigInt(item.date), BigInt(Math.floor(item.closing_price * 10000))]));



        let vKlineData2 = await KlineManager.Instance.GetKLineDataBySymbol(sCoin, startdate, enddate);
        for (let i = 0; i < vKlineData2.length; i++) {
            let dayData = vKlineData2[i];
            let strDateTime = KlineManager.Instance.datestampToString(dayData.date);
            cc.log(`cid Date2: ${strDateTime}, Closing Price: ${dayData.closing_price}`);
        }

    }
}


    

