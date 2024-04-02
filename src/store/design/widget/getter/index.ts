/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 14:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */

import { useCanvasStore } from "@/store"
import { TWidgetState, TdWidgetData } from ".."
import { TPageState } from "@/store/design/canvas/d"

export type TWidgetJsonData = TPageState & {
  widgets: TdWidgetData
}

/** 返回组件Json数据 */
export function widgetJsonData(state: TWidgetState) {
  const pageStore = useCanvasStore()
  const page: TWidgetJsonData = JSON.parse(JSON.stringify(pageStore.dPage))
  const widgets = JSON.parse(JSON.stringify(state.dWidgets))
  page.widgets = widgets

  return page
}
