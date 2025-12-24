import { _decorator, Component, Label, Button, ScrollView, Camera, Node, log } from 'cc';
const {ccclass, property} = _decorator;

import UIManager from "../UIManager";
import ResManager from "../ResManager";
import EventManager from "../EventManager";
import BWUnitManager from "../BWUnitManager";
import WangbinTest from "../WangbinTest";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
import AppManager from "../mg/AppkManager";

@ccclass('GameApp')
export default class GameApp extends Component {
    @property(Label)
    label: Label | null = null;
    @property(Button)
    btnBegin: Button | null = null;
//    //@property(cc.Sprite)
//    //spriteAd: cc.Sprite = null;
//    //cdcd:number;
    @property(ScrollView)
    scrollViewA: ScrollView | null = null;
    @property
    text: string = 'wangbin,123,ujh';
    mainCamera: Camera;
    gameInit()
    {
        ResManager.Instance.Init();
        let uirootnode = this.node.getChildByName('uirootnode');
        UIManager.Instance.Init(uirootnode);
        EventManager.Instance.Init();
        AppManager.Instance.Init();

    }
    onLoad(){
        // cc.loader.loadRes( "texture/head1", cc.SpriteFrame);

        // this.node.addComponent(WangbinTest);

        // cc.log('wangbin onLoa1 ');

        this.gameInit();

        let btnBeginNode = this.node.getChildByName('btnbegin');

        btnBeginNode.on(Node.EventType.TOUCH_END, this.clickBegin.bind(this,125), this);

//        //let nodeLogo = this.node.getChildByName('background');
//        //let actionScale = cc.scaleTo(2,1);

//        //UIManager.Instance.OpenPanel(EUIPanelType.HOME);



    }
    clickBegin(nTag){
        // cc.log('gameapp clickbegin'+nTag);
        // cc.log(this.text+'=beginclickthis');
         UIManager.Instance.OpenPanel(EUIPanelType.HOME); //tables 列表
    }
    onDestroy(){
//         //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.testCallback)

    }
    testCallback(strParam)
    {
        log(strParam)
    }
    start () {
//        // init logic

//       // if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
//            //require('./libs/sub-context-adapter');
//       // }


    }
    testFun(){
        // cc.log('testfun')
    }
    update(dt){
//        //cc.log("gameapp=dt="+dt);
        // BWUnitManager.Instance.update(dt);
    }
    lateUpdate(){

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
// import AppManager from "../mg/AppkManager";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class GameApp extends cc.Component {
// 
//     @property(cc.Label)
//     label: cc.Label = null;
// 
//     @property(cc.Button)
//     btnBegin: cc.Button = null;
// 
//     //@property(cc.Sprite)
//     //spriteAd: cc.Sprite = null;
//     //cdcd:number;
// 
//     @property(cc.ScrollView)
//     scrollViewA: cc.ScrollView = null;
// 
//     @property
//     text: string = 'wangbin,123,ujh';
// 
//     mainCamera: cc.Camera;
//     gameInit()
//     {
//         ResManager.Instance.Init();
//         let uirootnode = this.node.getChildByName('uirootnode');
//         UIManager.Instance.Init(uirootnode);
//         EventManager.Instance.Init();
//         AppManager.Instance.Init();
//         //BWUnitManager.Instance.Init();
//     }
// 
//     onLoad(){
//         cc.loader.loadRes( "texture/head1", cc.SpriteFrame);
//         
//         this.node.addComponent(WangbinTest);
// 
//         cc.log('wangbin onLoa1 ');
// 
//        this.gameInit();
// 
//        this.mainCamera = this.node.getChildByName('Main Camera').getComponent(cc.Camera);
// 
//         //EventManager.Instance.AddEvent(ECMDID.LOGIN, this, this.testCallback);
//         //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.start)
//         //EventManager.Instance.FireEvent(ECMDID.LOGIN, 'wangbin');
// 
//         let btnBeginNode = this.node.getChildByName('btnbegin');
//         // this.btnBegin.node.on(cc.Node.EventType.TOUCH_START, function (event) {
//         //     console.log("TOUCH_START")
//         // });
// 
//         // this.btnBegin.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
//         //     console.log("TOUCH_MOVE")
//         // });
// 
//         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,125),this);
// 
//         //let nodeLogo = this.node.getChildByName('background');
//         //let actionScale = cc.scaleTo(2,1);
//         
//         //UIManager.Instance.OpenPanel(EUIPanelType.HOME);
// 
//         
//         
//     }
//     clickBegin(nTag){
//         cc.log('gameapp clickbegin'+nTag);
//         cc.log(this.text+'=beginclickthis');
//         UIManager.Instance.OpenPanel(EUIPanelType.HOME); //tables 列表
//     }
//     onDestroy(){
//          //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.testCallback)
// 
//     }
// 
//     testCallback(strParam)
//     {
//         cc.log(strParam)
// 
//     }
//     start () {
//         // init logic
//         
//        // if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
//             //require('./libs/sub-context-adapter');
//        // }
//        
// 
//     }
//     testFun(){
//         cc.log('testfun')
//     }
//     update(dt){
//         //cc.log("gameapp=dt="+dt);
//         BWUnitManager.Instance.update(dt);
//     }
// 
//     lateUpdate(){
// 
//     }
// 
// }
