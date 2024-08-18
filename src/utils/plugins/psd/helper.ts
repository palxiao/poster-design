/*
 * @Author: ShawnPhang
 * @Date: 2024-08-17 18:45:24
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-18 20:49:49
 */
export function createBase64(src: any, { width, height }: any) {
  let result = ''
  if (src && width) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context: any = canvas.getContext('2d', { willReadFrequently: true })
    const imageData = context.getImageData(0, 0, width, height)
    const pixelData = imageData.data
    const len = src.length
    for (let i = 0; i < len; i++) {
      pixelData[i] = src[i]
    }
    context.putImageData(imageData, 0, 0)
    result = canvas.toDataURL('image/png')
  }
  return result
}
