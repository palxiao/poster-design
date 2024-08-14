/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 09:28:41
 */

import { Store, defineStore } from 'pinia'
import { pushColorToHistory } from './actions/pushHistory'
import handleHistory from './actions/handleHistory'
import { useCanvasStore, useWidgetStore } from '@/store'

export type THistoryParamData = {
  index: number
  length: number
  maxLength: number
  stackPointer: number
}
export type THsitoryStack = {
  changes: any[]
  inverseChanges: any[]
}

type THistoryState = {
  /** 记录历史操作（保存整个画布的json数据） */
  dHistory: string[]
  /** 记录历史操作对应的page */
  dPageHistory: string[]
  /** 记录差分补丁 */
  dHistoryStack: THsitoryStack
  /** 记录指针等数据 */
  dHistoryParams: THistoryParamData
  /** 记录历史选择的颜色 */
  dColorHistory: string[]
}

type THistoryAction = {
  /** 写入历史记录 */
  changeHistory: (patches: any) => void
  /**
   * 操作历史记录
   * action为undo表示撤销
   * action为redo表示重做
   */
  handleHistory: (action: 'undo' | 'redo') => void
  pushColorToHistory: (color: string) => void
}

/** 历史记录Store */
const HistoryStore = defineStore<'historyStore', THistoryState, {}, THistoryAction>('historyStore', {
  state: () => ({
    dHistory: [],
    dHistoryParams: {
      index: -1,
      length: 0,
      maxLength: 20,
      stackPointer: -1
    },
    dHistoryStack: {
      changes: [],
      inverseChanges: [],
    },
    dColorHistory: [],
    dPageHistory: [],
  }),

  actions: {
    changeHistory({ patches, inversePatches }) {
      const pointer = ++this.dHistoryParams.stackPointer
      // 如若之前撤销过，当新增记录时，后面的记录就清空了
      this.dHistoryStack.changes.length = pointer
      this.dHistoryStack.inverseChanges.length = pointer
      this.dHistoryStack.changes[pointer] = patches
      this.dHistoryStack.inverseChanges[pointer] = inversePatches
    },
    handleHistory(action) {
      handleHistory(this, action)
      // TODO: 操作后如果当前选中元素还在，则应当保留选择框
      // widgetStore.setdActiveElement(pageStore.dPage)
    },
    pushColorToHistory(color) {
      pushColorToHistory(this, color)
    },
  },
})

export type THistoryStore = Store<'historyStore', THistoryState, {}, THistoryAction>

export default HistoryStore
