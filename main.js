(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BootScene = require('./scenes/boot')

cc.game.onStart = function () {
  // Pass true to enable retina display, on Android disabled by default to improve performance
  cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS)

  // Adjust viewport meta
  cc.view.adjustViewPort(true)

  // Uncomment the following line to set a fixed orientation for your game
  // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

  // Setup the resolution policy and design resolution size
  cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL)

  // The game will be resized when browser size change
  cc.view.resizeWithBrowserSize(true)

  // load resources
  cc.director.runScene(new BootScene())
}
cc.game.run()

},{"./scenes/boot":2}],2:[function(require,module,exports){
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


},{}]},{},[1]);
