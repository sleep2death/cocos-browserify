(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _boot = require('./scenes/boot');

var _boot2 = _interopRequireDefault(_boot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.game.onStart = function () {
  // Pass true to enable retina display, on Android disabled by default to improve performance
  cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS);

  // Adjust viewport meta
  cc.view.adjustViewPort(true);

  // Uncomment the following line to set a fixed orientation for your game
  // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

  // Setup the resolution policy and design resolution size
  cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);

  // The game will be resized when browser size change
  cc.view.resizeWithBrowserSize(true);

  // load resourcjs
  cc.director.runScene(new _boot2.default());
};
cc.game.run();

},{"./scenes/boot":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CONST = {
  RES_DIR: './res'
};

var PlayerLayer = cc.Layer.extend({
  ctor: function ctor() {
    this._super();

    this.makeShader();

    var size = cc.winSize;

    var helloLabel = new cc.LabelTTF('Hello World', 'Arial', 38);

    helloLabel.x = size.width / 2;
    helloLabel.y = size.height / 2 + 150;
    // add the label as a child to this layer
    this.addChild(helloLabel, 5);

    // add "HelloWorld" splash screen"
    cc.spriteFrameCache.addSpriteFrames('./res/li/body_idle.plist');
    var mask = cc.textureCache.addImage('./res/li/body_idle_a.pvr');
    // this.spriteSheet = new cc.SpriteBatchNode('./res/li/body_idle.png')
    // this.addChild(this.spriteSheet)

    var sprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('40001.png'));
    sprite.setAnchorPoint(cc.p(0.5, 0.5));
    sprite.setPosition(cc.p(size.width * 0.5, size.height * 0.5));

    var sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('20001.png'));
    sprite1.setAnchorPoint(cc.p(0.5, 0.5));
    sprite1.setPosition(cc.p(size.width * 0.5 + 100, size.height * 0.5));

    // this.maskSprite = new cc.Sprite('./res/li/body_idle_a.png')

    var shader = cc.shaderCache.getProgram('player');

    sprite.setShaderProgram(shader);
    sprite.getGLProgramState().setUniformTexture('u_mask', mask);

    sprite1.setShaderProgram(shader);
    sprite1.getGLProgramState().setUniformTexture('u_mask', mask);

    this.addChild(sprite);
    this.addChild(sprite1);
    return true;
  },

  makeShader: function makeShader() {
    var shader = new cc.GLProgram();
    shader.init('./res/player.vs', './res/player.fs');

    shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
    shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

    shader.link();
    shader.updateUniforms();

    cc.shaderCache.addProgram(shader, 'player');
  },

  loadAnimation: function loadAnimation(name, weapon, move) {
    var baseDir = CONST.RES_DIR + '/' + name + '/';
    cc.async.waterfall([function (callback) {
      cc.loader.loadJson(baseDir + 'config.json', function (err, data) {
        if (err) throw err;
        callback(null, data[weapon][move]);
      });
    },
    // load body sprites
    function (data, callback) {
      var bodyDir = baseDir + data.body + '.json';
      var weaponDir = baseDir + data.weapon + '.json';
      cc.log('now creating animation:', bodyDir, weaponDir);
      callback();
    }]);
  }
});

exports.default = cc.Scene.extend({
  onEnter: function onEnter() {
    this._super();

    this.currentCharacter = 'li';
    this.currentWeapon = 'sword';
    this.currentMove = 'idle';

    // create the player layer to hold the animation sprites
    var layer = new PlayerLayer();

    // load the current character's config file
    // layer.loadAnimation(this.currentCharacter, this.currentWeapon, this.currentMove)

    this.addChild(layer);
  }
});

},{}]},{},[1]);
