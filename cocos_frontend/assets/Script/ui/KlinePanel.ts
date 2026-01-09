import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import {TableView,CellData} from "./TableView";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
import KlineManager from '../mg/KlineManager';


class KLineCell extends CellData{
    labName:cc.Label;
    btnIcon:cc.Button;
    labContent:cc.RichText;
    nOldBgHeight:number;
    labPriceLow:cc.Label;
    labPriceHi:cc.Label;
    labPriceScale:cc.Label;
    labCap:cc.Label;

    init(node){
        this.node = node;
        this.btnIcon = this.node.getChildByName('btnicon').getComponent(cc.Button);
        this.labName = this.btnIcon.node.getChildByName('labelname').getComponent(cc.Label);
        this.labCap = this.btnIcon.node.getChildByName('labelcap').getComponent(cc.Label);
        const uiTrans = this.node.getComponent(cc.UITransform);
        this.nOldBgHeight = uiTrans ? uiTrans.height : 0;
    }
    refreshUI(info: ListCellData){
        this.labName.string = info.sName;//sName
        this.labCap.string = info.nId.toString()
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
        
        KlineManager.Instance.requireCoinLineData()
    
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
        let cellInfo = this.vListData[nIndex];
        cellData.refreshUI(cellInfo);
        cellData.btnIcon.nTag = nIndex;
        
        return cellData;
    }

    updateKlineData(symbol: string, price: string, volume: string) {
        
    }

  

  

    onBackClick() {
        UIManager.Instance.closePanel(EUIPanelType.HOMELIST);
    }

    onDestroy() {
        // Cleanup code here
    }
}
