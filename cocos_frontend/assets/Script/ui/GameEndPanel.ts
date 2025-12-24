import { _decorator, Label } from 'cc';
const {ccclass, property} = _decorator;

import UIPanel from "./UIPanel"
import UIManager from "../UIManager";
import { EUIPanelType } from "../CommonEnum";
import {TableView,CellData} from "./TableView";
import BWUnitManager from "../BWUnitManager";

@ccclass('GameEndPanel')
export default class GameEndPanel extends UIPanel{
    labelScore: Label;
    onLoad(){

        // let btnBeginNode = this.node.getChildByName('btnbegin');
        // btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);

        // this.labelScore = this.node.getChildByName("scoretitle").getChildByName("score").getComponent(cc.Label);


    }
    start () {


    }
    OnOpen( strParam: string)
    {
        let nScore = BWUnitManager.Instance.nScore;
        this.labelScore.string = nScore.toString();
    }
    onClose()
    {
        
    }
   
    
    clickBegin(nTag){
        // cc.log('clickbegin'+nTag);
        // BWUnitManager.Instance.DeleteAllUnit();
//        //UIManager.Instance.OpenPanel(EUIPanelType.HOME);
//        //UIManager.Instance.closePanel(EUIPanelType.GAMEEND);
//        //UIManager.Instance.closePanel(EUIPanelType.GAME);
        // UIManager.Instance.OpenPanel(EUIPanelType.LOGIN);


    }
    
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIPanel from "./UIPanel"
// import UIManager from "../UIManager";
// import { EUIPanelType } from "../CommonEnum";
// import {TableView,CellData} from "./TableView";
// import BWUnitManager from "../BWUnitManager";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class GameEndPanel extends UIPanel{
//     labelScore: cc.Label;
//     onLoad(){
//         
//         let btnBeginNode = this.node.getChildByName('btnbegin');
//         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);
// 
//         this.labelScore = this.node.getChildByName("scoretitle").getChildByName("score").getComponent(cc.Label);
//         
// 
//     }
//     start () {
//     
//        
//     }
//     OnOpen( strParam: string)
//     {
//         let nScore = BWUnitManager.Instance.nScore;
//         this.labelScore.string = nScore.toString();
//     }
//     onClose()
//     {
//         
//     }
//    
// 
//     
//     clickBegin(nTag){
//         cc.log('clickbegin'+nTag);
//         BWUnitManager.Instance.DeleteAllUnit();
//         //UIManager.Instance.OpenPanel(EUIPanelType.HOME);
//         //UIManager.Instance.closePanel(EUIPanelType.GAMEEND);
//         //UIManager.Instance.closePanel(EUIPanelType.GAME);
//         UIManager.Instance.OpenPanel(EUIPanelType.LOGIN);
// 
// 
//     }
// 
//     
// }
