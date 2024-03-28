/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 14:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */

import { useCanvasStore, useHistoryStore } from "@/pinia"
import { TWidgetStore, TdWidgetData } from ".."
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890abcdef', 12)

/** 拷贝组件 */
export function copyWidget(store: TWidgetStore) {
  const activeElement = JSON.parse(JSON.stringify(store.dActiveElement))
  if (activeElement.type === 'page') {
    return
  }
  navigator.clipboard.writeText('') // 清空系统剪贴板内容
  const container = []
  const selectWidgets = store.dSelectWidgets
  if (selectWidgets.length === 0) {
    const uuid = activeElement.uuid
    container.push(activeElement)
    if (activeElement.isContainer) {
      const widgets = store.dWidgets
      for (let i = 0; i < widgets.length; ++i) {
        if (widgets[i].parent === uuid) {
          container.push(widgets[i])
        }
      }
    }
  } else {
    for (let i = 0; i < selectWidgets.length; ++i) {
      const uuid = selectWidgets[i].uuid
      container.push(selectWidgets[i])
      if (selectWidgets[i].isContainer) {
        const widgets = store.dWidgets
        for (let i = 0; i < widgets.length; ++i) {
          if (widgets[i].parent === uuid) {
            container.push(widgets[i])
          }
        }
      }
    }
  }
  store.dCopyElement = JSON.parse(JSON.stringify(container))
}

/** 粘贴组件 */
export function pasteWidget(store: TWidgetStore) {
  const historyStore = useHistoryStore()
  const canvasStore = useCanvasStore()
  const copyElement: TdWidgetData[] = JSON.parse(JSON.stringify(store.dCopyElement))
  const container = copyElement.find((item) => item.isContainer)
  for (let i = 0; i < copyElement.length; ++i) {
    copyElement[i].uuid = nanoid()
    if (container && copyElement[i].uuid !== container.uuid) {
      copyElement[i].parent = container.uuid
    } else {
      copyElement[i].parent = '-1'
    }
    copyElement[i].top += 30
    copyElement[i].left += 30
  }
  store.dWidgets = store.dWidgets.concat(copyElement)
  store.dActiveElement = copyElement[0]
  store.dSelectWidgets = copyElement
  if (container) {
    store.dActiveElement = container
    store.dSelectWidgets = []
  }

  historyStore.pushHistory("pasteWidget")
  // store.dispatch('pushHistory', 'pasteWidget')
  store.copyWidget()
  // store.dispatch('copyWidget')
  canvasStore.reChangeCanvas()
  // store.dispatch('reChangeCanvas')
}
