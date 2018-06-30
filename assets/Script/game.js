

cc.Class({
    extends: cc.Component,

    properties: {
        cell:6,
        raw:7,
        MAX_LINE:2,
        warningBg:cc.Sprite,
        gridprefab: cc.Prefab,
        time:cc.Label,
        score:cc.Label,
        gamenode:cc.Node,
        pause:cc.Node,
        gridBaseNode:cc.Node,

        drawline:cc.Graphics,
        audio: {
            url: cc.AudioClip,
            default: null
        },

        sound: {
            url: cc.AudioClip,
            default: null
        }
    },


    onLoad () {
        this.gridList = [];
        this.selectGridList = new Array();
        this.currCell = null;
        this.isDown = false;//是否点击了

        for(var x=0;x<this.cell;x++){
            this.gridList[x]=new Array();        //声明二维数组
            for(var y=0;y<this.raw;y++){
                this.gridList[x][y]=0;          //数组初始化为0
            }
        }

        cc.audioEngine.playMusic(this.audio, true);

        var self = this;
        this.gridBaseNode.on('touchstart', function ( event ) {
            self.isDown = true;
            self.onTouchCall(true,event);
        });
        this.gridBaseNode.on('touchmove', function ( event ) {
            self.onTouchCall(false,event);
        });

        this.gridBaseNode.on('touchend', function ( event ) {
            //self.onTouchCall(false,event);
            self.adjustOnline();
            cc.log("touchend..........");
        });
        this.gridBaseNode.on('touchcancel', function ( event ) {
            self.adjustOnline();
        });

        this.onPause();
    },

    createGrid: function (posx,posy,x,y) {
        var enemy = cc.instantiate(this.gridprefab); // 创建节点
        enemy.parent = this.gridBaseNode; // 将生成的敌人加入节点树
        var random = Math.floor(Math.random()*100)%8;
        enemy.getComponent('grid').init(random,cc.v2(posx,posy),x,y); //接下来就可以调用 enemy 身上的脚本进行初始化
        return enemy
    },

    onPause:function(){
        var size = this.gridBaseNode.getContentSize();
        this.colCell = size.width/this.cell;
        this.rawCell = size.height/this.raw;
        for(let i=0;i<this.cell;i++){
            for(let j=0;j<this.raw;j++){
                var x = this.colCell/2 + this.colCell*i;
                var y = this.rawCell/2 + this.rawCell*j;
                var node = this.createGrid(x,y,i,j);
                this.gridList[i][j] = node;
            }
        }
        
    },

    onTouchCall:function(isfist,event){
        
        if(!this.isDown){
            return;
        }

        var pos = event.getLocation();
        var start = this.gridBaseNode.getPosition()
        var x = Math.floor((pos.x - start.x)/this.colCell)
        var y = Math.floor((pos.y - start.y)/this.rawCell)

        var cell = this.gridList[x][y];
        if(this.check(cell,x,y)){
            return;
        }
        
        cc.log("点到了格子为:",x,y);
        for (let i = 0; i < this.selectGridList.length; i++) {
            const element = this.selectGridList[i];
            if(element == cell){
                return;
            }
        }
        this.selectGridList.push(cell);
        cell.getComponent('grid').play();

        //连线上一个
        if(this.currCell){
            this.onDrawLine(cell.getPosition());
        }else{
            var startc = cell.getPosition();
            this.drawline.moveTo(startc.x,startc.y);
        }

        this.currCell = cell;
    },

    /**
     * 判断是否可以消除
     */
    check:function(cell,x,y){
        if(!this.currCell){
            cc.log("还没开始选择到格子");
            return false;
        }
        
        if(this.selectGridList.find(function(value, index, arr){
            return value === cell;
        })){
            cc.log("格子已经被选中");
            return true;
        }

        if(!cell.getComponent('grid').checkSametype(this.currCell.getComponent('grid').getType())){
            cc.log("选中的格子类型不同");
            return true;
        }

        if(!cell.getComponent('grid').checkAreaIn(this.currCell)){
            cc.log("选中的格子不在上一个元素的周围");
            return true;
        }

        return false;
    },


    adjustOnline:function(){
    
        for (let i = 0; i < this.selectGridList.length; i++) {
            const element = this.selectGridList[i];
            if(this.selectGridList.length >= this.MAX_LINE){
                element.removeFromParent(true);
                element.getComponent('grid').isDead(true);
            }else{
                element.getComponent('grid').stop();
            }
        }
        cc.audioEngine.playEffect(this.sound);

        this.selectGridList = [];
        this.currCell = null
        this.isDown = false;
        this.drawline.clear();

        //map重绘
        this.cleanupMap();

        //补全map
        this.addCellIntoMap();
    },

    cleanupMap:function(){
        for(let i = 0;i<this.gridList.length;i++){
            for(let j = 1;j<this.gridList[i].length;j++){
                var node = this.gridList[i][j]
                var dead = node.getComponent('grid')._dead;
                if(dead){
                    //this.gridList[i][j] = null;
                    continue;
                }
                var distanct = 0;
                var z=j-1;
                while( z >= 0){
                    var down = this.gridList[i][z]
                    if(down.getComponent('grid')._dead){
                        ++distanct;
                    }
                    --z;
                }
                if(distanct >0){
                    cc.log("位置:("+i+ ","+j+") 需要移动格子数为 : " + distanct);
                     //移动
                    node.getComponent('grid').drop(0,j - distanct,0,distanct * this.rawCell);
                    this.swapCell(cc.v2(i,j),cc.v2(i,j-distanct));
                }

               
            }
        }
    },

    swapCell:function(pos1,pos2){
        var swap = this.gridList[pos1.x][pos1.y];
        this.gridList[pos1.x][pos1.y] = this.gridList[pos2.x][pos2.y];
        this.gridList[pos2.x][pos2.y] = swap;
    },

    addCellIntoMap:function(){
         for(let i = 0;i<this.gridList.length;i++){
            for(let j = 1;j<this.gridList[i].length;j++){
                var node = this.gridList[i][j]
                var dead = node.getComponent('grid')._dead;
                if(dead){
                    this.gridList[i][j].removeFromParent(true);
                    this.gridList[i][j] = null;
                    //创建一个并飞到该地方
                    var x = this.colCell/2 + this.colCell*i;
                    var y = this.rawCell/2 + this.rawCell*j;
                    var newNode = this.createGrid(x,y,i,j);
                    this.gridList[i][j] = newNode;
                }
            }
        }
    },

    onDrawLine:function(end){
        this.drawline.lineTo(end.x,end.y);
        this.drawline.stroke();
    }
});
