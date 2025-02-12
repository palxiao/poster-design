/*
 * @Author: ShawnPhang
 * @Date: 2022-03-09 16:29:54
 * @Description: 处理和ctrl建相关的操作
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2025-02-12 18:52:35
 */
// import store from '@/store'
import handlePaste from './handlePaste'
import { useGroupStore, useHistoryStore, useWidgetStore } from '@/store'

export default function dealWithCtrl(e: KeyboardEvent, _this: any) {
  const groupStore = useGroupStore()
  switch (e.keyCode) {
    case 71: // g
      e.preventDefault()
      groupStore.realCombined()
      // store.dispatch('realCombined')
      break
    case 67: // c
      copy()
      break
    case 86: // v
      paste()
      break
    case 90: // z
      undo(e.shiftKey)
      break
    case 83: // s
      e.preventDefault()
      _this.save()
      break
    case 187: // +
      e.preventDefault()
      _this.zoomAdd()
      break
    case 189: // -
      e.preventDefault()
      _this.zoomSub()
      break
  }
}

/**
 * 对组合的子元素某个值进行判断
 */
function checkGroupChild(pid: number | string, key: any) {
  const widgetStore = useWidgetStore()
  let itHas = false
  const childs = widgetStore.dWidgets.filter((x) => x.parent === pid) || []
  childs.forEach((element: any) => {
    element[key] && (itHas = true)
  })
  return itHas
}
/**
 * 复制元素
 */
function copy() {
  const widgetStore = useWidgetStore()
  if (widgetStore.dActiveElement?.uuid === '-1') {
    return
  } else if (widgetStore.dActiveElement?.isContainer && checkGroupChild(widgetStore.dActiveElement?.uuid, 'editable')) {
    return
  }
  !widgetStore.dActiveElement?.editable && widgetStore.copyWidget()
  // !widgetStore.dActiveElement?.editable && store.dispatch('copyWidget')
}
/**
 * 粘贴
 */
function paste() {
  handlePaste().then(() => {
    const widgetStore = useWidgetStore()
    if (widgetStore.dCopyElement.length === 0) {
      return
    } else if (widgetStore.dActiveElement?.isContainer && checkGroupChild(widgetStore.dActiveElement?.uuid, 'editable')) {
      return
    }
    !widgetStore.dActiveElement?.editable && widgetStore.pasteWidget()
  })
}
/**
 * 撤销
 */
function undo(shiftKey: any) {
  const widgetStore = useWidgetStore()
  const historyStore = useHistoryStore()

  const { type, editable }: any = widgetStore.dActiveElement
  if (type === 'w-text') {
    // 不在编辑状态则执行撤销操作
    !editable && (shiftKey ? historyStore.handleHistory('redo') : historyStore.handleHistory('undo'))
  } else shiftKey ? historyStore.handleHistory('redo') : historyStore.handleHistory('undo')
}
