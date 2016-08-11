var HelloWorldLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF('Hello World!', 'Arial', 38);

        helloLabel.x = size.width / 2;
        helloLabel.y = (size.height / 2) + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        cc.spriteFrameCache.addSpriteFrames('./res/pvr_test.plist');
        this.spriteSheet = new cc.SpriteBatchNode('./res/pvr_test.pvr');
        this.addChild(this.spriteSheet);

        this.sprite = new cc.Sprite('#pixi.png');
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.spriteSheet.addChild(this.sprite);
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

