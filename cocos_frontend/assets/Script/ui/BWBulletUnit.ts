// //import BWUnitManager from "./BWUnitManager";

import { _decorator, log, Sprite, loader, SpriteFrame } from 'cc';
const {ccclass, property} = _decorator;

import BWUnit from "./BWUnit";
import { EUIPanelType } from "../CommonEnum";
import UIManager from "../UIManager";

@ccclass('BWBulletUnit')
export default class BWBulletUnit extends BWUnit  {
    Init()
    {
        super.Init();
        log("BWEnemyUnit.Init")
        this.nSpeedY = 20;
//        //this.rootNode.color = new cc.Color(255,0,0,255);
    
        function onLoadTexturebEnd(err, spriteFrame)
        {
            let sprite = this.rootNode.addComponent(Sprite)  
            sprite.spriteFrame = spriteFrame  
            sprite.type = Sprite.Type.SIMPLE;
            sprite.sizeMode = Sprite.SizeMode.RAW;
//            //this.rootNode.setContentSize(80,80);
        }
        cc.loader.loadRes( "texture/bullet", SpriteFrame, onLoadTexturebEnd.bind(this));
    }
    update(dt)
    {
        if(this.bDead)
        {
            return;
        }
        super.update(dt);
        let gamePanel: any = UIManager.Instance.GetPanel(EUIPanelType.GAME);
        if(gamePanel.InOutCameraTop(this))
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
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import BWUnit from "./BWUnit";
// //import BWUnitManager from "./BWUnitManager";
// import { EUIPanelType } from "../CommonEnum";
// import UIManager from "../UIManager";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class BWBulletUnit extends BWUnit  {
// 
//     Init()
//     {
//         super.Init();
//         cc.log("BWEnemyUnit.Init")
// 
//         this.nSpeedY = 20;
//         //this.rootNode.color = new cc.Color(255,0,0,255);
//     
//         function onLoadTexturebEnd(err, spriteFrame)
//         {
//             let sprite = this.rootNode.addComponent(cc.Sprite)  
//             sprite.spriteFrame = spriteFrame  
// 
//             sprite.type = cc.Sprite.Type.SIMPLE;
//             sprite.sizeMode = cc.Sprite.SizeMode.RAW;
//             //this.rootNode.setContentSize(80,80);
// 
//         }
//         cc.loader.loadRes( "texture/bullet", cc.SpriteFrame, onLoadTexturebEnd.bind(this));
// 
//     }
//     update(dt)
//     {
//         if(this.bDead)
//         {
//             return;
//         }
//         super.update(dt);
//         let gamePanel: any = UIManager.Instance.GetPanel(EUIPanelType.GAME);
//         if(gamePanel.InOutCameraTop(this))
//         {
//             this.bDead = true;
//             let BWUnitManager = require("./BWUnitManager").default;
//             BWUnitManager.Instance.AddUnitToDelete(this);
//         }
//     }
//     OnDead()
//     {
//         super.OnDead();
// 
//     }
// 
// }
