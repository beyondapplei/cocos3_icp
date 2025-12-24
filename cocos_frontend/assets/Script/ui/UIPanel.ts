import { _decorator, Component } from 'cc';
const {ccclass, property} = _decorator;

@ccclass('UIPanel')
export default class UIPanel extends Component {
    
   
    OnOpen(strParam: string)
    {
    }
    OnClose()
    {
    }
    onLoad(){
//        //this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegin.bind(this,125),this);
//        //this.node.on(cc.Node.EventType.TOUCH_START, function(e){e.stopPropation();});

    }
    onTouchBegin()
    {
//        //this.node.stopPropation();
    }
    start () {

    }
    update(dt){


    }
    lateUpdate(){

    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class UIPanel extends cc.Component {
//     
//    
//     OnOpen(strParam: string)
//     {
// 
//     }
//     OnClose()
//     {
// 
//     }
//     onLoad(){
//         //this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegin.bind(this,125),this);
//         //this.node.on(cc.Node.EventType.TOUCH_START, function(e){e.stopPropation();});
// 
//     }
//     onTouchBegin()
//     {
//         //this.node.stopPropation();
// 
//     }
// 
//     start () {
//        
//     }
// 
//     update(dt){
// 
//         
//     }
//     lateUpdate(){
// 
//     }
// }
