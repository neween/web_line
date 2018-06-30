"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'begin');
// Script/begin.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame
    update: function update(dt) {},

    onPlay: function onPlay() {
        cc.director.loadScene("game");
    }
});

cc._RF.pop();