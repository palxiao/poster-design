/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 14:00:00
 * @Description:
 * @LastEditors: xi_zi
 * @LastEditTime: 2024-04-03 23:34:21
 */

import { customAlphabet } from 'nanoid/non-secure'
import { TGroupStore } from '..'
import { useHistoryStore, useCanvasStore, useWidgetStore } from '@/store'
import { TdWidgetData } from '../../widget'
import { getOffsetFromTransform, transferTransformWidget } from '@/utils/widgets/transferTranslate'
const nanoid = customAlphabet('1234567890abcdef', 12)

export function realCombined(store: TGroupStore) {
  const widgetStore = useWidgetStore()
  const pageStore = useCanvasStore()
  const historyStore = useHistoryStore()
  const selectWidgets = widgetStore.dSelectWidgets
  if (selectWidgets.length > 1) {
    const widgets = widgetStore.dWidgets
    const group: TdWidgetData = JSON.parse(store.dGroupJson)
    group.uuid = nanoid()
    widgets.push(group)
    let left = Number(pageStore.dPage.width)
    let top = Number(pageStore.dPage.height)
    let right = 0
    let bottom = 0
    const sortWidgets = [] // 顺序取出元素
    const selectkeys = selectWidgets.map((x: Type.Object) => x.uuid)
    for (const w of widgets) {
      selectkeys.includes(w.uuid) && sortWidgets.push(w)
    }
    for (let i = 0; i < sortWidgets.length; ++i) {
      const uuid = sortWidgets[i].uuid
      const index = widgets.findIndex((item: Type.Object) => item.uuid === uuid)
      const widget = { ...widgets[index] } // clone
      if (widget.isContainer) {
        widgets.splice(index, 1) // 删除旧组合
        for (let i = 0; i < widgets.length; i++) {
          const item = widgets[i]
          item.parent === widget.uuid && (item.parent = group.uuid)
          // if (item.parent === widget.uuid) {
          //   item.parent = group.uuid
          //   // 重新排列
          //   // const index = widgets.findIndex((x) => x.uuid === item.uuid)
          //   // widgets.splice(index, 1)
          //   // widgets.push(item)
          // }
        }
      } else {
        widget.parent = group.uuid
        // 重新排列
        widgets.splice(index, 1)
        widgets.push(widget)
      }

      // sortWidgets.push({
      //   index: index,
      //   widget: widget,
      // })
      const { x, y } = getOffsetFromTransform(widget.transform ?? '')
      left = Math.min(left, x)
      top = Math.min(top, y)
      const rect = document.getElementById(`${widget.uuid}`)?.getBoundingClientRect()
      right = Math.max(right, Number((rect?.width ?? 0) / (pageStore.dZoom / 100) || widget.record.width) + Number(x))
      bottom = Math.max(bottom, Number((rect?.height ?? 0) / (pageStore.dZoom / 100) || widget.record.height) + Number(y))
    }
    // sortWidgets.sort((a, b) => a.index > b.index)
    // for (let i = 0; i < sortWidgets.length; ++i) {
    //   const index = widgets.findIndex((item) => item.uuid === sortWidgets[i].widget.uuid)
    //     widgets.splice(index, 1)
    //     widgets.push(sortWidgets[i].widget)
    // }
    // group.left = Number(left)
    // group.top = Number(top)
    group.transform = `translate(${left}px,${top}px)`
    group.width = Number(right - left)
    group.height = Number(bottom - top)
    widgetStore.dActiveElement = group
    widgetStore.dSelectWidgets = []

    historyStore.pushHistory('realCombined')
    // store.dispatch('pushHistory', 'realCombined')
    // store.dispatch('reChangeCanvas')
  }
}

export function getCombined(store: TGroupStore): Promise<TdWidgetData> {
  const widgetStore = useWidgetStore()
  const pageStore = useCanvasStore()

  const selectWidgets = widgetStore.dSelectWidgets
  return new Promise((resolve) => {
    if (selectWidgets.length > 1) {

      const widgets = widgetStore.dWidgets
      const group = JSON.parse(store.dGroupJson)
      group.uuid = nanoid()
      // widgets.push(group)
      let left = pageStore.dPage.width
      let top = pageStore.dPage.height
      let right = 0
      let bottom = 0
      const sortWidgets = [] // 顺序取出元素
      const selectkeys = selectWidgets.map((x: Type.Object) => x.uuid)
      for (const w of widgets) {
        selectkeys.includes(w.uuid) && sortWidgets.push(w)
      }
      for (let i = 0; i < sortWidgets.length; ++i) {
        const uuid = sortWidgets[i].uuid
        const index = widgets.findIndex((item: Type.Object) => item.uuid === uuid)
        const widget = { ...widgets[index] } // clone
        const { x, y } = getOffsetFromTransform(widget.transform ?? '')
        left = Math.min(left, x)
        top = Math.min(top, y)
        const rect = document.getElementById(`${widget.uuid}`)?.getBoundingClientRect()
        right = Math.max(right, Number((rect?.width ?? 0) / (pageStore.dZoom / 100) || widget.record.width) + Number(x))
        bottom = Math.max(bottom, Number((rect?.height ?? 0) / (pageStore.dZoom / 100) || widget.record.height) + Number(y))
      }

      group.transform = `translate(${left}px,${top}px)`
      group.width = Number(right - left)
      group.height = Number(bottom - top)

      resolve(group)
    }
  })
}

export function initGroupJson(store: TGroupStore, json: string) {
  store.dGroupJson = json
}
