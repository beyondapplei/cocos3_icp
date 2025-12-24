import { _decorator, Node, Component, ScrollView, instantiate, Vec2 } from 'cc';
const {ccclass, property} = _decorator;

export  class TableView extends Component {
    scrollViewNode: Node | null = null;
    nodeElement: Node | null = null;
    nAllNum:number = 0;
    scrollView:ScrollView | null = null;
    _isUsedCellsDirty:boolean = false;
    _indices:{[key:number]:number} = {};
    _vCellsPositions:number[] = [];
    _cellsUsed:Array<CellData> = [];
    _cellsFreed:Array<CellData> = new Array<CellData>();
    target:any;
    refreshCellCallBack:Function;
    getCellHeightCallBack:Function;
    setRefreshCellCallBack(target:any, refreshCell: Function, getCellHeight?: Function)
    {
        this.target = target;
        this.refreshCellCallBack = refreshCell;
        this.getCellHeightCallBack = getCellHeight;
    }
    onLoad(){
        this.scrollView = this.scrollViewNode.getComponent(ScrollView);
        this.scrollViewNode.on('scrolling', this.scrollViewDidScroll, this);
        this.scrollViewNode.on('scrolling', this.scrollViewDidScroll, this);
    }
    indexFromOffset(search: number)
    {
        let low = 0;
        let high = this.nAllNum - 1;
        while (high >= low)
        {
            let index = low + Math.floor( (high - low) / 2);
            let cellStart = this._vCellsPositions[index];
            let cellEnd = this._vCellsPositions[index + 1];
            if (search >= cellStart && search <= cellEnd)
            {
                return index;
            }
            else if (search < cellStart)
            {
                high = index - 1;
            }
            else
            {
                low = index + 1;
            }
        }
//         //if (low <= 0) {
//         //    return 0;
//         //}
        return -1;
    }
    updateCellPositions()
    {
        this._vCellsPositions = [];
        if (this.nAllNum > 0)
        {
            let currentPos = 0;
            for (let nIndex=0; nIndex < this.nAllNum; nIndex++)
            {
                this._vCellsPositions[nIndex] = currentPos;
                let nHeight = this.getCellHeightCallBack.call(this.target,nIndex);
                currentPos += nHeight;
            }
            this._vCellsPositions[this.nAllNum] = currentPos;//1 extra value allows us to get right/bottom of the last cell
        }
    }
    updateContentSize()
    {
        if (this.nAllNum <= 0)
        {
            return
        }
        let nHeight = this._vCellsPositions[this.nAllNum];
//         //let contentWidth = this.scrollView.content.getContentSize().width;
        let nTableViewHeight = this.scrollViewNode.getContentSize().height;
        if(nHeight < nTableViewHeight)
        {
            nHeight = nTableViewHeight;
        }
        this.scrollView.content.height = nHeight;
    }
    reloadData(nCount:number)
    {
        this.nAllNum = nCount;
        for(let nIndex=0; nIndex< this._cellsUsed.length; ++nIndex) 
        {
            let cell = this._cellsUsed[nIndex];
            this._cellsFreed.push(cell);
            cell.node.removeFromParent(false);
        }
        this._indices = {};
        this._cellsUsed = [];
        this.updateCellPositions();
        this.updateContentSize();
        this.scrollViewDidScroll(this.scrollView);
    }
    moveCellOutOfSight(cellData: CellData)
    {
        this._cellsFreed.push(cellData);
        this._cellsUsed.splice(this._cellsUsed.indexOf(cellData), 1);
        this._isUsedCellsDirty = true;
        delete this._indices[cellData.nId];
        cellData.node.removeFromParent(false);    
    }
    scrollViewDidScroll(scrollView: ScrollView)
    {
        if (this.nAllNum === 0)
        {
            return;
        }
        if (this._isUsedCellsDirty)
        {
            this._isUsedCellsDirty = false;
            this._cellsUsed.sort(function (v1:CellData, v2:CellData):number
            {
                return v1.nId - v2.nId;
            });
        }
        let nContentPosY = this.scrollView.content.position.y ; //-100
        if(nContentPosY < 0)
        {
            nContentPosY = 0;
        }
        let nTableViewHeight = this.scrollViewNode.height;
        let nBeginPosY = Math.abs(nContentPosY);
        let nEndPosY = nBeginPosY+nTableViewHeight;
        let startIdx = this.indexFromOffset(nBeginPosY);
        let endIdx   = this.indexFromOffset(nEndPosY);
        if(startIdx === -1)
        {
//             //startIdx = this.nAllNum - 1;
            startIdx = 0;
        }
        if(endIdx === -1)
        {
            endIdx = this.nAllNum - 1;
        }
        let idx = 0;
        if(this._cellsUsed.length > 0)
        {
            let cellData = this._cellsUsed[0];
            idx = cellData.nId;
            while(idx < startIdx)
            {
                this.moveCellOutOfSight(cellData);
                if (this._cellsUsed.length >0 )
                {
                    cellData = this._cellsUsed[0];
                    idx = cellData.nId;
                }
                else
                {
                    break;
                }
            }
        }
        if (this._cellsUsed.length > 0)
        {
            let cellData = this._cellsUsed[this._cellsUsed.length-1];
            idx = cellData.nId;
            while(idx <= this.nAllNum-1 && idx > endIdx)
            {
                this.moveCellOutOfSight(cellData);
                if (this._cellsUsed.length > 0)
                {
                    cellData = this._cellsUsed[this._cellsUsed.length-1];
                    idx = cellData.nId;
                }
                else
                {
                    break;
                }
            }
        }
        for (let i = startIdx; i <= endIdx; i++)
        {
            if (this._indices[i] != null)
            {
                continue;
            }
            this.updateCellAtIndex(i);
        }
    }
    createElementNode()
    {
        return instantiate(this.nodeElement);
    }
    dequeueCell()
    {
        if (this._cellsFreed.length === 0 ){
//             //let cell = new CellData();
//             //cell.node = cc.instantiate(this.nodeElement);
            return null;
        }
        else {
            let cell = this._cellsFreed[0];
            this._cellsFreed.splice(0,1)
            return cell;
        }
    }
    updateCellAtIndex( idx:number)
    {
//         //let cellData = this.dequeueCell();
        let cellData = this.refreshCellCallBack.call(this.target,idx)
        cellData.nId = idx;
        cellData.node.setPosition(new Vec2(0,-this._vCellsPositions[idx]));
        this.scrollView.content.addChild(cellData.node);
        this._cellsUsed.push(cellData);
        this._indices[idx] = idx;
        this._isUsedCellsDirty = true;
    }
    addCellAtLast()
    {
        this.nAllNum = this.nAllNum + 1;
        this.updateCellPositions();
        this.updateContentSize();
//         //this.scrollViewDidScroll(this.scrollView);
// /*
        let idx = this.nAllNum - 1;
        let cellData = this.refreshCellCallBack.call(this.target,idx)
        cellData.nId = idx;
//         //cellData.node.setPosition(new cc.Vec2(0,-this._vCellsPositions[idx]));
        this.scrollView.content.addChild(cellData.node);
//         //this._cellsUsed.push(cellData);
//         //this._indices[idx] = idx;
//         //this._isUsedCellsDirty = true;*/
    }
    onDestroy(){
    }
    start () {
    }
    update(){
    }
    lateUpdate(){
    }
}

@ccclass('TableView')
    @property(cc.Node)    @property(cc.Node)
export class CellData{
    nId:number;
    node:Node;
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// export class CellData{
//     nId:number;
//     node:cc.Node;
// 
// 
// }
// 
// const {ccclass, property} = cc._decorator;
// @ccclass
// export  class TableView extends cc.Component {
// 
//     @property(cc.Node)
//     scrollViewNode: cc.Node = null;
// 
//     @property(cc.Node)
//     nodeElement: cc.Node = null;
// 
//     nAllNum:number = 0;
//     scrollView:cc.ScrollView = null;
//     _isUsedCellsDirty:boolean = false;
//     _indices:{[key:number]:number} = {};
//     _vCellsPositions:number[] = [];
//     _cellsUsed:Array<CellData> = [];
//     _cellsFreed:Array<CellData> = new Array<CellData>();
// 
//     target:any;
//     refreshCellCallBack:Function;
//     getCellHeightCallBack:Function;
// 
//     setRefreshCellCallBack(target:any, refreshCell: Function, getCellHeight?: Function)
//     {
//         this.target = target;
//         this.refreshCellCallBack = refreshCell;
//         this.getCellHeightCallBack = getCellHeight;
//     }
//     onLoad(){
// 
//         this.scrollView = this.scrollViewNode.getComponent(cc.ScrollView);
//         this.scrollViewNode.on('scrolling', this.scrollViewDidScroll, this);
// 
//         this.scrollViewNode.on('scrolling', this.scrollViewDidScroll, this);
//     }
//     
//     indexFromOffset(search: number)
//     {
//         let low = 0;
//         let high = this.nAllNum - 1;
//         while (high >= low)
//         {
//             let index = low + Math.floor( (high - low) / 2);
//             let cellStart = this._vCellsPositions[index];
//             let cellEnd = this._vCellsPositions[index + 1];
// 
//             if (search >= cellStart && search <= cellEnd)
//             {
//                 return index;
//             }
//             else if (search < cellStart)
//             {
//                 high = index - 1;
//             }
//             else
//             {
//                 low = index + 1;
//             }
//         }
// 
//         //if (low <= 0) {
//         //    return 0;
//         //}
// 
//         return -1;
//     }
// 
//     updateCellPositions()
//     {
//         this._vCellsPositions = [];
//         if (this.nAllNum > 0)
//         {
//             let currentPos = 0;
//             for (let nIndex=0; nIndex < this.nAllNum; nIndex++)
//             {
//                 this._vCellsPositions[nIndex] = currentPos;
//                 let nHeight = this.getCellHeightCallBack.call(this.target,nIndex);
//                 currentPos += nHeight;
//             }
//             this._vCellsPositions[this.nAllNum] = currentPos;//1 extra value allows us to get right/bottom of the last cell
//         }
// 
//     }
//     updateContentSize()
//     {
//         if (this.nAllNum <= 0)
//         {
//             return
//         }
//         let nHeight = this._vCellsPositions[this.nAllNum];
//         //let contentWidth = this.scrollView.content.getContentSize().width;
//         let nTableViewHeight = this.scrollViewNode.getContentSize().height;
//         if(nHeight < nTableViewHeight)
//         {
//             nHeight = nTableViewHeight;
//         }
//         this.scrollView.content.height = nHeight;
//     }
// 
// 
//     reloadData(nCount:number)
//     {
//         this.nAllNum = nCount;
//         for(let nIndex=0; nIndex< this._cellsUsed.length; ++nIndex) 
//         {
//             let cell = this._cellsUsed[nIndex];
//             this._cellsFreed.push(cell);
//             cell.node.removeFromParent(false);
//         }
// 
//         this._indices = {};
//         this._cellsUsed = [];
//     
//         this.updateCellPositions();
//         this.updateContentSize();
//         this.scrollViewDidScroll(this.scrollView);
//     }
// 
//     moveCellOutOfSight(cellData: CellData)
//     {
//         this._cellsFreed.push(cellData);
//         this._cellsUsed.splice(this._cellsUsed.indexOf(cellData), 1);
//         this._isUsedCellsDirty = true;
//         delete this._indices[cellData.nId];
//         cellData.node.removeFromParent(false);    
//     }
//     scrollViewDidScroll(scrollView: cc.ScrollView)
//     {
//         if (this.nAllNum === 0)
//         {
//             return;
//         }
//         if (this._isUsedCellsDirty)
//         {
//             this._isUsedCellsDirty = false;
//             this._cellsUsed.sort(function (v1:CellData, v2:CellData):number
//             {
//                 return v1.nId - v2.nId;
//             });
//         }
//         let nContentPosY = this.scrollView.content.position.y ; //-100
//         if(nContentPosY < 0)
//         {
//             nContentPosY = 0;
//         }
//         let nTableViewHeight = this.scrollViewNode.height;
//         let nBeginPosY = Math.abs(nContentPosY);
//         let nEndPosY = nBeginPosY+nTableViewHeight;
// 
//         let startIdx = this.indexFromOffset(nBeginPosY);
//         let endIdx   = this.indexFromOffset(nEndPosY);
//         if(startIdx === -1)
//         {
//             //startIdx = this.nAllNum - 1;
//             startIdx = 0;
//         }
//         if(endIdx === -1)
//         {
//             endIdx = this.nAllNum - 1;
//         }
//         let idx = 0;
// 
//         if(this._cellsUsed.length > 0)
//         {
//             let cellData = this._cellsUsed[0];
//             idx = cellData.nId;
//             
//             while(idx < startIdx)
//             {
//                 this.moveCellOutOfSight(cellData);
//                 if (this._cellsUsed.length >0 )
//                 {
//                     cellData = this._cellsUsed[0];
//                     idx = cellData.nId;
//                 }
//                 else
//                 {
//                     break;
//                 }
//             }
//         }
//         
//         if (this._cellsUsed.length > 0)
//         {
//             let cellData = this._cellsUsed[this._cellsUsed.length-1];
//             idx = cellData.nId;
//             while(idx <= this.nAllNum-1 && idx > endIdx)
//             {
//                 this.moveCellOutOfSight(cellData);
//                 if (this._cellsUsed.length > 0)
//                 {
//                     cellData = this._cellsUsed[this._cellsUsed.length-1];
//                     idx = cellData.nId;
//                 }
//                 else
//                 {
//                     break;
//                 }
//             }
//         }
// 
//         for (let i = startIdx; i <= endIdx; i++)
//         {
//             if (this._indices[i] != null)
//             {
//                 continue;
//             }
//             this.updateCellAtIndex(i);
//         }
//     }
// 
//     createElementNode()
//     {
//         return cc.instantiate(this.nodeElement);
//     }
//     dequeueCell()
//     {
//         if (this._cellsFreed.length === 0 ){
//             //let cell = new CellData();
//             //cell.node = cc.instantiate(this.nodeElement);
//             return null;
//         }
//         else {
//             let cell = this._cellsFreed[0];
//             this._cellsFreed.splice(0,1)
//             return cell;
//         }
//     }
// 
//     updateCellAtIndex( idx:number)
//     {
//         //let cellData = this.dequeueCell();
// 
//         let cellData = this.refreshCellCallBack.call(this.target,idx)
//         cellData.nId = idx;
//         cellData.node.setPosition(new cc.Vec2(0,-this._vCellsPositions[idx]));
//         this.scrollView.content.addChild(cellData.node);
//         this._cellsUsed.push(cellData);
//         this._indices[idx] = idx;
//         this._isUsedCellsDirty = true;
//     }
// 
//     addCellAtLast()
//     {
//         this.nAllNum = this.nAllNum + 1;
//         this.updateCellPositions();
//         this.updateContentSize();
//         //this.scrollViewDidScroll(this.scrollView);
// 
// /*
//         let idx = this.nAllNum - 1;
//         let cellData = this.refreshCellCallBack.call(this.target,idx)
//         cellData.nId = idx;
//         //cellData.node.setPosition(new cc.Vec2(0,-this._vCellsPositions[idx]));
//         this.scrollView.content.addChild(cellData.node);
//         //this._cellsUsed.push(cellData);
//         //this._indices[idx] = idx;
//         //this._isUsedCellsDirty = true;*/
//     }
// 
//     onDestroy(){
// 
//     }
//     start () {
//     }
//     
//     update(){
//     }
// 
//     lateUpdate(){
// 
//     }
// 
// }
