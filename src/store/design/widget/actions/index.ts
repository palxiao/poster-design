/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: Store方法export
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */

import { useCanvasStore, useControlStore } from "@/store"
import { TWidgetStore, TdWidgetData } from ".."

export type TInidDMovePayload = {
  startX: number
  startY: number
  originX: number
  originY: number
}

/** 设置 mousemove 操作的初始值 */
export function initDMove(store: TWidgetStore, payload: TInidDMovePayload) {
  store.dMouseXY.x = payload.startX
  store.dMouseXY.y = payload.startY
  store.dActiveWidgetXY.x = payload.originX
  store.dActiveWidgetXY.y = payload.originY
}

export type TMovePayload = {
  donotMove?: boolean
  x: number
  y: number
}

/** 移动组件 */
export function dMove(store: TWidgetStore, payload: TMovePayload) {
  const page = useCanvasStore().dPage
  const canvasStore = useCanvasStore()
  const controlStore = useControlStore()
  const { donotMove } = payload // 由moveable代理移动
  controlStore.setdMoving(true)


  const target = store.dActiveElement
  const mouseXY = store.dMouseXY
  const widgetXY = store.dActiveWidgetXY

  let parent = page
  if (!target) return
  if (target.parent !== '-1') {
    const widget = store.dWidgets.find((item) => item.uuid === target.parent)
    if (widget) {
      parent = widget
    }
  }

  const dx = payload.x - mouseXY.x
  const dy = payload.y - mouseXY.y
  let left = widgetXY.x + Math.floor((dx * 100) / canvasStore.dZoom)
  let top = widgetXY.y + Math.floor((dy * 100) / canvasStore.dZoom)

  left = Math.max(Math.min(left, page.width - target.record.width), 0)
  top = Math.max(Math.min(top, page.height - target.record.height), 0)

  if (target.isContainer) {
    const dLeft = target.left - left
    const dTop = target.top - top
    const len = store.dWidgets.length
    for (let i = 0; i < len; ++i) {
      const widget = store.dWidgets[i]
      if (widget.parent === target.uuid) {
        widget.left -= dLeft
        widget.top -= dTop
      }
    }
  }

  if (!donotMove) {
    target.left = left
    target.top = top
  }

  if (parent.uuid !== '-1') {
    updateGroupSize(store, parent.uuid)
    // store.dispatch('updateGroupSize', parent.uuid)
  }
  canvasStore.reChangeCanvas()
  // store.dispatch('reChangeCanvas')
}

export function updateGroupSize(store: TWidgetStore, uuid: string) {
  const pageStore = useCanvasStore()
  const widgets = store.dWidgets
  const group = widgets.find((item) => item.uuid === uuid)
  if (!group) return
  let left = pageStore.dPage.width
  let top = pageStore.dPage.height
  let right = 0
  let bottom = 0
  for (let i = 0; i < widgets.length; ++i) {
    if (widgets[i].parent === group.uuid) {
      left = Math.min(left, widgets[i].left)
      top = Math.min(top, widgets[i].top)
      right = Math.max(right, widgets[i].record.width + widgets[i].left)
      bottom = Math.max(bottom, widgets[i].record.height + widgets[i].top)
    }
  }
  group.width = right - left
  group.height = bottom - top
  group.left = left
  group.top = top
}

export function updateHoverUuid(store: TWidgetStore, uuid: string) {
  store.dHoverUuid = uuid
}

/**
 * 设置拖拽时在哪个图层
 */
export function setDropOver(store: TWidgetStore, uuid: string) {
  store.dDropOverUuid = uuid
}

export function setMouseEvent(state: TWidgetStore, e: MouseEvent | null) {
  state.activeMouseEvent = e
}

export function setdActiveElement(state: TWidgetStore, data: TdWidgetData) {
  state.dActiveElement = data
}
