import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import {TableView,CellData} from "./TableView";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
import KlineManager, { CoinPercentData } from '../mg/KlineManager';



class KLineCell extends CellData{
    labName:cc.Label;
    btnIcon:cc.Button;
    labContent:cc.RichText;
    nOldBgHeight:number;
    labPriceLow:cc.Label;
    labPriceHi:cc.Label;
    labPriceScale:cc.Label;
    labCap:cc.Label;
    labRank:cc.Label;

    init(node){
        this.node = node;
        this.btnIcon = this.node.getChildByName('btnicon').getComponent(cc.Button);
        this.labName = this.btnIcon.node.getChildByName('labelname').getComponent(cc.Label);
        this.labCap = this.btnIcon.node.getChildByName('labelcap').getComponent(cc.Label);
        this.labRank = this.btnIcon.node.getChildByName('labelrank').getComponent(cc.Label);
        const uiTrans = this.node.getComponent(cc.UITransform);
        this.nOldBgHeight = uiTrans ? uiTrans.height : 0;
    }
    refreshUI(info: CoinPercentData){
        this.labName.string = info.sName;//sName
        this.labCap.string = info.nPercent.toString()
        this.labRank.string = info.nId.toString();
    }
}


@ccclass('KlinePanel')
export default class KlinePanel extends UIPanel{

    @property(cc.Label)
    labelSymbol: cc.Label;

    @property(cc.Button)
    btnBuy: cc.Button;

    @property(cc.Button)
    btnSell: cc.Button;

    @property(cc.Button)
    btnBack: cc.Button;

    @property(cc.Label)
    labelPrice: cc.Label;

    @property(cc.Label)
    labelVolume: cc.Label;

    tableview: TableView;


    vCoinRankData: CoinPercentData[] = [];


    onLoad(){
       

        this.tableview = this.node.getChildByName('tableview').getComponent(TableView);
        this.tableview.setRefreshCellCallBack(this, this.refreshCell, this.getCellHeight);

        this.tableview.nodeElement.active = false;
  

        const btnBackNode = this.node.getChildByName('btnback');
        if (btnBackNode) {
            this.btnBack = btnBackNode.getComponent(cc.Button);
            this.btnBack.node.on(cc.Node.EventType.TOUCH_END, this.onBackClick.bind(this), this);
        }

     


        this.updateKlineData("BTC/USDT", "45000.00", "1234.56");
    }


    start () {
        // Initialization code here
    }
    OnOpen( strParam: string)
    {
        
        //KlineManager.Instance.requireCoinLineData()

        // 转换日期字符串到时间戳
        const startDateStr = "20251231";
        const endDateStr = "20260110";
        
        const startYear = parseInt(startDateStr.substring(0, 4));
        const startMonth = parseInt(startDateStr.substring(4, 6)) - 1; // 月份从 0 开始
        const startDay = parseInt(startDateStr.substring(6, 8));
        const startdate: number = new Date(startYear, startMonth, startDay).getTime()/1000;
        
        const endYear = parseInt(endDateStr.substring(0, 4));
        const endMonth = parseInt(endDateStr.substring(4, 6)) - 1;
        const endDay = parseInt(endDateStr.substring(6, 8));
        const enddate: number = new Date(endYear, endMonth, endDay).getTime()/1000;
        
        this.vCoinRankData = KlineManager.Instance.GetRankStartToEnd(startdate, enddate);
        this.tableview.reloadData(this.vCoinRankData.length);
    
    }

    getCellHeight(nIndex:number)
    {
        return 200;
        
    }
    refreshCell( nIndex:number)
    {
        let cellData:any = this.tableview.dequeueCell();
        if(cellData === null)
        {
            cellData = new KLineCell();
            let node = this.tableview.createElementNode();
            node.active = true;
            cellData.init(node);
            cellData.btnIcon.node.on(cc.Node.EventType.TOUCH_END, this.clickCell.bind(this,cellData.btnIcon),this);
        }
        cc.log('refreshCell'+nIndex);
        let cellInfo = this.vCoinRankData[nIndex];
        cellData.refreshUI(cellInfo);
        cellData.btnIcon.nTag = nIndex;
        
        return cellData;
    }

    updateKlineData(symbol: string, price: string, volume: string) {
        
    }

  

  clickCell(){

  }

    onBackClick() {
        UIManager.Instance.closePanel(EUIPanelType.HOMELIST);
    }

    onDestroy() {
        // Cleanup code here
    }
}
