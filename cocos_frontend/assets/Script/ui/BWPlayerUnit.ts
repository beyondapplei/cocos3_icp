// //import BWUnitManager from "./BWUnitManager";

import { _decorator, log, Sprite, loader, SpriteFrame } from 'cc';
const {ccclass, property} = _decorator;

import BWUnit from "./BWUnit";
import EventManager from "../EventManager";
import { ECMDID } from "../CommonEnum";

@ccclass('BWPlayerUnit')
export default class BWPlayerUnit extends BWUnit {
    nCreateBulletCd: number = 0.1;
    nCreateBulletCdDt: number = 0;
    Init()
    {
        super.Init();
        this.nHp = 3;
        log("BWPlayerUnit.Init")
        this.nSpeedY = 1;    
        
        function onLoadTexturebEnd(err, spriteFrame)
        {
            let sprite = this.rootNode.addComponent(Sprite)  
            sprite.spriteFrame = spriteFrame  
            sprite.type = Sprite.Type.SIMPLE;
            sprite.sizeMode = Sprite.SizeMode.RAW;
//            //this.rootNode.setContentSize(80,80);
        }
        cc.loader.loadRes( "texture/plane", SpriteFrame, onLoadTexturebEnd.bind(this));
    }
    update(dt)
    {
        if(this.bDead)
        {
            return;
        }
        super.update(dt);
        this.nCreateBulletCdDt += dt;
        if(this.nCreateBulletCdDt > this.nCreateBulletCd)
        {
//            //BWUnitManager.Instance.CreateBullet();
            EventManager.Instance.FireEvent(ECMDID.CREATEBULLET);
            this.nCreateBulletCdDt = 0;
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
        EventManager.Instance.FireEvent(ECMDID.REFRESHPLAYERHP);
        if(this.nHp <= 0)
        {
            this.bDead = true;
            
            let BWUnitManager = require("./BWUnitManager").default;
            BWUnitManager.Instance.GameOver();
        }
//        //this.labelNum.string = this.nHp.toString();
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import BWUnit from "./BWUnit";
// //import BWUnitManager from "./BWUnitManager";
// import EventManager from "../EventManager";
// import { ECMDID } from "../CommonEnum";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class BWPlayerUnit extends BWUnit {
//     nCreateBulletCd: number = 0.1;
//     nCreateBulletCdDt: number = 0;
// 
//     Init()
//     {
//         super.Init();
//         this.nHp = 3;
//         cc.log("BWPlayerUnit.Init")
//         this.nSpeedY = 1;    
//         
//         function onLoadTexturebEnd(err, spriteFrame)
//         {
//             let sprite = this.rootNode.addComponent(cc.Sprite)  
//             sprite.spriteFrame = spriteFrame  
// 
//             sprite.type = cc.Sprite.Type.SIMPLE;
//             sprite.sizeMode = cc.Sprite.SizeMode.RAW;
//             //this.rootNode.setContentSize(80,80);
//         }
//         cc.loader.loadRes( "texture/plane", cc.SpriteFrame, onLoadTexturebEnd.bind(this));
//     }
//     update(dt)
//     {
//         if(this.bDead)
//         {
//             return;
//         }
//         super.update(dt);
//         this.nCreateBulletCdDt += dt;
//         if(this.nCreateBulletCdDt > this.nCreateBulletCd)
//         {
//             //BWUnitManager.Instance.CreateBullet();
//             EventManager.Instance.FireEvent(ECMDID.CREATEBULLET);
//             this.nCreateBulletCdDt = 0;
//         }
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
//         EventManager.Instance.FireEvent(ECMDID.REFRESHPLAYERHP);
//         if(this.nHp <= 0)
//         {
//             this.bDead = true;
//             
//             let BWUnitManager = require("./BWUnitManager").default;
//             BWUnitManager.Instance.GameOver();
//         }
//         //this.labelNum.string = this.nHp.toString();
//     }
// 
// }
