/*
 * @Author: ShawnPhang
 * @Date: 2023-10-14 20:16:48
 * @Description: 找出页面中使用的字体
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-14 20:29:26
 */
import store from '@/store'
import { toRaw } from 'vue'
export default () => {
  const collector = new Set()
  const fonts: any = {}
  const { dWidgets: widgets } = store.getters
  for (let i = 0; i < widgets.length; i++) {
    const { type, fontClass } = widgets[i]
    if (type === 'w-text') {
      collector.add(fontClass.id)
      fonts[fontClass.id] = toRaw(fontClass)
    }
  }
  return Array.from(collector).map((id: any) => fonts[id])
}
