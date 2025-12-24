// //coinlist 无用
// //coin list panel = LoginPanel.ts
// //import { _decorator, Component, Label, Asset, assert, loader, sys, assetManager } from 'cc';
// //mport { _decorator, Component } from 'cc';
// //const { ccclass, property } = _decorator;
//         //this.nOrderState = 0;
//         //super.init();
// //-===========================================

import { _decorator, Label, Button, RichText, EditBox, Node, log } from 'cc';
const {ccclass, property} = _decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import { EUIPanelType } from "../CommonEnum";
import {TableView,CellData} from "./TableView";
import ResManager from "../mg/ResManager";
class MyCellData extends CellData{
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
        this.labName = this.node.getChildByName('labelname').getComponent(Label);
        this.labPriceLow = this.node.getChildByName('labelpricelow').getComponent(Label);
        this.labPriceHi = this.node.getChildByName('labelpricecur').getComponent(Label);
        this.labPriceScale = this.node.getChildByName('labelpricescale').getComponent(Label);
        this.labCap = this.node.getChildByName('labelcap').getComponent(Label);
        this.btnIcon = this.node.getChildByName('btnIcon').getComponent(Button);
        this.nOldBgHeight = this.node.height;
    }
    refreshUI(info:CoinData){
        let mapCoinTab = ResManager.Instance.mapCoinTab
        let tabInfo = mapCoinTab[info.nId]
        this.labName.string = tabInfo.strSymbol;
        this.labPriceLow.string = tabInfo.nPriceLow.toString();//nPriceLow
        let nPriCur = info.nPriceHi.toFixed(3);
        this.labPriceHi.string = nPriCur //info.nPriceHi.toString();//nPriceLow
        let nScale:number = info.nPriceHi/tabInfo.nPriceLow
        let strScale = nScale.toFixed(3);
        this.labPriceScale.string = strScale; //nScale.toString();
        this.labCap.string = info.nMC.toFixed(3); //info.nMC.toString();
    }
}
class CoinData{
    nPriceHi:number;
    nId:number;
    nMC:number;
    nScale:number;
}

@ccclass('LoginPanel')
export default class LoginPanel extends UIPanel {
    tableview: TableView;
    vCoinData:CoinData[] = [];
    heightCell:MyCellData;
    editBox:EditBox;
    nIndexReq:number;
    nOrderState:number;
    onLoad(){
        // this.nOrderState = 0;

        // this.nIndexReq = 0
        // let btnBeginNode = this.node.getChildByName('btnback');
        // btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);

        // let btnOrder = this.node.getChildByName('btnorder');
        // btnOrder.on(cc.Node.EventType.TOUCH_END, this.clickOrder.bind(this,1025),this);


        // this.tableview = this.node.getChildByName('tableview').getComponent(TableView);
        // this.tableview.setRefreshCellCallBack(this, this.refreshCell, this.getCellHeight);

        // this.tableview.nodeElement.active = false;

    }
    start () {
    }
    RefreshUI(){
        // this.tableview.reloadData(this.vCoinData.length);
    }
   
    UpdateCurPrice(strSymbol:string,nPriceCur:number){
        // let mapCoinTab = ResManager.Instance.mapCoinTab

        // for(let k in this.vCoinData)
        // {
        // let cellData = this.vCoinData[k]
        // if (mapCoinTab[cellData.nId].strSymbol == strSymbol ){
        // this.vCoinData[k].nPriceHi = nPriceCur
        // this.vCoinData[k].nMC = nPriceCur * mapCoinTab[cellData.nId].nCount * 7.2
        // this.vCoinData[k].nScale = nPriceCur/mapCoinTab[cellData.nId].nPriceLow
        // break;
        // }

        // }

    }
  
    OnResult(strResponseText:string){
        // cc.log("OnResult");
        // cc.log(strResponseText);
        // let jsObj = JSON.parse(strResponseText)
        // let nPriceCur = jsObj["result"]["rate"]
        // let strSymbol = jsObj["result"]["asset_id_base"]

        // this.UpdateCurPrice(strSymbol,nPriceCur)

    }
    sendXHR (strCoin:string) {
        // let xhr = new XMLHttpRequest();
        // let selfObj = this;

        // let OnResultLocal = function(){
        // if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
//                // let aastring = handler(xhr.responseText);
        // var response = xhr.responseText;

        // selfObj.OnResult(xhr.responseText)


        // } else if (xhr.status === 404) {
        // cc.log('404 page not found!');
        // } else if (xhr.readyState === 3) {
        // cc.log('Request dealing!');
        // } else if (xhr.readyState === 2) {
        // cc.log('Request received!');
        // } else if (xhr.readyState === 1) {
        // cc.log('Server connection established! Request hasn\'t been received');
        // } else if (xhr.readyState === 0) {
        // cc.log('Request hasn\'t been initiated!');

        // }
        // }

        // xhr.onreadystatechange = OnResultLocal;
        // let strIp = "https://rest.coinapi.io/jsonrpc/";
        // let mapData: {[key: string]: string} = {};
        // mapData["method"] = "v1/exchangerate/"+strCoin+ "/usdt"

//        // let filterOne: {[key: string]: string} = {};
//        // filterOne["filter_asset_id"] = strCoin
//        // let vSymbol = []
//        // vSymbol.push(filterOne)

//       // mapData["params"] = vSymbol
        // let mapBody = JSON.stringify(mapData)

        // xhr.open('POST', strIp,true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.setRequestHeader("Accept","text/plain");
        // xhr.setRequestHeader("X-CoinAPI-Key","6CC2846F-2739-4DD5-A3CF-9361997D87CA");

        // xhr.timeout = 10000;// 10 seconds for timeout

        // xhr.send(mapBody);
    }
   
    NextReqPrice(){
        // this.RefreshUI()

        // cc.log("nIndexReq="+this.nIndexReq)
        // if (this.nIndexReq>= this.vCoinData.length ){
        // return
        // }
        // this.ReqPriceOne()
        // this.nIndexReq++;

        // let selfObj = this;
        // let OnResultLocal = function(){
        // selfObj.NextReqPrice()
        // }
        // this.scheduleOnce(OnResultLocal, 0.5)
    }
    ReqPriceOne(){

        // let nId = this.vCoinData[this.nIndexReq].nId

        // let mapCoinTab = ResManager.Instance.mapCoinTab
        // let strSymbol = mapCoinTab[nId].strSymbol
        // this.sendXHR(strSymbol)
//        // for(let k in mapCoinTab)
//        // {
//        //     let mapCoinTab = ResManager.Instance.mapCoinTab
//        //     let strSymbol = mapCoinTab[k].strSymbol
//        //     this.sendXHR(strSymbol)
//        // }


    }
    RefreshData() {
        // this.nIndexReq = 0
        // this.vCoinData = []
        // let mapCoinTab = ResManager.Instance.mapCoinTab
        // for(let k in mapCoinTab)
        // {
        // let cellInfo = new CoinData();
        // cellInfo.nId = mapCoinTab[k].nId
        // cellInfo.nPriceHi = 100000
        // cellInfo.nMC = cellInfo.nPriceHi * mapCoinTab[k].nCount

        // cellInfo.nScale = cellInfo.nPriceHi/mapCoinTab[k].nPriceLow

        // this.vCoinData.push(cellInfo);
        // }
        // this.NextReqPrice()

    }
    OnOpen( strParam: string)
    {
        this.RefreshData()
//        //this.RefreshUI()
    }
    
    OnClose()
    {
        
    }
    getCellHeight(nIndex:number)
    {
        return 50;
        
    }
    refreshCell( nIndex:number)
    {
        let cellData:any = this.tableview.dequeueCell();
        if(cellData === null)
        {
            cellData = new MyCellData();
            let node = this.tableview.createElementNode();
            node.active = true;
            cellData.init(node);
            cellData.btnIcon.node.on(Node.EventType.TOUCH_END, this.clickCell.bind(this,cellData.btnIcon),this);
        }
        log('refreshCell'+nIndex);
        let cellInfo = this.vCoinData[nIndex];
        cellData.refreshUI(cellInfo);
        cellData.btnIcon.nTag = nIndex;
        
        return cellData;
    }
    clickCell(btnIcon)
    {
        let nIndex = btnIcon.nTag;
        log('clickcell='+nIndex);
        let nId = this.vCoinData[nIndex].nId;
        if(nId === 1 )
        {
        }
        else if(nId === 2 )
        {
            UIManager.Instance.OpenPanel(EUIPanelType.GAME);
        }
        
    }
  
    clickBegin(nTag){
        // cc.log('clickbegin'+nTag);
        // UIManager.Instance.OpenPanel(EUIPanelType.HOME);
    }
    clickOrder(nTag){
        // cc.log('clickOrder'+nTag);
        // if(this.nOrderState == 0){
        // this.nOrderState = 1
        // this.vCoinData.sort(function (v1:CoinData, v2:CoinData):number
        // {
        // return v2.nScale - v1.nScale;
        // });


        // }else{
        // this.nOrderState = 0
        // this.vCoinData.sort(function (v1:CoinData, v2:CoinData):number
        // {
        // return v2.nMC - v1.nMC;
        // });
        // }


        // this.RefreshUI()
    }
    
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIPanel from "./UIPanel"
// import UIManager from "../UIManager";
// import { EUIPanelType } from "../CommonEnum";
// import {TableView,CellData} from "./TableView";
// import ResManager from "../ResManager";
// 
// 
// //coinlist 无用
// 
// //coin list panel = LoginPanel.ts
// 
// //import { _decorator, Component, Label, Asset, assert, loader, sys, assetManager } from 'cc';
// 
// //mport { _decorator, Component } from 'cc';
// //const { ccclass, property } = _decorator;
// 
// 
// class MyCellData extends CellData{
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
//         this.labName = this.node.getChildByName('labelname').getComponent(cc.Label);
//         this.labPriceLow = this.node.getChildByName('labelpricelow').getComponent(cc.Label);
//         this.labPriceHi = this.node.getChildByName('labelpricecur').getComponent(cc.Label);
//         this.labPriceScale = this.node.getChildByName('labelpricescale').getComponent(cc.Label);
//         this.labCap = this.node.getChildByName('labelcap').getComponent(cc.Label);
// 
//         
//         this.btnIcon = this.node.getChildByName('btnIcon').getComponent(cc.Button);
// 
//         this.nOldBgHeight = this.node.height;
// 
//     }
//     refreshUI(info:CoinData){
//         
//         
//         let mapCoinTab = ResManager.Instance.mapCoinTab
//         let tabInfo = mapCoinTab[info.nId]
//         this.labName.string = tabInfo.strSymbol;
//         this.labPriceLow.string = tabInfo.nPriceLow.toString();//nPriceLow
// 
//         
//         let nPriCur = info.nPriceHi.toFixed(3);
//         this.labPriceHi.string = nPriCur //info.nPriceHi.toString();//nPriceLow
// 
//         let nScale:number = info.nPriceHi/tabInfo.nPriceLow
//         let strScale = nScale.toFixed(3);
//         this.labPriceScale.string = strScale; //nScale.toString();
// 
//         this.labCap.string = info.nMC.toFixed(3); //info.nMC.toString();
//         
//     }
//     
// 
// }
// //-===========================================
// class CoinData{
// 
//     nPriceHi:number;
//     nId:number;
//     nMC:number;
//     nScale:number;
// 
// }
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class LoginPanel extends UIPanel {
// 
//     tableview: TableView;
//     vCoinData:CoinData[] = [];
//     heightCell:MyCellData;
//     editBox:cc.EditBox;
//     nIndexReq:number;
//     nOrderState:number;
// 
// 
//     onLoad(){
//         this.nOrderState = 0;
// 
//         this.nIndexReq = 0
//         let btnBeginNode = this.node.getChildByName('btnback');
//         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);
//     
//         let btnOrder = this.node.getChildByName('btnorder');
//         btnOrder.on(cc.Node.EventType.TOUCH_END, this.clickOrder.bind(this,1025),this);
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
//         this.tableview.reloadData(this.vCoinData.length);
//     }
//    
// 
//     UpdateCurPrice(strSymbol:string,nPriceCur:number){
//         let mapCoinTab = ResManager.Instance.mapCoinTab
// 
//         for(let k in this.vCoinData)
//         {
//             let cellData = this.vCoinData[k]
//             if (mapCoinTab[cellData.nId].strSymbol == strSymbol ){
//                 this.vCoinData[k].nPriceHi = nPriceCur
//                 this.vCoinData[k].nMC = nPriceCur * mapCoinTab[cellData.nId].nCount * 7.2
//                 this.vCoinData[k].nScale = nPriceCur/mapCoinTab[cellData.nId].nPriceLow
//                 break;
//             }
//             
//         }
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
//     sendXHR (strCoin:string) {
//         let xhr = new XMLHttpRequest();
//         let selfObj = this;
// 
//         let OnResultLocal = function(){
//             if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
//                 // let aastring = handler(xhr.responseText);
//                 var response = xhr.responseText;
//                 
//                 selfObj.OnResult(xhr.responseText)
//                 
//     
//             } else if (xhr.status === 404) {
//                     cc.log('404 page not found!');
//             } else if (xhr.readyState === 3) {
//                 cc.log('Request dealing!');
//             } else if (xhr.readyState === 2) {
//                 cc.log('Request received!');
//             } else if (xhr.readyState === 1) {
//                 cc.log('Server connection established! Request hasn\'t been received');
//             } else if (xhr.readyState === 0) {
//                 cc.log('Request hasn\'t been initiated!');
//                 
//             }
//         }
// 
//         xhr.onreadystatechange = OnResultLocal;
//         let strIp = "https://rest.coinapi.io/jsonrpc/";
//         let mapData: {[key: string]: string} = {};
//         mapData["method"] = "v1/exchangerate/"+strCoin+ "/usdt"
// 
//         // let filterOne: {[key: string]: string} = {};
//         // filterOne["filter_asset_id"] = strCoin
//         // let vSymbol = []
//         // vSymbol.push(filterOne)
// 
//        // mapData["params"] = vSymbol
//         let mapBody = JSON.stringify(mapData)
//         
//         xhr.open('POST', strIp,true);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.setRequestHeader("Accept","text/plain");
//         xhr.setRequestHeader("X-CoinAPI-Key","6CC2846F-2739-4DD5-A3CF-9361997D87CA");
// 
//         xhr.timeout = 10000;// 10 seconds for timeout
// 
//         xhr.send(mapBody);
//     }
// 
//    
// 
//     NextReqPrice(){
//         this.RefreshUI()
// 
//         cc.log("nIndexReq="+this.nIndexReq)
//         if (this.nIndexReq>= this.vCoinData.length ){
//             return
//         }
//         this.ReqPriceOne()
//         this.nIndexReq++;
// 
//         let selfObj = this;
//         let OnResultLocal = function(){
//             selfObj.NextReqPrice()
//         }
//         this.scheduleOnce(OnResultLocal, 0.5)
//     }
// 
//     ReqPriceOne(){
//         
//         let nId = this.vCoinData[this.nIndexReq].nId
//        
//         let mapCoinTab = ResManager.Instance.mapCoinTab
//         let strSymbol = mapCoinTab[nId].strSymbol
//         this.sendXHR(strSymbol)
//         // for(let k in mapCoinTab)
//         // {
//         //     let mapCoinTab = ResManager.Instance.mapCoinTab
//         //     let strSymbol = mapCoinTab[k].strSymbol
//         //     this.sendXHR(strSymbol)
//         // }
// 
//        
//     }
//     RefreshData() {
//         this.nIndexReq = 0
//         this.vCoinData = []
//         let mapCoinTab = ResManager.Instance.mapCoinTab
//         for(let k in mapCoinTab)
//         {
//             let cellInfo = new CoinData();
//             cellInfo.nId = mapCoinTab[k].nId
//             cellInfo.nPriceHi = 100000
//             cellInfo.nMC = cellInfo.nPriceHi * mapCoinTab[k].nCount
// 
//             cellInfo.nScale = cellInfo.nPriceHi/mapCoinTab[k].nPriceLow
// 
//             this.vCoinData.push(cellInfo);
//         }
//         this.NextReqPrice()
//         
//     }
//     OnOpen( strParam: string)
//     {
//         this.RefreshData()
//         //this.RefreshUI()
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
//         return 50;
//         
//     }
//     refreshCell( nIndex:number)
//     {
//         let cellData:any = this.tableview.dequeueCell();
//         if(cellData === null)
//         {
//             cellData = new MyCellData();
//             let node = this.tableview.createElementNode();
//             node.active = true;
//             cellData.init(node);
//             cellData.btnIcon.node.on(cc.Node.EventType.TOUCH_END, this.clickCell.bind(this,cellData.btnIcon),this);
// 
//         }
//         cc.log('refreshCell'+nIndex);
// 
//         let cellInfo = this.vCoinData[nIndex];
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
//         let nId = this.vCoinData[nIndex].nId;
//         if(nId === 1 )
//         {
// 
//         }
//         else if(nId === 2 )
//         {
//             UIManager.Instance.OpenPanel(EUIPanelType.GAME);
// 
//         }
//         
//     }
//   
//     clickBegin(nTag){
//         cc.log('clickbegin'+nTag);
//         UIManager.Instance.OpenPanel(EUIPanelType.HOME);
//     }
// 
//     clickOrder(nTag){
//         cc.log('clickOrder'+nTag);
//         if(this.nOrderState == 0){
//             this.nOrderState = 1
//             this.vCoinData.sort(function (v1:CoinData, v2:CoinData):number
//             {
//                 return v2.nScale - v1.nScale;
//             }); 
//             
// 
//         }else{
//             this.nOrderState = 0
//             this.vCoinData.sort(function (v1:CoinData, v2:CoinData):number
//             {
//                 return v2.nMC - v1.nMC;
//             }); 
//         }
// 
// 
//         this.RefreshUI()
//     }
// 
//     
// }
