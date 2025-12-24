import { _decorator, Node, log } from 'cc';
const {ccclass, property} = _decorator;

import UIManager from "../UIManager";

@ccclass('BWUnit')
export default class BWUnit {
    nId: number = 0;
    rootNode: Node;
    nSpeedY: number = 0;
    bDead: boolean = false;
    nHp: number = 6;
    Init()
    {
        log("BWUnit.Init")
        this.rootNode = new Node();
        
        
    }
    update(dt)
    {
        this.rootNode.y += this.nSpeedY;
    }
    OnDead()
    {
        this.rootNode.removeFromParent(true);
    }
    BeAttacked()
    {}
    Dead()
    {}
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import UIManager from "../UIManager";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class BWUnit {
// 
//     nId: number = 0;
//     rootNode: cc.Node;
//     nSpeedY: number = 0;
//     bDead: boolean = false;
//     nHp: number = 6;
// 
//     Init()
//     {
//         cc.log("BWUnit.Init")
//         this.rootNode = new cc.Node();
//         
//         
//     }
//     update(dt)
//     {
//         this.rootNode.y += this.nSpeedY;
//     }
// 
//     OnDead()
//     {
//         this.rootNode.removeFromParent(true);
//     }
//     BeAttacked()
//     {}
//     Dead()
//     {}
// 
// }
