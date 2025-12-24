
import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import LoginManager from "../mg/LoginManager";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";

@ccclass('HomePanel')
export default class HomePanel extends UIPanel{
    

    @property(cc.Label)
    labelpid: cc.Label;

    @property(cc.Sprite)
    sprole: cc.Sprite
    
    onLoad(){

        // function onLoadTexturebEnd(err, spriteFrame)
        // {

        // }
         //cc.assetManager.l //loadRes( "texture/imagebg11", cc.SpriteFrame, onLoadTexturebEnd.bind(this));
//       //在scene中预加载资源 后能显示
//       //cc.loader.loadRes( "texture/bullet", cc.SpriteFrame);


         const btnBeginNode = this.node.getChildByName('btnbegin');
         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickLogin.bind(this,109825),this);

        const labelpidNode = this.node.getChildByName('labelpid');
        this.labelpid = labelpidNode.getComponent(cc.Label);

        // const sproleNode = this.node.getChildByName('sprole');
        // this.sprole = sproleNode.getComponent(cc.Sprite);


    }
    start () {

    }
    OnOpen( strParam: string)
    {
    
        UIManager.ShowTip("HomePanel start");
        this.uiend();
    }
    OnClose()
    {
        
    }
    uiend() {
    
    }
    
    showinfo( strMsg: string){
         cc.log("HomePanel: showinfo " + strMsg);
        // UIManager.ShowTip( strMsg);
    }

    login() {
        LoginManager.Instance.login(
        () => this.handleLoginSuccess(),
        (e) => this.showinfo("Login Error: " + (e.message || e))
        );
    }
    
    clickLogin(nTag){
    //     this.showinfo("HomePanel clickLogin");
   

         this.login();
    }
    async handleLoginSuccess() {
        const principal = LoginManager.Instance.getPrincipalText();
        if (principal) {
        this.showinfo("Login Success! Principal: " + principal);
        this.labelpid.string = principal;
        } else {
        this.showinfo("Login Success!");
        }

        UIManager.OpenPanel(EUIPanelType.HOMELIST); //tables 列表
    }
//    // async onGetAddressClick() {
//    //     const principal = LoginManager.Instance.getPrincipalText();
//    //    try {
//    //         const address = await BackManager.Instance.getEthAddress();
//    //         this.showinfo('ETH Address: ' + address);
//    //         if (this.labelpid) {
//    //             this.labelpid.string = (principal || this.labelpid.string || '') + "\n" + address;
//    //         }
//    //     } catch (e) {
//    //         cc.error('HomePanel: getEthAddress failed:', e);
//    //         this.showinfo('Fetch address failed: ' + e);
//    //     }
//    // }
    
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIPanel from "./UIPanel"
// import UIManager from "../UIManager";
// import LoginManager from "../mg/LoginManager";
// import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class HomePanel extends UIPanel{
//     
//     // 业务逻辑全部交给 BackManager；此类仅负责 UI
// 
//     @property(cc.Label)
//     labelpid: cc.Label;
// 
//     @property(cc.Sprite)
//     sprole: cc.Sprite
//     
//     onLoad(){
//         
//          function onLoadTexturebEnd(err, spriteFrame)
//         {
//             
//         }
//       
//        
//        cc.loader.loadRes( "texture/imagebg11", cc.SpriteFrame, onLoadTexturebEnd.bind(this));
//        //在scene中预加载资源 后能显示
//        //cc.loader.loadRes( "texture/bullet", cc.SpriteFrame);
// 
//         
//         const btnBeginNode = this.node.getChildByName('btnbegin');
//         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickLogin.bind(this,109825),this);
// 
//         //此界面用的是homepanel.prefab
//         const labelpidNode = this.node.getChildByName('labelpid');
//         this.labelpid = labelpidNode.getComponent(cc.Label);
//  
//         const sproleNode = this.node.getChildByName('sprole');
//         this.sprole = sproleNode.getComponent(cc.Sprite);
//         
// 
//     }
//     start () {
//        
//     }
//     //在它被加入场景树并激活后，会先 onLoad()，等到下一轮/下一帧开始更新时再 start()
//     OnOpen( strParam: string)
//     {
//          // Web Build 下提前初始化，保证点击时仍处于用户手势上下文（避免弹窗被浏览器拦截）
//     
//         UIManager.ShowTip("HomePanel start");
//         this.uiend();
// 
//     }
// 
//     OnClose()
//     {
//         
//     }
// 
//     uiend() {
//         this.showinfo("HomePanel uiend");
// 
//         // LoginManager.Instance.ensureAuthClient()
//         //     .then(() => LoginManager.Instance.isAuthenticated())
//         //     .then((authed) => {
//         //         if (authed) {
//         //             this.showinfo("HomePanel: Already authenticated");
//         //             this.handleLoginSuccess();
//         //         } else {
//         //             this.showinfo("HomePanel: Not authenticated");
//         //         }
//         //     })
//         //     .catch((e) => {
//         //         cc.error("HomePanel: BackManager init error:", e);
//         //         this.showinfo("Init Error: " + e);
//         //     });
//     }
// 
//     
//     showinfo( strMsg: string){
//         cc.log("HomePanel: showinfo " + strMsg);
//         UIManager.ShowTip( strMsg);
//     }
// 
//    //login
//     login() {
//         LoginManager.Instance.login(
//             () => this.handleLoginSuccess(),
//             (e) => this.showinfo("Login Error: " + (e.message || e))
//         );
//     }
//     
//     clickLogin(nTag){
//         this.showinfo("HomePanel clickLogin");
//         cc.log("clickbegin"+nTag);
//         //UIManager.Instance.OpenPanel(EUIPanelType.LOGIN);
// 
//         this.login();
//     }
// 
//     async handleLoginSuccess() {
//         const principal = LoginManager.Instance.getPrincipalText();
//         if (principal) {
//             this.showinfo("Login Success! Principal: " + principal);
//             this.labelpid.string = principal;
//         } else {
//             this.showinfo("Login Success!");
//         }
// 
//         UIManager.OpenPanel(EUIPanelType.HOMELIST); //tables 列表
//     }
// 
//     // async onGetAddressClick() {
//     //     const principal = LoginManager.Instance.getPrincipalText();
//     //    try {
//     //         const address = await BackManager.Instance.getEthAddress();
//     //         this.showinfo('ETH Address: ' + address);
//     //         if (this.labelpid) {
//     //             this.labelpid.string = (principal || this.labelpid.string || '') + "\n" + address;
//     //         }
//     //     } catch (e) {
//     //         cc.error('HomePanel: getEthAddress failed:', e);
//     //         this.showinfo('Fetch address failed: ' + e);
//     //     }
//     // }
// 
//     
// }
