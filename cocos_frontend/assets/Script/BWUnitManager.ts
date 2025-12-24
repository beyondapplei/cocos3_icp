

import BWUnit from "./ui/BWUnit";
import BWPlayerUnit from "./ui/BWPlayerUnit";
import BWEnemyUnit from "./ui/BWEnemyUnit";
import BWBulletUnit from "./ui/BWBulletUnit";
import UIManager from "./UIManager";
import EventManager from "./EventManager";

import {ECMDID, ESceneType, EUIPanelType, EUnitType} from "./CommonEnum";




export default  class BWUnitManager {
    public static readonly Instance: BWUnitManager = new BWUnitManager();
    private constructor(){
    }

    mapEnemyUnit: {[key: number]: BWUnit} = [];
    mapBulletUnit: {[key: number]: BWUnit} = {};
    nScore: number = 0;

    //vToDeleteUnit: BWUnit[] = [];
    vToDeleteUnit: Array<BWUnit> = new Array<BWUnit>();

    bBegin: boolean = false;
    nCreateId: number = 0;

    playerMe: BWPlayerUnit = null

    Init(){
    }

    SetGameBegin(bBeginGame:boolean)
    {
        this.bBegin = bBeginGame;
        this.nScore = 0;
    }
 
    GameOver()
    {
        this.bBegin = false;
        UIManager.Instance.OpenPanel(EUIPanelType.GAMEEND);
    }
    DeleteAllUnit()
    {
        this.playerMe.OnDead();

        for(let nIndex=0; nIndex < this.vToDeleteUnit.length; ++nIndex)
        {
            this.DeleteUnit(this.vToDeleteUnit[nIndex]);
        }
        this.vToDeleteUnit = [];

        for(let key in this.mapEnemyUnit)
        {
            this.DeleteUnit(this.mapEnemyUnit[key]);
        }
        this.mapEnemyUnit = [];
        for(let key in this.mapBulletUnit)
        {
            this.DeleteUnit(this.mapBulletUnit[key]);
        }
        this.mapBulletUnit = {};

        this.vToDeleteUnit = [];
    }
    
    update(dt){
        if(!this.bBegin)
        {
            return;
        }
        for(let nIndex=0; nIndex < this.vToDeleteUnit.length; ++nIndex)
        {
            this.DeleteUnit(this.vToDeleteUnit[nIndex]);
        }
        this.vToDeleteUnit = [];

        this.playerMe.update(dt);
        for(let key in this.mapEnemyUnit)
        {
            this.mapEnemyUnit[key].update(dt);
        }
        for(let key in this.mapBulletUnit)
        {
            this.mapBulletUnit[key].update(dt);
        }
        this.CheclCollision();
    }

    CheclCollision()
    {
        
        for(let ke in this.mapEnemyUnit)
        {
            let enemy = this.mapEnemyUnit[ke];
            if(enemy.bDead)
            {
                continue;
            }
            let eBox = enemy.rootNode.getBoundingBox(); //Rect

            for(let kb in this.mapBulletUnit)
            {
                let bullet = this.mapBulletUnit[kb];
                if(bullet.bDead)
                {
                    continue;
                }
                let bBox = bullet.rootNode.getBoundingBox(); 
                if(eBox.intersects(bBox))
                {
                    bullet.bDead = true;
                    BWUnitManager.Instance.AddUnitToDelete(bullet);
                    //BWUnitManager.Instance.AddUnitToDelete(enemy);
                    enemy.BeAttacked();
                }
            }

            let meBox = this.playerMe.rootNode.getBoundingBox(); 
            if(eBox.intersects(meBox))
            {
                enemy.Dead();
                this.playerMe.BeAttacked();
            }

        }
        
    }


    AddUnitToDelete(unit: BWUnit)
    {
        //unit.bDead = true;
        this.vToDeleteUnit.push(unit);
    }
    DeleteUnit(unit: BWUnit)
    {
        let eUnitType = Math.floor(unit.nId/100000);
        if(eUnitType === EUnitType.ENEMY)
        {
            this.mapEnemyUnit[unit.nId].OnDead();
            delete this.mapEnemyUnit[unit.nId];
        }
        else if (eUnitType === EUnitType.BULLET)
        {
            this.mapBulletUnit[unit.nId].OnDead();
            delete this.mapBulletUnit[unit.nId];
        }
    }



    CreatePlayer(): BWUnit
    {
        this.playerMe = new BWPlayerUnit();
        this.playerMe.Init();
        this.nCreateId++;
        this.playerMe.nId = EUnitType.ME * 100000 + this.nCreateId;
        return this.playerMe;
    }

    CreateEnemy(): BWUnit
    {
        let enemy = new BWEnemyUnit();
        enemy.Init();
        this.nCreateId++;
        enemy.nId = EUnitType.ENEMY * 100000 + this.nCreateId;
        this.mapEnemyUnit[enemy.nId] = enemy;
        return enemy;
    }

    CreateBullet(): BWUnit
    {
        let bullet = new BWBulletUnit();
        bullet.Init();
        this.nCreateId++;
        bullet.nId = EUnitType.BULLET * 100000 + this.nCreateId;
        this.mapBulletUnit[bullet.nId] = bullet;
        return bullet;
    }

    AddScore()
    {
        this.nScore += 1;
        EventManager.Instance.FireEvent(ECMDID.REFRESHSCORE);
    }
    



    
}
