/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 14:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */

import { useCanvasStore, useHistoryStore } from "@/store"
import { TWidgetStore, TdWidgetData } from ".."

type TAlign = 'left' | 'ch' | 'right' | 'top' | 'cv' | 'bottom'

export type TUpdateAlignData = {
  align: TAlign
  uuid: string
  group?: TdWidgetData
}

export function updateAlign(store: TWidgetStore, { align, uuid, group }: TUpdateAlignData) {
  const pageStore = useCanvasStore()
  const historyStore = useHistoryStore()
  const canvasStore = useCanvasStore()

  const widgets = store.dWidgets
  const target = uuid ? widgets.find((item: any) => item.uuid === uuid) : store.dActiveElement
  let parent = group || pageStore.dPage

  if (!target) return

  if (target.parent !== '-1') {
    const tmp = widgets.find((item: any) => item.uuid === target.parent)
    tmp && (parent = tmp)
  }

  let left = target.left
  let top = target.top
  let pw = parent.record.width || parent.width
  let ph = parent.record.height || parent.height

  if (parent.uuid === '-1') {
    pw = parent.width
    ph = parent.height
  }

  const targetW = target.width
  const targetH = target.height
  switch (align) {
    case 'left':
      left = parent.left
      break
    case 'ch': // 水平居中
      left = parent.left + pw / 2 - targetW / 2
      break
    case 'right':
      left = parent.left + pw - targetW
      break
    case 'top':
      top = parent.top
      break
    case 'cv': // 垂直居中
      top = parent.top + ph / 2 - targetH / 2
      break
    case 'bottom':
      top = parent.top + ph - targetH
      break
  }

  if (target.left !== left || target.top !== top) {
    if (target.isContainer) {
      const dLeft = target.left - left
      const dTop = target.top - top
      const len = widgets.length
      for (let i = 0; i < len; ++i) {
        const widget = widgets[i]
        if (widget.parent === target.uuid) {
          widget.left -= dLeft
          widget.top -= dTop
        }
      }
    }
    target.left = left
    target.top = top

    historyStore.pushHistory("updateAlign")
    // store.dispatch('pushHistory', 'updateAlign')
    canvasStore.reChangeCanvas()
    // store.dispatch('reChangeCanvas')
  }
}
