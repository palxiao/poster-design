/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-18 18:35:16
 */

import { useControlStore, useCanvasStore, useWidgetStore } from '@/store'
import { THistoryStore } from '..'
import { enablePatches, applyPatches } from 'immer'
enablePatches()

export default function handleHistory(store: THistoryStore, action: 'undo' | 'redo') {
  const pageStore = useCanvasStore()
  const controlStore = useControlStore()
  const widgetStore = useWidgetStore()
  // controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  // // store.commit('setShowMoveable', false) // 清理掉上一次的选择框
  // const history = store.dHistory
  // const pageHistory = store.dPageHistory
  const historyParams = store.dHistoryParams
  const { changes, inverseChanges } = store.dHistoryStack
  let index = historyParams.stackPointer
  const curLayouts = JSON.parse(JSON.stringify(widgetStore.dLayouts))
  switch (action) {
    case 'undo':
      if (inverseChanges.length > 0 && index >= 0) {
        const newLayouts = applyPatches(curLayouts, inverseChanges[index])
        widgetStore.setDLayouts(JSON.parse(JSON.stringify(newLayouts)))
        historyParams.stackPointer--
      }
      break
    case 'redo':
      if (changes.length > 0 && index !== changes.length - 1) {
        historyParams.stackPointer++
        const newLayouts = applyPatches(curLayouts, changes[index + 1])
        widgetStore.setDLayouts(JSON.parse(JSON.stringify(newLayouts)))
      }
      break
  }
  // if (action === 'undo') {
  //   historyParams.index -= 1 // 下标向前移1 撤销
  //   console.log(historyParams.index)
  //   if (historyParams.index > -1) {
  //     widgetStore.setDWidgets(JSON.parse(history[historyParams.index]))
  //     pageStore.setDPage(JSON.parse(pageHistory[historyParams.index]))
  //   }
  // } else if (action === 'redo') {
  //   historyParams.index += 1 // 下标向后移1 重做
  //   // 如果下标小于历史记录列表长度，直接取出历史记录
  //   // if (historyParams.index < historyParams.length) {
  //   widgetStore.setDWidgets(JSON.parse(history[historyParams.index]))
  //   pageStore.setDPage(JSON.parse(pageHistory[historyParams.index]))
  //   // } else {
  //   //   // 否则设置下标为列表最后一项
  //   //   historyParams.index = historyParams.length - 1
  //   //   store.state.dWidgets = JSON.parse(history[historyParams.index])
  //   //   store.state.dPage = JSON.parse(pageHistory[historyParams.index + 1])
  //   // }
  // }
}
