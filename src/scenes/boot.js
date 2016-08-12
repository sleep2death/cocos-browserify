var PlayerLayer = cc.Layer.extend({
  ctor: function () {
    this._super()

    var size = cc.winSize

    var helloLabel = new cc.LabelTTF('Hello World', 'Arial', 38)

    helloLabel.x = size.width / 2
    helloLabel.y = (size.height / 2) + 150
    // add the label as a child to this layer
    this.addChild(helloLabel, 5)

    // add "HelloWorld" splash screen"
    cc.spriteFrameCache.addSpriteFrames('./res/pvr_test.plist')
    this.spriteSheet = new cc.SpriteBatchNode('./res/pvr_test.pvr')
    this.addChild(this.spriteSheet)

    this.sprite = new cc.Sprite('#pixi.png')
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2
    })
    this.spriteSheet.addChild(this.sprite)
    return true
  },

  loadAnimation: function (config, weapon, move) {
    cc.async.waterfall([
      function (callback) {
        cc.loader.loadJson(config, (err, data) => {
          if(err) throw err
          callback(null, data[weapon][move])
        })
      },
      function (data, callback) {
        cc.log('Now Loading Sprites:', data.body, data.weapon)
        callback()
      }
    ])
  }
})

module.exports = cc.Scene.extend({
  onEnter: function () {
    this._super()

    this.currentCharacter = 'li'
    this.currentWeapon = 'sword'
    this.currentMove = 'idle'

    // create the player layer to hold the animation sprites
    var layer = new PlayerLayer()

    // load the current character's config file
    layer.loadAnimation('./res/' + this.currentCharacter + '/config.json', this.currentWeapon, this.currentMove)

    this.addChild(layer)
  }
})

