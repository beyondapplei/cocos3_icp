// //import BWUnitManager from "./BWUnitManager";

import { _decorator, Label, log, Sprite, loader, SpriteFrame, Node, Color } from 'cc';
const {ccclass, property} = _decorator;

import BWUnit from "./BWUnit";
import UIManager from "../UIManager";
import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";

@ccclass('BWEnemyUnit')
export default class BWEnemyUnit extends BWUnit  {
    labelNum: Label
    
    Init()
    {
        super.Init();
        this.nHp = 6;
        this.nSpeedY = -(Math.random()*15+1);
        log("BWEnemyUnit.Init")
    
        function onLoadTexturebEnd(err, spriteFrame)
        {
            let sprite = this.rootNode.addComponent(Sprite)  
            sprite.spriteFrame = spriteFrame  
            sprite.type = Sprite.Type.SIMPLE;
            sprite.sizeMode = Sprite.SizeMode.RAW;
        }
        let nNum = Math.round(Math.random()*2)+1
        let strEnemyName = "enemy" + nNum;
        log(strEnemyName)
        cc.loader.loadRes( "texture/"+strEnemyName, SpriteFrame, onLoadTexturebEnd.bind(this));
        let labNode = new Node()
        this.labelNum = labNode.addComponent(Label);
        this.labelNum.node.color = Color.RED;
        labNode.parent = this.rootNode;
    }
    update(dt)
    {
        if(this.bDead)
        {
            return;
        }
        super.update(dt);
        let gamePanel: any = UIManager.Instance.GetPanel(EUIPanelType.GAME);
        if(gamePanel.InOutCameraBottom(this))
        {
            this.bDead = true;
            let BWUnitManager = require("./BWUnitManager").default;
            BWUnitManager.Instance.AddUnitToDelete(this);
        }
    }
    OnDead()
    {
        super.OnDead();
    }
    BeAttacked()
    {
        if(this.bDead){return;}
        this.nHp--;
        if(this.nHp <= 0)
        {
            this.Dead();
        }
        this.labelNum.string = this.nHp.toString();
    }
    Dead()
    {
        if(this.bDead){return;}
        this.bDead = true;
        this.labelNum.string = "";
        let BWUnitManager = require("./BWUnitManager").default;
        BWUnitManager.Instance.AddScore();
        BWUnitManager.Instance.AddUnitToDelete(this);
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import BWUnit from "./BWUnit";
// import UIManager from "../UIManager";
// //import BWUnitManager from "./BWUnitManager";
// import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "../CommonEnum";
// 
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class BWEnemyUnit extends BWUnit  {
// 
//     labelNum: cc.Label
//     
//     Init()
//     {
//         super.Init();
//         this.nHp = 6;
//         this.nSpeedY = -(Math.random()*15+1);
//         cc.log("BWEnemyUnit.Init")
//     
//         function onLoadTexturebEnd(err, spriteFrame)
//         {
//             let sprite = this.rootNode.addComponent(cc.Sprite)  
//             sprite.spriteFrame = spriteFrame  
//             sprite.type = cc.Sprite.Type.SIMPLE;
//             sprite.sizeMode = cc.Sprite.SizeMode.RAW;
//         }
//         let nNum = Math.round(Math.random()*2)+1
//         let strEnemyName = "enemy" + nNum;
//         cc.log(strEnemyName)
//         cc.loader.loadRes( "texture/"+strEnemyName, cc.SpriteFrame, onLoadTexturebEnd.bind(this));
//         let labNode = new cc.Node()
//         this.labelNum = labNode.addComponent(cc.Label);
//         this.labelNum.node.color = cc.Color.RED;
//         labNode.parent = this.rootNode;
// 
//     }
//     update(dt)
//     {
//         if(this.bDead)
//         {
//             return;
//         }
//         super.update(dt);
// 
//         let gamePanel: any = UIManager.Instance.GetPanel(EUIPanelType.GAME);
//         if(gamePanel.InOutCameraBottom(this))
//         {
//             this.bDead = true;
//             let BWUnitManager = require("./BWUnitManager").default;
//             BWUnitManager.Instance.AddUnitToDelete(this);
//         }
// 
//     }
//     OnDead()
//     {
//         super.OnDead();
// 
//     }
//     BeAttacked()
//     {
//         if(this.bDead){return;}
//         this.nHp--;
//         if(this.nHp <= 0)
//         {
//             this.Dead();
//         }
//         this.labelNum.string = this.nHp.toString();
//     }
//     Dead()
//     {
//         if(this.bDead){return;}
//         this.bDead = true;
//         this.labelNum.string = "";
//         let BWUnitManager = require("./BWUnitManager").default;
//         BWUnitManager.Instance.AddScore();
//         BWUnitManager.Instance.AddUnitToDelete(this);
//     }
// 
// 
// }
