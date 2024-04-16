/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-28 14:00:00
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-15 16:54:45
 */

import { useCanvasStore } from '@/store'
import { TWidgetState, TdWidgetData } from '..'
import { TPageState } from '@/store/design/canvas/d'

export type TWidgetJsonData = TPageState & {
  widgets: TdWidgetData
}

/** 返回组件Json数据 */
export function widgetJsonData(state: TWidgetState) {
  const pageStore = useCanvasStore()
  const { dCurrentPage } = pageStore
  // const page: TWidgetJsonData = JSON.parse(JSON.stringify(pageStore.dPage))
  return state.dLayouts[dCurrentPage].layers
}
