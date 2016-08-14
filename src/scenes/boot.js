var CONST = {
  RES_DIR: './res'
}
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
    cc.spriteFrameCache.addSpriteFrames('./res/li/body_idle.plist')
    // this.spriteSheet = new cc.SpriteBatchNode('./res/li/body_idle.png')
    // this.addChild(this.spriteSheet)

    this.sprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('00001.png'))
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2
    })
    this.addChild(this.sprite)
    return true
  },

  loadAnimation: function (name, weapon, move) {
    var baseDir = CONST.RES_DIR + '/' + name + '/'
    cc.async.waterfall([
      function (callback) {
        cc.loader.loadJson(baseDir + 'config.json', (err, data) => {
          if(err) throw err
          callback(null, data[weapon][move])
        })
      },
      // load body sprites
      function (data, callback) {
        var bodyDir = baseDir + data.body + '.json'
        var weaponDir = baseDir + data.weapon + '.json'
        cc.log('now creating animation:', bodyDir, weaponDir)
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
    // layer.loadAnimation(this.currentCharacter, this.currentWeapon, this.currentMove)

    this.addChild(layer)
  }
})

