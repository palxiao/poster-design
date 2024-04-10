/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: Store方法export
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-10 18:01:14
 */

import { useCanvasStore, useControlStore } from '@/store'
import { TWidgetStore } from '..'
import { updateGroupSize } from '.'

export type TInitResize = {
  startX: number
  startY: number
  originX: number
  originY: number
  width: number
  height: number
}

export type TSize = {
  width: number
  height: number
}

export type TdResizePayload = {
  x: number
  y: number
  /** 方向 */
  dirs: 'top' | 'left' | 'bottom' | 'right'
}

/** 设置 resize 操作的初始值 */
export function initDResize(store: TWidgetStore, payload: TInitResize) {
  const mouseXY = store.dMouseXY
  const widgetXY = store.dActiveWidgetXY
  const resizeWH = store.dResizeWH
  mouseXY.x = payload.startX
  mouseXY.y = payload.startY
  widgetXY.x = payload.originX
  widgetXY.y = payload.originY
  resizeWH.width = payload.width
  resizeWH.height = payload.height
}

/** 更新组件宽高 */
export function dResize(store: TWidgetStore, { x, y, dirs }: TdResizePayload) {
  const canvasStore = useCanvasStore()
  const controlStore = useControlStore()

  controlStore.setdResizeing(true)

  const page = canvasStore.dPage
  const target = store.dActiveElement
  const mouseXY = store.dMouseXY
  const widgetXY = store.dActiveWidgetXY
  const resizeWH = store.dResizeWH
  let parent = page
  if (!target) return
  if (target.parent !== '-1') {
    const tmp = store.dWidgets.find((item) => item.uuid === target.parent)
    if (tmp) {
      parent = tmp
    }
  }

  const dx = x - mouseXY.x
  const dy = y - mouseXY.y

  let left = 0
  let top = 0

  for (let i = 0; i < dirs.length; ++i) {
    const dir = dirs[i]

    switch (dir) {
      case 'top':
        const t = widgetXY.y + Math.floor((dy * 100) / canvasStore.dZoom)
        top = Math.max(t, 0)
        top = Math.min(widgetXY.y + resizeWH.height - target.record.minHeight, top)
        target.height += target.top - top
        target.height = Math.max(target.height, target.record.minHeight)
        target.top = top
        break
      case 'bottom':
        top = Math.floor((dy * 100) / canvasStore.dZoom)
        target.height = resizeWH.height + top
        target.height = Math.max(target.height, target.record.minHeight)
        target.height = Math.min(target.height, page.height - target.top)
        break
      case 'left':
        const tLeft = widgetXY.x + Math.floor((dx * 100) / canvasStore.dZoom)
        left = Math.max(tLeft, 0)
        target.width += target.left - left
        target.width = Math.max(target.width, target.record.minWidth)
        left = Math.min(widgetXY.x + resizeWH.width - target.record.minWidth, left)
        target.left = left
        break
      case 'right':
        left = Math.floor((dx * 100) / canvasStore.dZoom)
        target.width = resizeWH.width + left
        target.width = Math.max(target.width, target.record.minWidth)
        target.width = Math.min(target.width, page.width - target.left)
        break
    }
  }
  if (parent.uuid !== '-1') {
    updateGroupSize(store, parent.uuid)
  }
  canvasStore.reChangeCanvas()
}

export function resize(store: TWidgetStore, size: TSize) {
  const { width, height } = size
  const target = store.dActiveElement
  if (!target) return target
  target.width = width
  target.height = height
}

/** 自适应适配所有元素 */
export function autoResizeAll(store: TWidgetStore, lastPageSize: TSize) {
  if (!lastPageSize) return
  const canvasStore = useCanvasStore()
  const { width: lastWidth, height: lastHeight } = lastPageSize
  const { width: pageWidth, height: pageHeight } = canvasStore.dPage
  const originWHRatio = lastWidth / lastHeight // 原始比例
  const WHRatio = pageWidth / pageHeight // 当前比例
  const changeFn = originWHRatio > WHRatio ? 'max' : 'min'
  const degree = [pageWidth / lastWidth, pageHeight / lastHeight]
  const ratio = Math[changeFn](...degree)
  const pageDiff = (pageWidth - lastWidth) / 2
  for (const widget of store.dWidgets) {
    const originWidth = widget.width
    let diff = 0
    if (widget.type === 'w-text') {
      widget.fontSize && (widget.fontSize *= ratio)
    } else widget.height *= ratio
    widget.width *= ratio
    diff = (originWidth - widget.width) / 2
    widget.left = widget.left + diff + pageDiff
    widget.top *= degree[1]
  }
}
