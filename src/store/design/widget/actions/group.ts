/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 21:00:00
 * @Description:
 * @LastEditors: xi_zi
 * @LastEditTime: 2024-04-03 16:02:46
 */

import { useCanvasStore, useHistoryStore } from "@/store"
import { TWidgetStore, TdWidgetData } from ".."
import { customAlphabet } from 'nanoid/non-secure'
import { transferTransformWidgets } from "@/utils/widgets/transferTranslate"
const nanoid = customAlphabet('1234567890abcdef', 12)


export function addGroup(store: TWidgetStore, group: TdWidgetData[]) {
  const historyStore = useHistoryStore()
  const canvasStore = useCanvasStore()
  let parent: TdWidgetData | null = null
  const tGroup = transferTransformWidgets(group)
  tGroup.forEach((item) => {
    item.uuid = nanoid() // 重设id
    item.type === 'w-group' && (parent = item) // 找出父组件
  })
  tGroup.forEach((item) => {
    !item.isContainer && parent && (item.parent = parent.uuid) // 重设父id
    item.text && (item.text = decodeURIComponent(item.text))
    store.dWidgets.push(item)
  })
  // 选中组件
  const len = store.dWidgets.length
  store.dActiveElement = store.dWidgets[len - 1]

  historyStore.pushHistory("addGroup")
  // store.dispatch('pushHistory', 'addGroup')
  canvasStore.reChangeCanvas()
  // store.dispatch('reChangeCanvas')
}