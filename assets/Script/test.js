
cc.Class({
    extends: cc.Component,

    properties: {
        drawline:cc.Graphics,
    },

    onLoad () {
        var self = this;
        this.node.on('touchstart', function ( event ) {
            var pos = event.getLocation();
            self.drawline.moveTo(pos.x,pos.y);
        });
        this.node.on('touchmove', function ( event ) {
            var pos = event.getLocation();
            self.clickreStear(pos.x,pos.y);
        });

        this.node.on('touchend', function ( event ) {
            self.drawline.clear();
        });
    
        this.clickreStear();
    },

    clickreStear:function(x,y){
        this.drawline.lineTo(x,y);
        this.drawline.stroke();
    }
});
