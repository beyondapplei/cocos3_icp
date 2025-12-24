import { _decorator, EditBox, Label } from 'cc';
const {ccclass, property} = _decorator;

import UIPanel from "../UIPanel"
import UIManager from "../../UIManager";
import { EUIPanelType } from "../../CommonEnum";
import LoginManager from "../../mg/LoginManager";
import ETHManager from "../../mg/ETHManager";
import BackManager from "../../mg/BackManager";

@ccclass('ETHWalletPanel')
export default class ETHWalletPanel extends UIPanel {
  
    editBox: EditBox;
    nIndexReq: number;
    nOrderState: number;
    labelrec: Label;
    labelbalance: Label;
    boxtoaddress: EditBox;
    boxamount: EditBox;
    onLoad(){
        // this.nOrderState = 0;

        // const btnNode =  this.node.getChildByName('btnbegin');
        // btnNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this, 109825), this);

        // const btnBack =  this.node.getChildByName('btnback');
        // btnBack.on(cc.Node.EventType.TOUCH_END, this.clickBack.bind(this, 1098215), this);


        // this.labelrec = this.node.getChildByName('labelrec').getComponent(cc.Label);
        // this.labelbalance = this.node.getChildByName('labelbalance').getComponent(cc.Label);

        // this.boxtoaddress = this.node.getChildByName('boxtoaddress').getComponent(cc.EditBox);
        // this.boxamount = this.node.getChildByName('boxamount').getComponent(cc.EditBox);


        // this.labelrec.string = "ETH Rec Address:\n" + "456-7890";
        // this.labelbalance.string = "Balance: 123.456 ETH";

    }
    start () {
    }
    RefreshUI(){

    }
    RefreshData() {

    }
     OnOpen(strParam: string) {

        // cc.log("ETHWalletPanel: OnOpen called");
        // this.uiend()


    }
    async uiend() {
        // let principalText = LoginManager.Instance.getPrincipalText();

        // this.labelrec.string =  principalText || "";

        // this.labelbalance.string = "Balance: loading...";

        // let ethAddress = await BackManager.Instance.GetEthAddress();
        // this.labelrec.string = "ETH Address:\n" + ethAddress;

        // UIManager.ShowTip('Loading ETH Balance='+ ethAddress);


        // ETHManager.Instance.GetBalanceETH(ethAddress).then((balanceText) => {
        // this.labelbalance.string = balanceText;
        // })
        // .catch((e) => {
        // cc.error('ETHWalletPanel: GetBalance failed:', e);
        // this.labelbalance.string = 'Balance: error';
        // });
     }
//        // ETHManager.Instance.GetBalanceETH(ethAddress).then((balanceText) => {
//        //         this.labelbalance.string = balanceText;
//        //     })
//        //     .catch((e) => {
//        //         cc.error('ETHWalletPanel: GetBalance failed:', e);
//        //         this.labelbalance.string = 'Balance: error';
//        //     });
     
    
    OnClose()
    {
        
    }
    clickBack(nTag){
        // cc.log('clickback'+nTag);
        // UIManager.Instance.OpenPanel(EUIPanelType.WALLET);
     }
    clickBegin(nTag){
        // cc.log('clickbegin'+nTag);
//        //UIManager.Instance.OpenPanel(EUIPanelType.HOME);

        // this.sendETH();


    }
    async sendETH(){

//        //发送eth

        // let toText = (this.boxtoaddress && this.boxtoaddress.string) ? this.boxtoaddress.string.trim() : '';
        // let amountText = (this.boxamount && this.boxamount.string) ? this.boxamount.string.trim() : '';
        // if (!toText || !amountText) {
        // UIManager.ShowTip('请输入收款地址和金额');
        // return;
        // }
        // UIManager.ShowTip('Sending ETH...');
        // let ethAddress = await BackManager.Instance.GetEthAddress();
        // ETHManager.Instance.SendETH(ethAddress,toText, amountText)
        // .then((msg) => {
        // UIManager.ShowTip(msg);
//                // const principalText = LoginManager.Instance.getPrincipalText();
//                // return ETHManager.Instance.GetBalance(principalText, strEthLedgerCanisterId);
        // })
        // .then((balanceText) => {
//                //this.labelbalance.string = balanceText;
        // })
        // .catch((e) => {
        // cc.error('ETHWalletPanel: SendETH failed:', e);
        // UIManager.ShowTip('发送失败: ' + (e && e.message ? e.message : e));
        // });
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
// 
// import LoginManager from "../../mg/LoginManager";
// import ETHManager from "../../mg/ETHManager";
// import BackManager from "../../mg/BackManager";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class ETHWalletPanel extends UIPanel {
// 
//   
//     editBox: cc.EditBox;
//     nIndexReq: number;
//     nOrderState: number;
// 
//     labelrec: cc.Label;
//     labelbalance: cc.Label;
// 
//     boxtoaddress: cc.EditBox;
//     boxamount: cc.EditBox;
// 
//     onLoad(){
//         this.nOrderState = 0;
//        
//         const btnNode =  this.node.getChildByName('btnbegin');
//         btnNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this, 109825), this);
//         
//          const btnBack =  this.node.getChildByName('btnback');
//         btnBack.on(cc.Node.EventType.TOUCH_END, this.clickBack.bind(this, 1098215), this);
//         
// 
//         this.labelrec = this.node.getChildByName('labelrec').getComponent(cc.Label);
//         this.labelbalance = this.node.getChildByName('labelbalance').getComponent(cc.Label);
//     
//         this.boxtoaddress = this.node.getChildByName('boxtoaddress').getComponent(cc.EditBox);
//         this.boxamount = this.node.getChildByName('boxamount').getComponent(cc.EditBox);
//     
//         
//         this.labelrec.string = "ETH Rec Address:\n" + "456-7890";
//         this.labelbalance.string = "Balance: 123.456 ETH";
// 
//     }
//     start () {
//     }
//     RefreshUI(){
//         
//     }
// 
//     RefreshData() {
// 
//     }
//      OnOpen(strParam: string) {
//    
//         cc.log("ETHWalletPanel: OnOpen called");
//        this.uiend()
//       
// 
//     }
// 
//     async uiend() {
//           let principalText = LoginManager.Instance.getPrincipalText();
//            
//         this.labelrec.string =  principalText || "";
// 
//         this.labelbalance.string = "Balance: loading...";
//         
//         let ethAddress = await BackManager.Instance.GetEthAddress();
//         this.labelrec.string = "ETH Address:\n" + ethAddress;
//         
//         UIManager.ShowTip('Loading ETH Balance='+ ethAddress);
// 
//         
//         ETHManager.Instance.GetBalanceETH(ethAddress).then((balanceText) => {
//                 this.labelbalance.string = balanceText;
//             })
//             .catch((e) => {
//                 cc.error('ETHWalletPanel: GetBalance failed:', e);
//                 this.labelbalance.string = 'Balance: error';
//             });
//      }
// 
//         // ETHManager.Instance.GetBalanceETH(ethAddress).then((balanceText) => {
//         //         this.labelbalance.string = balanceText;
//         //     })
//         //     .catch((e) => {
//         //         cc.error('ETHWalletPanel: GetBalance failed:', e);
//         //         this.labelbalance.string = 'Balance: error';
//         //     });
//      
// 
//     
// 
//     OnClose()
//     {
//         
//     }
//     clickBack(nTag){
//          cc.log('clickback'+nTag);
//          UIManager.Instance.OpenPanel(EUIPanelType.WALLET);
//      }
// 
//     clickBegin(nTag){
//         cc.log('clickbegin'+nTag);
//         //UIManager.Instance.OpenPanel(EUIPanelType.HOME);
// 
//         this.sendETH();
//         
// 
//     }
// 
//     async sendETH(){
// 
//         //发送eth
// 
//         let toText = (this.boxtoaddress && this.boxtoaddress.string) ? this.boxtoaddress.string.trim() : '';
//         let amountText = (this.boxamount && this.boxamount.string) ? this.boxamount.string.trim() : '';
//         if (!toText || !amountText) {
//             UIManager.ShowTip('请输入收款地址和金额');
//             return;
//         }
//         UIManager.ShowTip('Sending ETH...');
//         let ethAddress = await BackManager.Instance.GetEthAddress();
//         ETHManager.Instance.SendETH(ethAddress,toText, amountText)
//             .then((msg) => {
//                 UIManager.ShowTip(msg);
//                 // const principalText = LoginManager.Instance.getPrincipalText();
//                 // return ETHManager.Instance.GetBalance(principalText, strEthLedgerCanisterId);
//             })
//             .then((balanceText) => {
//                 //this.labelbalance.string = balanceText;
//             })
//             .catch((e) => {
//                 cc.error('ETHWalletPanel: SendETH failed:', e);
//                 UIManager.ShowTip('发送失败: ' + (e && e.message ? e.message : e));
//             });
//     }
//     
// 
//     clickOrder(nTag){
// 
//     }
// 
//     
// 
//     
// }
