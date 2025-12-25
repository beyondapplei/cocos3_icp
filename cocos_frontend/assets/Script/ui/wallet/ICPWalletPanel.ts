
import * as cc from 'cc';
import { _decorator, EditBox, Label } from 'cc';

const {ccclass, property} = _decorator;

import UIPanel from "../UIPanel"
import UIManager from "../../mg/UIManager";
import { EUIPanelType } from "../../CommonEnum";
import {TableView,CellData} from "../TableView";
import ResManager from "../../mg/ResManager";
import ICPManager from "../../mg/ICPManager";
import LoginManager from "../../mg/LoginManager";
import { LEAGER_ICP_ID_LOCAL } from "../../mg/DefData";

@ccclass('ICPWalletPanel')
export default class ICPWalletPanel extends UIPanel {
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
        let strIcpLeagerCanisterId = LEAGER_ICP_ID_LOCAL;
        ICPManager.Instance.GetBalance(principalText, strIcpLeagerCanisterId)
            .then((balanceText) => {
                this.labelbalance.string = balanceText;
            })
            .catch((e) => {
                console.error('ICPWalletPanel: GetBalance failed:', e);
                this.labelbalance.string = 'Balance: error';
            });

    }

    
    OnClose()
    {
        
    }

    clickBack(nTag){
        console.log('clickback'+nTag);
        UIManager.Instance.OpenPanel(EUIPanelType.WALLET);
    }

    clickBegin(nTag){
        console.log('clickbegin'+nTag);

        let toText = (this.boxtoaddress && this.boxtoaddress.string) ? this.boxtoaddress.string.trim() : '';
        let amountText = (this.boxamount && this.boxamount.string) ? this.boxamount.string.trim() : '';
        if (!toText || !amountText) {
            UIManager.ShowTip('请输入收款地址和金额');
            return;
        }

        //此处用于测试 硬编码测试 bwtest
        toText = "vo6oa-rnbla-yuwhp-omwcn-ujfnh-pqlhz-ukcbb-xyr75-zqvlm-hxzd6-jqe"
        amountText = "1"
        
        const strIcpLeagerCanisterId = LEAGER_ICP_ID_LOCAL;
        UIManager.ShowTip('Sending ICP...');
        ICPManager.Instance.SendICP(toText, amountText, strIcpLeagerCanisterId).then(() => {
            //UIManager.ShowTip(msg);
            const principalText = LoginManager.Instance.getPrincipalText();
            ICPManager.Instance.GetBalance(principalText, strIcpLeagerCanisterId).then((balanceText) => {
                this.labelbalance.string = balanceText;
            }).catch((e) => {
                cc.error('ICPWalletPanel: SendICP failed:', e);
                UIManager.ShowTip('发送失败: ' + (e && e.message ? e.message : e));
            });

        });

    }
}


    

