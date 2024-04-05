/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 21:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */


import { customAlphabet } from 'nanoid/non-secure'
import { TWidgetStore, TdWidgetData } from '..'
import { useCanvasStore, useHistoryStore } from '@/store'
import { transferTransformWidgets } from '@/utils/widgets/transferTranslate'
const nanoid = customAlphabet('1234567890abcdef', 12)

// TODO: 选择模板
export function setTemplate(store: TWidgetStore, allWidgets: TdWidgetData[]) {
  const historyStore = useHistoryStore()
  const canvasStore = useCanvasStore()
  transferTransformWidgets(allWidgets).forEach((item) => {
    Number(item.uuid) < 0 && (item.uuid = nanoid()) // 重设id
    item.text && (item.text = decodeURIComponent(item.text))
    store.dWidgets.push(item)
  })

  historyStore.pushHistory("setTemplate")
  // store.dispatch('pushHistory', 'setTemplate')

  canvasStore.reChangeCanvas()
  // store.dispatch('reChangeCanvas')
}
