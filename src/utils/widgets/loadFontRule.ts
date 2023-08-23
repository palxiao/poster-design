/*
 * @Author: ShawnPhang
 * @Date: 2023-08-23 17:37:16
 * @Description: 提取字体子集，如服务端不支持请关闭该功能，以保证页面能加载字体
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-08-23 17:48:34
 */
import api from '@/api'
import { blob2Base64, generateFontStyle } from '@/common/methods/fonts/utils'

export const fontWithDraw = true // true开启，false关闭

export const font2style = async (fontContent: any, fontData: any = []) => {
  return new Promise((resolve: Function) => {
    Promise.all(
      // 提取字体子集。只有ttf/otf这种原始字体支持提取，如果服务端不支持则关闭该功能，以保证页面能加载字体。
      Object.keys(fontContent).map(async (key) => {
        const font = fontData.find((font: any) => font.value === key) as any
        if (font.id) {
          try {
            const base64 = await api.material.getFontSub({
              font_id: font.id,
              url: font.url,
              content: 'Aa' + fontContent[key],
            })
            fontContent[key] = base64
          } catch (e) {
            console.log('字体获取失败', e)
          }
        }
      }),
    ).then(() => {
      const fontStyles = Object.keys(fontContent).reduce((pre, cur) => pre + generateFontStyle(cur, fontContent[cur]).outerHTML, '')
      document.head.innerHTML += fontStyles
      // document.head.appendChild(fontStyles)
      resolve()
    })
  })
}
