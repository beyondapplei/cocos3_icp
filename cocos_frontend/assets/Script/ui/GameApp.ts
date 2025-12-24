
import LoginManager from '../mg/LoginManager';  

import { _decorator, Component, Label, Button, ScrollView, Camera, loader, log, Node, SpriteFrame } from 'cc';


const {ccclass, property} = _decorator;

@ccclass
export default class GameApp extends Component {

    @property(Label)
    label: Label = null;

    @property(Button)
    btnBegin: Button = null;

    //@property(cc.Sprite)
    //spriteAd: cc.Sprite = null;
    //cdcd:number;

    @property(ScrollView)
    scrollViewA: ScrollView = null;

    @property
    text: string = 'wangbin,123,ujh';

    @property(Label)
    labT :Label;

    mainCamera: Camera;
    gameInit()
    {
      
    }

    onLoad(){
       
        LoginManager.Instance.Init();
        // 预先初始化 AuthClient，否则可能 AuthClient not ready
        // 特别是在 Web Build 下更容易遇到此问题
        
        
       

        log('wangbin onLoa1 ');

       this.gameInit();

    

        let btnBeginNode = this.node.getChildByName('btnbegin');
        this.labT = btnBeginNode.getChildByName('Label').getComponent(Label);

        btnBeginNode.on(Node.EventType.TOUCH_END, this.clickBegin.bind(this,125),this);

        //let nodeLogo = this.node.getChildByName('background');
        //let actionScale = cc.scaleTo(2,1);
        
        //UIManager.Instance.OpenPanel(EUIPanelType.HOME);



        
        
    }
    clickBegin(nTag){
        log('gameapp clickbegin'+nTag);

          LoginManager.Instance.login(
            () => this.handleLoginSuccess(),
            (e) => this.showinfo("Login Error: " + (e.message || e))
        );
      
    }

    showinfo( strMsg: string){
        log("HomePanel: showinfo " + strMsg);
        
    }

    async handleLoginSuccess() {
        const principal = LoginManager.Instance.getPrincipalText();
        if (principal) {
            this.showinfo("Login Success! Principal: " + principal);
            this.labT.string =  principal;
        
        } else {
            this.showinfo("Login Success!");
        }

      
    }
    onDestroy(){
         //EventManager.Instance.RemoveEvent(ECMDID.LOGIN, this, this.testCallback)

    }

    testCallback(strParam)
    {
        log(strParam)

    }
    start () {
        // init logic
        
       // if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
            //require('./libs/sub-context-adapter');
       // }
       

    }
    testFun(){
        log('testfun')
    }
    update(dt){
        //cc.log("gameapp=dt="+dt);
        
    }

    lateUpdate(){

    }

}
