/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: Store方法export
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-18 21:00:00
 */

import useBaseStore from "./base";
import useUserStore from "./base/user";
import usePageStore from "./design/page"
import useCanvasStore from "./design/canvas"
import useControlStore from './design/control'
import useHistoryStore from './design/history'

export {
  useBaseStore,
  useUserStore,
  usePageStore,
  useCanvasStore,
  useControlStore,
  useHistoryStore,
}
