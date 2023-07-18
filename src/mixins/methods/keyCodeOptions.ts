/*
 * @Author: ShawnPhang
 * @Date: 2022-03-09 14:20:09
 * @Description: 处理常用操作
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-30 17:29:28
 */
import store from '@/store'

export default function keyCodeOptions(e: any, params: any) {
  const { f } = params
  switch (e.keyCode) {
    case 38:
      udlr('top', -1 * f, e)
      break
    case 40:
      udlr('top', Number(f), e)
      break
    case 37:
      udlr('left', -1 * f, e)
      break
    case 39:
      udlr('left', Number(f), e)
      break
    case 46:
    case 8:
      if (store.getters.dActiveElement.isContainer) {
        if (checkGroupChild(store.getters.dActiveElement.uuid, 'editable')) {
          return
        }
      }
      !store.getters.dActiveElement.editable && store.dispatch('deleteWidget')
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
 * TODO 键盘操作上下左右移动组件
 */
function udlr(type: any, value: any, event: any) {
  if (store.getters.dActiveElement.uuid != -1) {
    if (store.getters.dActiveElement.editable) {
      return
    } else if (store.getters.dActiveElement.isContainer && checkGroupChild(store.getters.dActiveElement.uuid, 'editable')) {
      return
    }
    event.preventDefault()
    const result = Number(store.getters.dActiveElement[type]) + value
    store.dispatch('updateWidgetData', {
      uuid: store.getters.dActiveElement.uuid,
      key: type,
      value: result,
    })
    // TODO: 键盘移位需要防抖入栈
    // timer = setTimeout(() => {
    //   this.pushHistory()
    // }, 100)
  }
}
