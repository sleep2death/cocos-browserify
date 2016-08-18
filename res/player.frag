varying vec2 v_texCoord;
uniform sampler2D u_mask;
void main()
{
  vec4 color1 =  texture2D(CC_Texture0, v_texCoord);
  vec4 color2 =  texture2D(u_mask, v_texCoord);
  color1.a = (color2.r + color2.g + color2.b) * color2.a;
  gl_FragColor = color1;
}
