import { _decorator, Node, Camera, Label, Vec3, log } from 'cc';
const {ccclass, property} = _decorator;

import UIPanel from "./UIPanel"
import UIManager from "../UIManager";
import { EUIPanelType, ECMDID } from "../CommonEnum";
import BWUnitManager from "../BWUnitManager";
import BWUnit from "./BWUnit";
import BWPlayerUnit from "./BWPlayerUnit";
import EventManager from "../EventManager";

@ccclass('GamePanel')
export default class GamePanel extends UIPanel {
    battleNode: Node;
    playerMe: BWUnit;
    battleCamera: Camera;
    labelScore: Label;
    labelPlayerHp: Label;
//    //onload->start->onopen
    nCreateEnemyCd: number = 0.4;
    nCreateEnemyCdDt: number = 0;
    onLoad(){

        // let btnBeginNode = this.node.getChildByName('btnbegin');
        // btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);

        // this.battleNode = this.node.getChildByName('battlenode');
        // this.battleCamera = this.battleNode.getChildByName("battlecamera").getComponent(cc.Camera);

        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this),this);

        // this.labelScore = this.node.getChildByName("playerhp").getComponent(cc.Label);
        // this.labelPlayerHp = this.node.getChildByName("score").getComponent(cc.Label);




    }
    start () {}
    update(dt)
    {
//        //cc.log("GamePanel"+dt);
        this.nCreateEnemyCdDt += dt;
        if(this.nCreateEnemyCdDt > this.nCreateEnemyCd)
        {
            this.CreateEnemyUnit();
            this.nCreateEnemyCdDt = 0;
        }
        let nScore = BWUnitManager.Instance.nScore;
        let fPercent = nScore/200;
        if(fPercent>1)
        {
            fPercent = 1;
        }
        
        this.nCreateEnemyCd = 0.4- (fPercent) * 0.3;
    }
    lateUpdate()
    {
        this.battleCamera.node.y +=  this.playerMe.nSpeedY;
    }
    
    RefreshPlayerHp()
    {
        let nPlayerHp = BWUnitManager.Instance.playerMe.nHp;
        this.labelPlayerHp.string = nPlayerHp.toString();
    }
    RefreshScore()
    {
        let nScore = BWUnitManager.Instance.nScore;
        this.labelScore.string = nScore.toString();
    }
    EventOpt(bAdd: boolean)
    {
        let optFun = null
        if(bAdd)
        {
            EventManager.Instance.AddEvent(ECMDID.CREATEBULLET, this, this.CreateButtle);
            EventManager.Instance.AddEvent(ECMDID.REFRESHPLAYERHP, this, this.RefreshPlayerHp); 
            EventManager.Instance.AddEvent(ECMDID.REFRESHSCORE, this, this.RefreshScore); 
                       
        }
        else
        {
            EventManager.Instance.RemoveEvent(ECMDID.CREATEBULLET, this, this.CreateButtle);
            EventManager.Instance.RemoveEvent(ECMDID.REFRESHPLAYERHP, this, this.RefreshPlayerHp);
            EventManager.Instance.RemoveEvent(ECMDID.REFRESHSCORE, this, this.RefreshScore); 
        }
    }
    OnOpen( strParam: string )
    {
        this.EventOpt(true);
        this.InitPlayer();
        this.labelPlayerHp.string = "3";
        this.labelScore.string = "0";
        BWUnitManager.Instance.SetGameBegin(true);
    }
    onClose(){
        // this.EventOpt(false);

    }  
//    //--------
    InitPlayer()
    {
        this.playerMe  = BWUnitManager.Instance.CreatePlayer();
        this.playerMe.rootNode.position = new Vec3(100,100, 0);
        this.AddUnitToNode(this.playerMe);
        this.CreateEnemyUnit();
//        //let bBox = this.playerMe.rootNode.getBoundingBox(); //Rect
    }
    CreateButtle()
    {
        let unit  = BWUnitManager.Instance.CreateBullet()
        let nPosX = this.playerMe.rootNode.x;
        let nPosY = this.playerMe.rootNode.y + 50;
        unit.rootNode.position = new Vec3(nPosX,nPosY, 0);
        this.AddUnitToNode(unit);
    }
    CreateEnemyUnit()
    {
        let nR = Math.random();
//        //cc.log("nrrrr="+nR);
        let enemy  = BWUnitManager.Instance.CreateEnemy()
        let nPosX = Math.random()*640;
        let nPosY = Math.random()*960 + this.battleCamera.node.y + this.battleNode.height;
        enemy.rootNode.position = new Vec3(nPosX,nPosY, 0);
        this.AddUnitToNode(enemy);
    }
    touchMove(e)
    {
        cc.log( "Node.EventType.TOUCH_MOVE" );
        let move_x = e.touch._point.x - e.touch._prevPoint.x;
        let move_y = e.touch._point.y - e.touch._prevPoint.y;
        this.playerMe.rootNode.x = this.playerMe.rootNode.x + move_x;
        this.playerMe.rootNode.y = this.playerMe.rootNode.y + move_y;
        if(this.playerMe.rootNode.x < 0)
        {
            this.playerMe.rootNode.x = 0;
        }
        if(this.playerMe.rootNode.x > this.battleNode.width)
        {
            this.playerMe.rootNode.x = this.battleNode.width
        }
        if(this.playerMe.rootNode.y < this.battleCamera.node.y -  this.battleNode.height*0.5)
        {
            this.playerMe.rootNode.y = this.battleCamera.node.y -  this.battleNode.height*0.5;
        }
        if(this.playerMe.rootNode.y > this.battleCamera.node.y +  this.battleNode.height*0.5)
        {
             this.playerMe.rootNode.y = this.battleCamera.node.y +  this.battleNode.height*0.5
        }
    }
    InOutCameraBottom( unit: BWUnit)
    {
        if(unit.rootNode.y < this.battleCamera.node.y -  this.battleNode.height*0.5)
        {
            return true;
        }
        return false;
    }
    InOutCameraTop( unit: BWUnit)
    {
        if(unit.rootNode.y > this.battleCamera.node.y +  this.battleNode.height*0.5)
        {
            return true;
        }
        return false
    }
    AddUnitToNode(unitNode: BWUnit)
    {
        this.battleNode.addChild(unitNode.rootNode);
    }
    
    clickBegin(nTag){
        // cc.log('clickbegin'+nTag);
        // BWUnitManager.Instance.DeleteAllUnit();
        // BWUnitManager.Instance.SetGameBegin(false);
        // UIManager.Instance.closePanel(EUIPanelType.GAME);
    }
    
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIPanel from "./UIPanel"
// import UIManager from "../UIManager";
// import { EUIPanelType, ECMDID } from "../CommonEnum";
// import BWUnitManager from "../BWUnitManager";
// import BWUnit from "./BWUnit";
// import BWPlayerUnit from "./BWPlayerUnit";
// import EventManager from "../EventManager";
// 
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class GamePanel extends UIPanel {
// 
//     battleNode: cc.Node;
//     playerMe: BWUnit;
//     battleCamera: cc.Camera;
//     labelScore: cc.Label;
// 
//     labelPlayerHp: cc.Label;
// 
//     //onload->start->onopen
//     nCreateEnemyCd: number = 0.4;
//     nCreateEnemyCdDt: number = 0;
// 
//     onLoad(){
//         
//         let btnBeginNode = this.node.getChildByName('btnbegin');
//         btnBeginNode.on(cc.Node.EventType.TOUCH_END, this.clickBegin.bind(this,109825),this);
// 
//         this.battleNode = this.node.getChildByName('battlenode');
//         this.battleCamera = this.battleNode.getChildByName("battlecamera").getComponent(cc.Camera);
// 
//         this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this),this);
// 
//         this.labelScore = this.node.getChildByName("playerhp").getComponent(cc.Label);
//         this.labelPlayerHp = this.node.getChildByName("score").getComponent(cc.Label);
// 
// 
// 
// 
//     }
//     start () {}
//     update(dt)
//     {
//         //cc.log("GamePanel"+dt);
//         this.nCreateEnemyCdDt += dt;
//         if(this.nCreateEnemyCdDt > this.nCreateEnemyCd)
//         {
//             this.CreateEnemyUnit();
//             this.nCreateEnemyCdDt = 0;
//         }
// 
//         let nScore = BWUnitManager.Instance.nScore;
// 
//         let fPercent = nScore/200;
//         if(fPercent>1)
//         {
//             fPercent = 1;
//         }
//         
//         this.nCreateEnemyCd = 0.4- (fPercent) * 0.3;
// 
//     }
//     lateUpdate()
//     {
//         this.battleCamera.node.y +=  this.playerMe.nSpeedY;
//     }
//     
//     RefreshPlayerHp()
//     {
//         let nPlayerHp = BWUnitManager.Instance.playerMe.nHp;
//         this.labelPlayerHp.string = nPlayerHp.toString();
// 
//     }
//     RefreshScore()
//     {
//         let nScore = BWUnitManager.Instance.nScore;
//         this.labelScore.string = nScore.toString();
//     }
// 
//     EventOpt(bAdd: boolean)
//     {
//         let optFun = null
//         if(bAdd)
//         {
//             EventManager.Instance.AddEvent(ECMDID.CREATEBULLET, this, this.CreateButtle);
//             EventManager.Instance.AddEvent(ECMDID.REFRESHPLAYERHP, this, this.RefreshPlayerHp); 
//             EventManager.Instance.AddEvent(ECMDID.REFRESHSCORE, this, this.RefreshScore); 
// 
//                        
//         }
//         else
//         {
//             EventManager.Instance.RemoveEvent(ECMDID.CREATEBULLET, this, this.CreateButtle);
//             EventManager.Instance.RemoveEvent(ECMDID.REFRESHPLAYERHP, this, this.RefreshPlayerHp);
//             EventManager.Instance.RemoveEvent(ECMDID.REFRESHSCORE, this, this.RefreshScore); 
// 
//         }
//     }
// 
//     OnOpen( strParam: string )
//     {
//         this.EventOpt(true);
//         this.InitPlayer();
//         this.labelPlayerHp.string = "3";
//         this.labelScore.string = "0";
//         BWUnitManager.Instance.SetGameBegin(true);
// 
//     }
// 
//     onClose(){
//         this.EventOpt(false);
// 
//     }  
//     //--------
// 
//     InitPlayer()
//     {
//         this.playerMe  = BWUnitManager.Instance.CreatePlayer();
//         this.playerMe.rootNode.position = new cc.Vec3(100,100, 0);
//         this.AddUnitToNode(this.playerMe);
// 
//         this.CreateEnemyUnit();
//         //let bBox = this.playerMe.rootNode.getBoundingBox(); //Rect
// 
//     }
//     CreateButtle()
//     {
//         let unit  = BWUnitManager.Instance.CreateBullet()
//         let nPosX = this.playerMe.rootNode.x;
//         let nPosY = this.playerMe.rootNode.y + 50;
//         unit.rootNode.position = new cc.Vec3(nPosX,nPosY, 0);
//         this.AddUnitToNode(unit);
//     }
//     CreateEnemyUnit()
//     {
//         let nR = Math.random();
//         //cc.log("nrrrr="+nR);
//         let enemy  = BWUnitManager.Instance.CreateEnemy()
//         let nPosX = Math.random()*640;
//         let nPosY = Math.random()*960 + this.battleCamera.node.y + this.battleNode.height;
//         enemy.rootNode.position = new cc.Vec3(nPosX,nPosY, 0);
//         this.AddUnitToNode(enemy);
//     }
// 
//     touchMove(e)
//     {
//         cc.log( "cc.Node.EventType.TOUCH_MOVE" );
//         let move_x = e.touch._point.x - e.touch._prevPoint.x;
//         let move_y = e.touch._point.y - e.touch._prevPoint.y;
//         this.playerMe.rootNode.x = this.playerMe.rootNode.x + move_x;
//         this.playerMe.rootNode.y = this.playerMe.rootNode.y + move_y;
//         if(this.playerMe.rootNode.x < 0)
//         {
//             this.playerMe.rootNode.x = 0;
//         }
//         if(this.playerMe.rootNode.x > this.battleNode.width)
//         {
//             this.playerMe.rootNode.x = this.battleNode.width
//         }
//         if(this.playerMe.rootNode.y < this.battleCamera.node.y -  this.battleNode.height*0.5)
//         {
//             this.playerMe.rootNode.y = this.battleCamera.node.y -  this.battleNode.height*0.5;
//         }
//         if(this.playerMe.rootNode.y > this.battleCamera.node.y +  this.battleNode.height*0.5)
//         {
//              this.playerMe.rootNode.y = this.battleCamera.node.y +  this.battleNode.height*0.5
//         }
//     }
// 
//     InOutCameraBottom( unit: BWUnit)
//     {
//         if(unit.rootNode.y < this.battleCamera.node.y -  this.battleNode.height*0.5)
//         {
//             return true;
//         }
//         return false;
//     }
// 
//     InOutCameraTop( unit: BWUnit)
//     {
//         if(unit.rootNode.y > this.battleCamera.node.y +  this.battleNode.height*0.5)
//         {
//             return true;
//         }
//         return false
//     }
// 
//     AddUnitToNode(unitNode: BWUnit)
//     {
//         this.battleNode.addChild(unitNode.rootNode);
// 
//     }
//     
//     clickBegin(nTag){
//         cc.log('clickbegin'+nTag);
//         BWUnitManager.Instance.DeleteAllUnit();
//         BWUnitManager.Instance.SetGameBegin(false);
//         UIManager.Instance.closePanel(EUIPanelType.GAME);
//     }
// 
//     
// }
