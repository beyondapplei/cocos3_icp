import * as cc from 'cc';
const {ccclass, property} = cc._decorator;

import UIManager from "../mg/UIManager";
import ResManager from "../mg/ResManager";
import EventManager from "../mg/EventManager";

import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
import AppManager from "../mg/AppkManager";

@ccclass('GameApp')
export default class GameApp extends cc.Component {
    @property(cc.Label)
    label: cc.Label | null = null;
    @property(cc.Button)
    btnBegin: cc.Button | null = null;
//    //@property(cc.Sprite)
//    //spriteAd: cc.Sprite = null;
//    //cdcd:number;
    @property(cc.ScrollView)
    scrollViewA: cc.ScrollView | null = null;
    @property
    text: string = 'wangbin,123,ujh';
    mainCamera: cc.Camera;
    gameInit()
    {
        ResManager.Instance.Init();
        let uirootnode = this.node.getChildByName('uirootnode');
        UIManager.Instance.Init(uirootnode);
        EventManager.Instance.Init();
        AppManager.Instance.Init();

        cc.profiler.hideStats();

    }
    onLoad(){
        

        this.gameInit();

        let btnBeginNode = this.node.getChildByName('btnbegin');

        btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,125), this);

    }
    clickBegin(nTag){
        // cc.log('gameapp clickbegin'+nTag);
        // cc.log(this.text+'=beginclickthis');
         UIManager.Instance.OpenPanel(EUIPanelType.HOMELIST); //tables 列表
    }
    onDestroy(){
//         //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.testCallback)

    }
    testCallback(strParam)
    {
        cc.log(strParam)
    }
    start () {



    }
    testFun(){
        // cc.log('testfun')
    }
    update(dt){

    }
    lateUpdate(){

    }
}

