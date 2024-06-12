/*
 * @Author: ShawnPhang
 * @Date: 2023-10-14 20:16:48
 * @Description: 找出页面中使用的字体
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-14 20:29:26
 */
// import store from '@/store'
import { useWidgetStore } from '@/store'
import { toRaw } from 'vue'
export default () => {
  const widgetStore = useWidgetStore()
  const collector = new Set<string>()
  const fonts: Record<string, any> = {}
  const { dWidgets: widgets } = widgetStore
  for (let i = 0; i < widgets.length; i++) {
    const { type, fontClass } = widgets[i]
    if (type === 'w-calendar') {
      console.log(type);
      
      fontClass && collector.add(fontClass.id)
      fontClass && (fonts[fontClass.id] = toRaw(fontClass))
    }
  }
  return Array.from(collector).map((id: string) => fonts[id])
}
