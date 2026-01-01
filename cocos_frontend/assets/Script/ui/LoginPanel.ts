
import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import LoginManager from "../mg/LoginManager";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";

@ccclass('LoginPanel')
export default class LoginPanel extends UIPanel{
    

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
        const btnBackNode = this.node.getChildByName('btnback');
         btnBackNode.on(cc.Node.EventType.TOUCH_END, this.clickBack.bind(this,1092825),this);


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
    
    clickBack(nTag){
        
        UIManager.OpenPanel(EUIPanelType.HOMELIST); //tables 列表
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

