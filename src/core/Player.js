'use strict'

const SHADER_PLAYER = 'player'
const UNIFORM_MASK = 'u_mask'

export default cc.Sprite.extend({
  ctor: function (frames, mask) {
    if(!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(frames)) {
      cc.spriteFrameCache.addSpriteFrames(frames)
    }

    this._super(cc.spriteFrameCache.getSpriteFrame('20000.png'))

    const shader = this.createShader(SHADER_PLAYER)
    this.setShaderProgram(shader)

    const maskTexture = cc.textureCache.addImage(mask)
    this.getGLProgramState().setUniformTexture(UNIFORM_MASK, maskTexture)

    // this.scheduleUpdate()
  },

  createShader: function (shaderName) {
    let shader = cc.shaderCache.getProgram(shaderName)
    if(!shader) {
      shader = new cc.GLProgram()
      shader.init(`./res/${shaderName}.vert`, `./res/${shaderName}.frag`)

      shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION)
      shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS)

      shader.link()
      shader.updateUniforms()

      cc.shaderCache.addProgram(shader, shaderName)
    }

    return shader
  },

  update: function (dt) {
    cc.log('update', dt)
  }
})

function getFrames(framePerDir, dirs) {
  const f = []
  for(let i = 0; i < dirs.length; i++) {
    const frameNames = generateFrameNames(0, framePerDir - 1, dirs[i], '.png', 4)
    f.push(frameNames)
  }
}

function generateFrameNames(start, end, prefix, suffix, zeroPad) {
  if(suffix === undefined) suffix = ''

  const output = []
  let frame = ''

  if(start < end) {
    for(let i = start; i <= end; i++) {
      frame = pad(i.toString(), zeroPad, '0', 1)
      frame = prefix + frame + suffix
      output.push(frame)
    }
  }else {
    for(let i = start; i >= end; i--) {
      frame = pad(i.toString(), zeroPad, '0', 1)
      frame = prefix + frame + suffix
      output.push(frame)
    }
  }

  return output
}

function pad(str, len, pad, dir) {
  if (len === undefined) len = 0
  if (pad === undefined) pad = ' '
  if (dir === undefined) dir = 3

  str = str.toString()

  let padlen = 0
  let right = 0
  let left = 0

  if (len + 1 >= str.length) {
    switch (dir) {
      case 1:
        str = new Array(len + 1 - str.length).join(pad) + str
        break
      case 3:
        right = Math.ceil((padlen = len - str.length) / 2)
        left = padlen - right
        str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad)
        break

      default:
        str += new Array(len + 1 - str.length).join(pad)
        break
    }
  }

  return str
}
