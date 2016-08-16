'use strict'

const SHADER_PLAYER = 'player'
const UNIFORM_MASK = 'u_mask'

export default cc.Sprite.extend({
  ctor: function (frames, mask) {
    if(!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(frames)) {
      cc.spriteFrameCache.addSpriteFrames(frames)
    }

    this._super(cc.spriteFrameCache.getSpriteFrame('00000.png'))

    const shader = this.createShader(SHADER_PLAYER)
    this.setShaderProgram(shader)

    const maskTexture = cc.textureCache.addImage(mask)
    this.getGLProgramState().setUniformTexture(UNIFORM_MASK, maskTexture)
  },

  createShader: function (shaderName) {
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
  }
})
