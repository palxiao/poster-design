/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 14:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */

import { usePageStore } from "@/pinia"
import { TWidgetState, TdWidgetData } from ".."
import { TPageState } from "../../page"

export type TWidgetJsonData = TPageState & {
  widgets: TdWidgetData
}

/** 返回组件Json数据 */
export function widgetJsonData(state: TWidgetState) {
  const pageStore = usePageStore()
  const page: TWidgetJsonData = JSON.parse(JSON.stringify(pageStore.dPage))
  const widgets = JSON.parse(JSON.stringify(state.dWidgets))
  page.widgets = widgets

  return page
}
