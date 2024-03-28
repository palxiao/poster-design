/*
 * @Author: ShawnPhang
 * @Date: 2022-03-09 16:29:54
 * @Description: 处理和ctrl建相关的操作
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-15 17:34:51
 */
import store from '@/store'
import handlePaste from './handlePaste'

export default function dealWithCtrl(e: any, _this: any) {
  switch (e.keyCode) {
    case 71: // g
      e.preventDefault()
      store.dispatch('realCombined')
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
  let itHas = false
  const childs = store.getters.dWidgets.filter((x: any) => x.parent === pid) || []
  childs.forEach((element: any) => {
    element[key] && (itHas = true)
  })
  return itHas
}
/**
 * 复制元素
 */
function copy() {
  if (store.getters.dActiveElement.uuid === '-1') {
    return
  } else if (store.getters.dActiveElement.isContainer && checkGroupChild(store.getters.dActiveElement.uuid, 'editable')) {
    return
  }
  !store.getters.dActiveElement.editable && store.dispatch('copyWidget')
}
/**
 * 粘贴
 */
function paste() {
  handlePaste().then(() => {
    if (store.getters.dCopyElement.length === 0) {
      return
    } else if (store.getters.dActiveElement.isContainer && checkGroupChild(store.getters.dActiveElement.uuid, 'editable')) {
      return
    }
    !store.getters.dActiveElement.editable && store.dispatch('pasteWidget')
  })
}
/**
 * 撤销
 */
function undo(shiftKey: any) {
  console.log(store.getters.dHistoryParams);
  
  if (shiftKey) {
    if (!(store.getters.dHistoryParams.index === store.getters.dHistoryParams.length - 1)) {
      // this.handleHistory('redo')
      store.dispatch('handleHistory', 'redo')
    }
  } else if (store.getters.dHistoryParams.index !== -1) {
    // this.handleHistory('undo')
    store.dispatch('handleHistory', 'undo')
  }
}
