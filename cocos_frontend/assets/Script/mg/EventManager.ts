

class TargetData
{
    target: Object;
    callback: Function ;
}

class CMDData 
{
     nCMDId: number;
     vTarget: Array<TargetData> = new Array<TargetData>();
}

export default  class EventManager {
    public static readonly Instance: EventManager = new EventManager();
    private UIManager(){
    }

    public static FireEvent(nCMDId: number, strParam?: string){
        EventManager.Instance.FireEvent(nCMDId, strParam);
    }

    mapEvent: {[key: number]: CMDData} = {};

    Init(){
    }

    IsHaveEvent(nCMDId: number, target: Object, callback: Function): boolean
    {
        if (this.mapEvent[nCMDId] == null )
        {
            return false;
        }
        let mapEvent = this.mapEvent[nCMDId]
        for(let nIndex=0; nIndex <mapEvent.vTarget.length; ++nIndex )
        {
            let tagetData = mapEvent.vTarget[nIndex];
            if(tagetData.callback === callback && tagetData.target === target)
            {
                return true;
            }
        }
        return false;
    }

    AddEvent(nCMDId: number, target: Object, callback: Function){
        if(this.IsHaveEvent(nCMDId, target, callback))
        {
            return;
        }
        if (this.mapEvent[nCMDId] == null )
        {
            this.mapEvent[nCMDId] = new CMDData();
        }

        let makpEvent = this.mapEvent[nCMDId]
        let targetD = new TargetData();
        targetD.target = target;
        targetD.callback = callback;
        makpEvent.vTarget.push(targetD);
    }
    RemoveEvent(nCMDId: number, target: Object, callback: Function){
        if(this.IsHaveEvent(nCMDId, target, callback) === false)
        {
            return;
        }
    
        let mapEvent = this.mapEvent[nCMDId]
        for(let nIndex=0; nIndex <mapEvent.vTarget.length; ++nIndex )
        {
            let tagetData = mapEvent.vTarget[nIndex];
            if( tagetData.target === target && tagetData.callback === callback)
            {
                mapEvent.vTarget.splice(nIndex, 1);
                return;
            }
        }
    }

    FireEvent(nCMDId: number, strParam?: string){
        if (this.mapEvent[nCMDId] == null )
        {
            return;
        }
    
        let mapEvent = this.mapEvent[nCMDId]
        for(let nIndex=0; nIndex <mapEvent.vTarget.length; ++nIndex )
        {
            let tagetData = mapEvent.vTarget[nIndex];
            if( tagetData.target && tagetData.callback)
            {
                tagetData.callback.call(tagetData.target, strParam)
            }
        }
    }
}
