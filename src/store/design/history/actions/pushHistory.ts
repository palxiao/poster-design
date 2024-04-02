/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-27 21:00:00
 */

import { useCanvasStore, useWidgetStore } from "@/store"
import { THistoryStore } from ".."
import { proxyToObject } from "@/utils/utils"

/** push操作历史记录 */
export function pushHistory(store: THistoryStore, msg: string = "") {
  const pageStore = useCanvasStore()
  const widgetStore = useWidgetStore()
  console.log('history压栈', '来源: ' + msg)
  // 如果有上一次记录，并且与新纪录相同，那么不继续操作
  if (store.dHistory[store.dHistory.length - 1] && store.dHistory[store.dHistory.length - 1] === JSON.stringify(widgetStore.dWidgets)) {
    return
  }
  if (store.dHistoryParams.index < history.length - 1) {
    const index = store.dHistoryParams.index + 1
    const len = history.length - index
    store.dHistory.splice(index, len)
    store.dPageHistory.splice(index, len)
    store.dHistoryParams.length = store.dHistory.length
    store.dHistoryParams.index = store.dHistory.length - 1
  }
  store.dHistory.push(JSON.stringify(widgetStore.dWidgets))
  store.dPageHistory.push(JSON.stringify(proxyToObject(pageStore.dPage)))
  store.dHistoryParams.index = store.dHistory.length - 1
  store.dHistoryParams.length = store.dHistory.length
}

/** 添加颜色选择历史记录 */
export function pushColorToHistory(store: THistoryStore, color: string) {
  const history = store.dColorHistory
  // 如果已经存在就提到前面来，避免重复
  const index = history.indexOf(color)
  if (index !== -1) {
    history.splice(index, 1)
  }
  // 最多保存3种颜色
  if (history.length === 4) {
    history.splice(history.length - 1, 1)
  }
  // 把最新的颜色放在头部
  const head = [color]
  store.dColorHistory = head.concat(history)
}
