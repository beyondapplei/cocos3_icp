import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import OisyManager from "../mg/OisyManager";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";





@ccclass('OisyConnectPanel')
export default class OisyConnectPanel extends UIPanel{

    @property(cc.Label) 
    labelStatus: cc.Label;

    @property(cc.Button)
    btnConnect: cc.Button;

    @property(cc.Button)
    btnBack: cc.Button;

 

    onLoad(){
        const btnConnectNode = this.node.getChildByName('btnbegin');
        if (btnConnectNode) {
            this.btnConnect = btnConnectNode.getComponent(cc.Button);
            this.btnConnect.node.on(cc.Node.EventType.TOUCH_END, this.onConnectClick.bind(this), this);
        }

        const btnBackNode = this.node.getChildByName('btnback');
        if (btnBackNode) {
            this.btnBack = btnBackNode.getComponent(cc.Button);
            this.btnBack.node.on(cc.Node.EventType.TOUCH_END, this.onBackClick.bind(this), this);
        }

        const labelStatusNode = this.node.getChildByName('labelpid');
        if (labelStatusNode) {
            this.labelStatus = labelStatusNode.getComponent(cc.Label);
        }

        this.updateStatus("Ready to connect to OISY Wallet");
    }

    start () {

    }

    OnOpen( strParam: string)
    {
        this.updateStatus("Ready to connect to OISY Wallet");
    }

    OnClose()
    {
        this.disconnectWallet();
    }

    uiend() {

    }

    showinfo( strMsg: string){
        cc.log("OisyConnectPanel: " + strMsg);
        this.updateStatus(strMsg);
    }

    updateStatus(msg: string) {
        if (this.labelStatus) {
            this.labelStatus.string = msg;
        }
    }

    onConnectClick() {
       let result = OisyManager.Instance.connectWithOisyLib()
         result.then((res) => {         
            if (res.ok) {
                this.showinfo("Connected to OISY Wallet, PID: " + res.pid);
            }}).catch((e) => {       
                this.showinfo("OISY Connect Error: " + (e.message || e));
            });
    }





    onBackClick() {
        this.disconnectWallet();
        UIManager.OpenPanel(EUIPanelType.HOMELIST); // back to login panel
    }

    private async disconnectWallet() {
        OisyManager.Instance.disconnect();
    }
}