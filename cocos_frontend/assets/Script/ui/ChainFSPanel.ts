import * as cc from 'cc';

const {ccclass, property} = cc._decorator;

import UIPanel from "./UIPanel"
import UIManager from "../mg/UIManager";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
import BackManager from '../mg/BackManager';

@ccclass('ChainFSPanel')
export default class ChainFSPanel extends UIPanel{

    @property(cc.Label)
    labelStatus: cc.Label;

    @property(cc.Button)
    btnConnect: cc.Button;

    @property(cc.Button)
    btnBack: cc.Button;

   labelAddress: cc.Label;

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

       

        const labelrec = this.node.getChildByName('labelrec');
        if (labelrec) {
            this.labelStatus = labelrec.getComponent(cc.Label);
        }

        const labelbalance = this.node.getChildByName('labelbalance');
        if (labelbalance) {
            this.labelAddress = labelbalance.getComponent(cc.Label);
        }

        this.updateStatus("Chain Fusion Panel Ready");
    }

    start () {
        // Initialization code here
    }

    updateStatus(status: string) {
        if (this.labelStatus) {
            this.labelStatus.string = status;
        }
    }

    async onConnectClick() {
        this.updateStatus("Connecting to Chain Fusion...");
        let ethAddress = await BackManager.Instance.GetEthAddressFromCFS();
        cc.log("ChainFSPanel: Eth Address from CFS:", ethAddress);
        this.labelStatus.string = "Address: " + ethAddress;

        let ethPubkeyAddress = await BackManager.Instance.GetEthPubkeyFromCFS();
        cc.log("ChainFSPanel: Eth Address from Pubkey:", ethPubkeyAddress);
        this.labelAddress.string = "Pubkey Addr: " + ethPubkeyAddress;
    }

    onBackClick() {
        UIManager.Instance.OpenPanel(EUIPanelType.HOMELIST);
    }

    async onTransferClick() {
        this.updateStatus("Initiating transfer...");
        // Add transfer logic here
        try {
            // Simulate transfer
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.updateStatus("Transfer completed");
        } catch (error) {
            this.updateStatus("Transfer failed: " + error.message);
        }
    }

    onDestroy() {
        // Cleanup code here
    }
}
