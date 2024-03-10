import { DEFAULT_MASK_COLOR } from '../constants'
import { getWebGLContext, initShaders } from '../libs/cuon-utils'
import { GLColor } from '../types/matting-drawing'

const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}
`
const FSHADER_SOURCE = `
precision highp float;
uniform sampler2D u_Sampler;
uniform vec4 u_MaskColor;
varying vec2 v_TexCoord;
void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
		vec3 mixRGB = color.a > 0.0 ? mix(color.rgb, u_MaskColor.rgb, u_MaskColor.a) : color.rgb;
    gl_FragColor = vec4(mixRGB, color.a);
}
`

export function initMaskRenderer(cvs: HTMLCanvasElement, maskColor: GLColor = DEFAULT_MASK_COLOR) {
  const gl = getWebGLContext(cvs)
  if (!gl) {
    return console.error('获取WebGL绘制上下文失败!')
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return console.error('着色器初始化失败!')
  }

  if (!initBuffers(gl)) {
    return console.error('缓冲区初始化失败!')
  }

  initUniform(gl, 'u_MaskColor', maskColor)

  return (image: TexImageSource) => {
    console.time('draw mask image')
    if (!initTexture(gl, image)) {
      return console.error('纹理初始化失败!')
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    console.timeEnd('draw mask image')
  }
}

function initUniform(gl: WebGLRenderingContext, location: string, val: number | GLColor) {
  const u_Location = gl.getUniformLocation(gl.program, location)
  if (!u_Location) {
    return console.error('获取attribute变量存储位置失败!')
  }
  if (Array.isArray(val)) {
    gl.uniform4fv(u_Location, val)
  } else {
    gl.uniform1i(u_Location, val)
  }
}

function initBuffers(gl: WebGLRenderingContext) {
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  const aTexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
  if (!~aPosition || !~aTexCoord) {
    console.error('获取attribute变量存储位置失败!')
    return false
  }
  const verticesBuffer = gl.createBuffer()
  const coordsBuffer = gl.createBuffer()
  if (!verticesBuffer || !coordsBuffer) {
    console.error('创建缓冲区对象失败!')
    return false
  }
  bindArrayBuffer(gl, verticesBuffer, aPosition, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]))
  bindArrayBuffer(gl, coordsBuffer, aTexCoord, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]))
  return true
}

function bindArrayBuffer(gl: WebGLRenderingContext, buffer: WebGLBuffer, attrib: number, data: Float32Array, pointNum = 2) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  gl.vertexAttribPointer(attrib, pointNum, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attrib)
}

function initTexture(gl: WebGLRenderingContext, image: TexImageSource) {
  const texture = gl.createTexture()
  if (!texture) {
    console.error('创建纹理对象失败!')
    return false
  }

  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')
  if (!u_Sampler) {
    console.error('获取取样器变量存储位置失败!')
    return false
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.uniform1i(u_Sampler, 0)
  return true
}
