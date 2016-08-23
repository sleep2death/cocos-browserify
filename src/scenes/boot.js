import Player from '../core/Player'

const CONST = {
  RES_DIR: './res'
}

const PlayerLayer = cc.Layer.extend({
  ctor: function () {
    this._super()

    const size = cc.winSize

    const helloLabel = new cc.LabelTTF('Hello World', 'Arial', 38)

    helloLabel.x = size.width / 2
    helloLabel.y = (size.height / 2) + 150
    // add the label as a child to this layer
    this.addChild(helloLabel, 5)

    this.player = new Player('./res/feite/body_idle.plist', './res/feite/body_idle_a.pvr.ccz')
    this.player.setPosition(cc.p(size.width * 0.5, size.height * 0.5))
    this.addChild(this.player)

    return true
  },

  makeShader: function (shaderName) {
    // if program not exist create a new one
    let shader = cc.shaderCache.getProgram(shaderName)
    if(!shader) {
      shader = new cc.GLProgram()
      shader.init(`./res/${shaderName}.vs`, `./res/${shaderName}.fs`)

      shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION)
      shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS)

      shader.link()
      shader.updateUniforms()

      cc.shaderCache.addProgram(shader, shaderName)
    }

    return shader
  },

  loadAnimation: function (name, weapon, move) {
    const baseDir = CONST.RES_DIR + '/' + name + '/'
    cc.async.waterfall([
      function (callback) {
        cc.loader.loadJson(baseDir + 'config.json', (err, data) => {
          if(err) throw err
          callback(null, data[weapon][move])
        })
      },
      // load body sprites
      function (data, callback) {
        const bodyDir = baseDir + data.body + '.json'
        const weaponDir = baseDir + data.weapon + '.json'
        cc.log('now creating animation:', bodyDir, weaponDir)
        callback()
      }
    ])
  }
})

export default cc.Scene.extend({
  onEnter: function () {
    this._super()

    this.currentCharacter = 'li'
    this.currentWeapon = 'sword'
    this.currentMove = 'idle'

    // create the player layer to hold the animation sprites
    const layer = new PlayerLayer()

    // load the current character's config file
    // layer.loadAnimation(this.currentCharacter, this.currentWeapon, this.currentMove)

    this.addChild(layer)
  }
})

