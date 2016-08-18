(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SHADER_PLAYER = 'player';
var UNIFORM_MASK = 'u_mask';

exports.default = cc.Sprite.extend({
  ctor: function ctor(frames, mask) {
    if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(frames)) {
      cc.spriteFrameCache.addSpriteFrames(frames);
    }

    this._super(cc.spriteFrameCache.getSpriteFrame('20000.png'));

    var shader = this.createShader(SHADER_PLAYER);
    this.setShaderProgram(shader);

    var maskTexture = cc.textureCache.addImage(mask);
    this.getGLProgramState().setUniformTexture(UNIFORM_MASK, maskTexture);

    // this.scheduleUpdate()
  },

  createShader: function createShader(shaderName) {
    var shader = cc.shaderCache.getProgram(shaderName);
    if (!shader) {
      shader = new cc.GLProgram();
      shader.init('./res/' + shaderName + '.vert', './res/' + shaderName + '.frag');

      shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
      shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

      shader.link();
      shader.updateUniforms();

      cc.shaderCache.addProgram(shader, shaderName);
    }

    return shader;
  },

  update: function update(dt) {
    cc.log('update', dt);
  }
});


function getFrames(framePerDir, dirs) {
  var f = [];
  for (var i = 0; i < dirs.length; i++) {
    var frameNames = generateFrameNames(0, framePerDir - 1, dirs[i], '.png', 4);
    f.push(frameNames);
  }
}

function generateFrameNames(start, end, prefix, suffix, zeroPad) {
  if (suffix === undefined) suffix = '';

  var output = [];
  var frame = '';

  if (start < end) {
    for (var i = start; i <= end; i++) {
      frame = pad(i.toString(), zeroPad, '0', 1);
      frame = prefix + frame + suffix;
      output.push(frame);
    }
  } else {
    for (var _i = start; _i >= end; _i--) {
      frame = pad(_i.toString(), zeroPad, '0', 1);
      frame = prefix + frame + suffix;
      output.push(frame);
    }
  }

  return output;
}

function pad(str, len, pad, dir) {
  if (len === undefined) len = 0;
  if (pad === undefined) pad = ' ';
  if (dir === undefined) dir = 3;

  str = str.toString();

  var padlen = 0;
  var right = 0;
  var left = 0;

  if (len + 1 >= str.length) {
    switch (dir) {
      case 1:
        str = new Array(len + 1 - str.length).join(pad) + str;
        break;
      case 3:
        right = Math.ceil((padlen = len - str.length) / 2);
        left = padlen - right;
        str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
        break;

      default:
        str += new Array(len + 1 - str.length).join(pad);
        break;
    }
  }

  return str;
}

},{}],2:[function(require,module,exports){
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

},{"./scenes/boot":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Player = require('../core/Player');

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONST = {
  RES_DIR: './res'
};

var PlayerLayer = cc.Layer.extend({
  ctor: function ctor() {
    this._super();

    var size = cc.winSize;

    var helloLabel = new cc.LabelTTF('Hello World', 'Arial', 38);

    helloLabel.x = size.width / 2;
    helloLabel.y = size.height / 2 + 150;
    // add the label as a child to this layer
    this.addChild(helloLabel, 5);

    this.player = new _Player2.default('./res/li/body_idle.plist', './res/li/body_idle_a.pvr');
    this.player.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
    this.addChild(this.player);

    return true;
  },

  makeShader: function makeShader(shaderName) {
    // if program not exist create a new one
    var shader = cc.shaderCache.getProgram(shaderName);
    if (!shader) {
      shader = new cc.GLProgram();
      shader.init('./res/' + shaderName + '.vs', './res/' + shaderName + '.fs');

      shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
      shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

      shader.link();
      shader.updateUniforms();

      cc.shaderCache.addProgram(shader, shaderName);
    }

    return shader;
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

},{"../core/Player":1}]},{},[2]);
