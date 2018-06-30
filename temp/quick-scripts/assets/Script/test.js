(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/test.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c2be0Uly5ZD/L752P97Gxto', 'test', __filename);
// Script/test.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        drawline: cc.Graphics
    },

    onLoad: function onLoad() {
        var self = this;
        this.node.on('touchstart', function (event) {
            var pos = event.getLocation();
            self.drawline.moveTo(pos.x, pos.y);
        });
        this.node.on('touchmove', function (event) {
            var pos = event.getLocation();
            self.clickreStear(pos.x, pos.y);
        });

        this.node.on('touchend', function (event) {
            self.drawline.clear();
        });

        this.clickreStear();
    },


    clickreStear: function clickreStear(x, y) {
        this.drawline.lineTo(x, y);
        this.drawline.stroke();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=test.js.map
        