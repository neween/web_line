

cc.Class({
    extends: cc.Component,

    properties: {
        _gridId:0,
        _x:0,
        _y:0,
        _dead:false,
        _bTouch:false,
        m_spriteAtlas:cc.SpriteAtlas,
    },

    init:function(type,pos,x,y){
        this._gridId = type;
        this._x = x;
        this._y = y;
        this.anim = this.getComponent(cc.Animation);
        this.getComponent(cc.Sprite).spriteFrame = this.m_spriteAtlas.getSpriteFrame(type + "_0");
        this.node.setPosition(pos.x,cc.director.getVisibleSize().height);
        this.node.runAction(cc.sequence(cc.delayTime(x*0.02),cc.moveTo(0.5,pos).easing(cc.easeBackInOut())));
    },

    drop:function(x,y,posx,posy){//x不传了
        this.changePosition(this._x,y);
        this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.moveBy(0.5,cc.v2(posx,-posy)).easing(cc.easeBackInOut())));
    },
    /**
     * 动画play
     */
    play:function(){
        this.anim.playAdditive('grid_' + this._gridId);
    },
    stop:function(){
        this.anim.stop();
    },

    getname:function(type){

    },

    onlistenMouse:function(){
        cc.log("touch enable");
        this._bTouch = true;
    },

    checkSame:function(x,y){
        if(x == this._x && y==this._y){
            return true;
        }

        return false;
    },

    checkSametype:function(type){
        return (this._gridId == type)
    },
    checkAreaIn:function(cell){
        var cellComp = cell.getComponent('grid')

        var ax = cellComp._x;
        var ay = cellComp._y;

        var bx = this._x;
        var by = this._y;

        if( ( (ax-1) == bx && (ay+1) == by ) //左上
            || ( (ax) == bx && (ay+1) == by ) //上
            || ( (ax + 1) == bx && (ay+1) == by) //右上
            || ( (ax-1) == bx && (ay) == by) //左
            || ( (ax+1) == bx && (ay) == by) //右
            || ( (ax-1) == bx && (ay-1) == by) //左下
            || ( (ax) == bx && (ay-1) == by) //下
            || ( (ax+ 1) == bx && (ay-1) == by) ) //右下
            {
                return true;
            }
            return false;
    },

    getType:function(){
        return this._gridId;
    },

    isDead:function(dead){
        this._dead = dead;
    },

    changePosition:function(x,y){
        this._x = x;
        this._y = y;
    },


});
