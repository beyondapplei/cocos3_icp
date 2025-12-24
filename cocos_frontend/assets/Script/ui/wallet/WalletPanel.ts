
import * as cc from 'cc';
import { _decorator, Label, Button, RichText, EditBox, Node, log } from 'cc';
const {ccclass, property} = _decorator;

import UIPanel from "../UIPanel"
import UIManager from "../../mg/UIManager";
import { EUIPanelType } from "../../CommonEnum";
import {TableView,CellData} from "../TableView";
import ResManager from "../../mg/ResManager";
class WalletData extends CellData{
    labName:Label;
    btnIcon:Button;
    labContent:RichText;
    nOldBgHeight:number;
    labPriceLow:Label;
    labPriceHi:Label;
    labPriceScale:Label;
    labCap:Label;
    init(node){
        this.node = node;
        this.btnIcon = this.node.getChildByName('btnicon').getComponent(Button);
          this.labName = this.btnIcon.node.getChildByName('labelname').getComponent(Label);
        this.labCap = this.btnIcon.node.getChildByName('labelcap').getComponent(Label);
        this.nOldBgHeight = this.node.height;
    }
    refreshUI(info:WalletCellData){
        this.labName.string = info.nId.toString();//sName
        this.labCap.string = info.sName
    }
}
class WalletCellData{
    nId:number;
    sName: string;
}

@ccclass('WalletPanel')
export default class WalletPanel extends UIPanel {
    tableview: TableView;
    vListData: WalletCellData[] = [];
  
    editBox: EditBox;
    nIndexReq: number;
    nOrderState: number;
    onLoad(){
        
        let btnBeginNode = this.node.getChildByName('btnback');
        btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);


        this.tableview = this.node.getChildByName('tableview').getComponent(TableView);
        this.tableview.setRefreshCellCallBack(this, this.refreshCell, this.getCellHeight);

        this.tableview.nodeElement.active = false;

    }
    start () {
    }
    RefreshUI(){
        this.tableview.reloadData(this.vListData.length);
    }
   
 
  
    OnResult(strResponseText:string){
        // cc.log("OnResult");
        // cc.log(strResponseText);
        // let jsObj = JSON.parse(strResponseText)
        // let nPriceCur = jsObj["result"]["rate"]
        // let strSymbol = jsObj["result"]["asset_id_base"]

        // this.UpdateCurPrice(strSymbol,nPriceCur)

    }
 
    RefreshData() {
     
         let vFunName = ["ICP","ETH ","BTC","LTC","DOGE","XRP","BCH","EOS","ADA","XLM","LINK","DOT","YFI","USDT","USDC","DAI","WBTC","SHIB","MATIC","SOL"]

       //写个循环创建20个数据
        for(let i = 0; i < vFunName.length; i++) {
        let cellInfo = new WalletCellData();
        cellInfo.nId = i;
        cellInfo.sName = vFunName[i];
        this.vListData.push(cellInfo);
        }


    }
    OnOpen( strParam: string)
    {
        this.RefreshData()
        this.RefreshUI()
    }
    
    OnClose()
    {
        
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
            cellData = new WalletData();
            let node = this.tableview.createElementNode();
            node.active = true;
            cellData.init(node);
            cellData.btnIcon.node.on(Node.EventType.TOUCH_END, this.clickCell.bind(this,cellData.btnIcon),this);
        }
        log('refreshCell'+nIndex);
        let cellInfo = this.vListData[nIndex];
        cellData.refreshUI(cellInfo);
        cellData.btnIcon.nTag = nIndex;
        
        return cellData;
    }
    clickCell(btnIcon)
    {
        let nIndex = btnIcon.nTag;
        log('clickcell='+nIndex);
        let nId = this.vListData[nIndex].nId;
        if(nId === 0 )
        {
              UIManager.OpenPanel(EUIPanelType.WALLET_ICP);
        }
        else if(nId === 1 )
        {
           
            UIManager.OpenPanel(EUIPanelType.WALLET_ETH);
        }
      
        
    }
  
    clickBegin(nTag){
        // cc.log('clickbegin'+nTag);
         UIManager.Instance.OpenPanel(EUIPanelType.HOMELIST);
    }
    clickOrder(nTag){





    }
    
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIPanel from "../UIPanel"
// import UIManager from "../../UIManager";
// import { EUIPanelType } from "../../CommonEnum";
// import {TableView,CellData} from "../TableView";
// import ResManager from "../../ResManager";
// 
// 
// 
// 
// class WalletData extends CellData{
//     labName:cc.Label;
//     btnIcon:cc.Button;
//     labContent:cc.RichText;
//     nOldBgHeight:number;
//     labPriceLow:cc.Label;
//     labPriceHi:cc.Label;
//     labPriceScale:cc.Label;
// 
//     labCap:cc.Label;
//   
//     
//     init(node){
//         //this.nOrderState = 0;
//         //super.init();
//         this.node = node;
//       
//         
//         this.btnIcon = this.node.getChildByName('btnicon').getComponent(cc.Button);
// 
//           this.labName = this.btnIcon.node.getChildByName('labelname').getComponent(cc.Label);
//        //this.labPriceLow = this.node.getChildByName('labelpricelow').getComponent(cc.Label);
//         //this.labPriceHi = this.node.getChildByName('labelpricecur').getComponent(cc.Label);
//         //this.labPriceScale = this.node.getChildByName('labelpricescale').getComponent(cc.Label);
//         this.labCap = this.btnIcon.node.getChildByName('labelcap').getComponent(cc.Label);
// 
// 
//         this.nOldBgHeight = this.node.height;
// 
//     }
//     refreshUI(info:WalletCellData){
//         
//         
//        
//         this.labName.string = info.nId.toString();//sName
// 
// 
// 
//         this.labCap.string = info.sName
//         
//     }
//     
// 
// }
// //-===========================================
// class WalletCellData{
// 
//     nId:number;
//     sName: string;
//     
// 
// }
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class WalletPanel extends UIPanel {
// 
//     tableview: TableView;
//     vListData: WalletCellData[] = [];
//   
//     editBox: cc.EditBox;
//     nIndexReq: number;
//     nOrderState: number;
// 
// 
//     onLoad(){
//         this.nOrderState = 0;
// 
//         this.nIndexReq = 0
//         let btnBeginNode = this.node.getChildByName('btnback');
//         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);
//     
//         // let btnOrder = this.node.getChildByName('btnorder');
//         // btnOrder.on(cc.Node.EventType.TOUCH_END, this.clickOrder.bind(this,1025),this);
//     
// 
//         this.tableview = this.node.getChildByName('tableview').getComponent(TableView);
//         this.tableview.setRefreshCellCallBack(this, this.refreshCell, this.getCellHeight);
// 
//         this.tableview.nodeElement.active = false;
//     
//     }
//     start () {
//     }
//     RefreshUI(){
//         this.tableview.reloadData(this.vListData.length);
//     }
//    
// 
//     UpdateCurPrice(strSymbol:string,nPriceCur:number){
//         let mapCoinTab = ResManager.Instance.mapCoinTab
// 
// 
//     }
// 
//   
//     OnResult(strResponseText:string){
//         cc.log("OnResult");
//         cc.log(strResponseText);
//         let jsObj = JSON.parse(strResponseText)
//         let nPriceCur = jsObj["result"]["rate"]
//         let strSymbol = jsObj["result"]["asset_id_base"]
// 
//         this.UpdateCurPrice(strSymbol,nPriceCur)
// 
//     }
// 
//  
//     RefreshData() {
//         this.nIndexReq = 0
//         this.vListData = []
// 
//         //for(nindex)
//         let vFunName = ["ICP","ETH ","BTC","LTC","DOGE","XRP","BCH","EOS","ADA","XLM","LINK","DOT","YFI","USDT","USDC","DAI","WBTC","SHIB","MATIC","SOL"]
// 
//         //写个循环创建20个数据
//         for(let i = 0; i < vFunName.length; i++) {
//             let cellInfo = new WalletCellData();
//             cellInfo.nId = i;
//             cellInfo.sName = vFunName[i];
//             this.vListData.push(cellInfo);
//         }
//        
//         
//     }
//     OnOpen( strParam: string)
//     {
//         this.RefreshData()
//         this.RefreshUI()
// 
//     }
// 
//     
// 
//     OnClose()
//     {
//         
//     }
//     getCellHeight(nIndex:number)
//     {
//         return 200;
//         
//     }
//     refreshCell( nIndex:number)
//     {
//         let cellData:any = this.tableview.dequeueCell();
//         if(cellData === null)
//         {
//             cellData = new WalletData();
//             let node = this.tableview.createElementNode();
//             node.active = true;
//             cellData.init(node);
//             cellData.btnIcon.node.on(cc.Node.EventType.TOUCH_END, this.clickCell.bind(this,cellData.btnIcon),this);
// 
//         }
//         cc.log('refreshCell'+nIndex);
// 
//         let cellInfo = this.vListData[nIndex];
//         cellData.refreshUI(cellInfo);
//         cellData.btnIcon.nTag = nIndex;
//         
//         return cellData;
//     }
//     clickCell(btnIcon)
//     {
//         let nIndex = btnIcon.nTag;
//         cc.log('clickcell='+nIndex);
// 
//         let nId = this.vListData[nIndex].nId;
//         if(nId === 0 )
//         {
// 
//               UIManager.OpenPanel(EUIPanelType.WALLET_ICP);
//         }
//         else if(nId === 1 )
//         {
//            // UIManager.Instance.OpenPanel(EUIPanelType.GAME);
//            
//             UIManager.OpenPanel(EUIPanelType.WALLET_ETH);
//         }
//       
//         
//     }
//   
//     clickBegin(nTag){
//         cc.log('clickbegin'+nTag);
//         UIManager.Instance.OpenPanel(EUIPanelType.HOMELIST);
//     }
// 
//     clickOrder(nTag){
//        
//             
//     
// 
// 
//     }
// 
//     
// }
