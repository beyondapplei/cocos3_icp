import * as cc from 'cc';
const {ccclass, property} = cc._decorator;

import UIManager from "../mg/UIManager";
import ResManager from "../mg/ResManager";
import EventManager from "../mg/EventManager";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";

@ccclass('TipPanel')
export default class TipPanel extends cc.Component {
    @property(cc.Label)
    labelpid: cc.Label | null = null;
    onLoad(){


        // cc.log('wangbin onLoa1 ');




        this.labelpid = this.node.getChildByName('labelpid').getComponent(cc.Label);


    }
    
    onDestroy(){
//         //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.testCallback)

    }
  
    start () {

    }
    
    update(dt){
//        //cc.log("gameapp=dt="+dt);
        // BWUnitManager.Instance.update(dt);
    }
    lateUpdate(){

    }
    onTipEnd()
    {
        this.node.destroy();
//        //this.node.removeFromParent();
    }///
    showTip(strTip: string)
    {
        cc.log('showTip='+strTip);
        this.labelpid.string = strTip;
//        // 本节点向上移动300像素，然后淡出消失（用 Tween，避免 cc.Action deprecated）
        cc.Tween.stopAllByTarget(this.node);
        this.node.opacity = 255;
        cc.tween(this.node)
            .by(10, { y: 900 })
            .to(1, { opacity: 0 })
            .call(() => this.onTipEnd())
            .start();
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIManager from "../UIManager";
// import ResManager from "../ResManager";
// import EventManager from "../EventManager";
// import BWUnitManager from "../BWUnitManager";
// import WangbinTest from "../WangbinTest";
// 
// import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class TipPanel extends cc.Component {
// 
//     @property(cc.Label)
//     labelpid: cc.Label = null;
// 
//     onLoad(){
//         
// 
//         cc.log('wangbin onLoa1 ');
// 
//     
//         //EventManager.Instance.AddEvent(ECMDID.LOGIN, this, this.testCallback);
//         //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.start)
//         //EventManager.Instance.FireEvent(ECMDID.LOGIN, 'wangbin');
// 
//         this.labelpid = this.node.getChildByName('labelpid').getComponent(cc.Label);
//        
//         
//     }
//     
//     onDestroy(){
//          //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.testCallback)
// 
//     }
// 
//   
//     start () {
//     
//     }
//     
//     update(dt){
//         //cc.log("gameapp=dt="+dt);
//         BWUnitManager.Instance.update(dt);
//     }
// 
//     lateUpdate(){
// 
//     }
// 
//     onTipEnd()
//     {
//         this.node.destroy();
//         //this.node.removeFromParent();
//     }///
// 
//     showTip(strTip: string)
//     {
//         cc.log('showTip='+strTip);
//         this.labelpid.string = strTip;
// 
//         // 本节点向上移动300像素，然后淡出消失（用 Tween，避免 cc.Action deprecated）
//         cc.Tween.stopAllByTarget(this.node);
//         this.node.opacity = 255;
//         cc.tween(this.node)
//             .by(10, { y: 900 })
//             .to(1, { opacity: 0 })
//             .call(() => this.onTipEnd())
//             .start();
//     }
// 
// }
