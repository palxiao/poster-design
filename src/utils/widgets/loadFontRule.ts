/*
 * @Author: ShawnPhang
 * @Date: 2023-08-23 17:37:16
 * @Description: 提取字体子集
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-12-28 19:52:55
 */
/**
 * 只有ttf/otf这种原始字体支持提取，如果服务端不支持该功能请设置false，以保证页面能加载字体。
 */
import _config from '@/config'
export const fontMinWithDraw = _config.supportSubFont // true 开启，false 关闭

import api from '@/api'
import { blob2Base64, generateFontStyle } from '@/common/methods/fonts/utils'

export const font2style = async (fontContent: any, fontData: any = []) => {
  return new Promise((resolve: Function) => {
    Promise.all(
      Object.keys(fontContent).map(async (key) => {
        const font = fontData.find((font: any) => font.value === key) as any
        if (font.id) {
          const extra = font.oid ? {} : { responseType: 'blob' }
          const params = {
            font_id: font.oid,
            id: font.id,
            content: shortText(fontContent[key]),
          }
          try {
            const result = await api.material.getFontSub(params, extra)
            fontContent[key] = font.oid ? result : await blob2Base64(result as Blob)
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

function shortText(text: string) {
  // 文字去重
  const textArr = Array.from(new Set(text.split('')))
  return textArr.join('')
}
