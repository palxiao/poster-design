/*
 * @Author: ShawnPhang
 * @Date: 2022-03-09 14:20:09
 * @Description: 处理常用操作
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-30 10:09:55
 */
import { useControlStore } from '@/pinia'
import store from '@/store'

export default function keyCodeOptions(e: any, params: any) {
  const { f } = params
  const controlStore = useControlStore()

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
      {
        if (store.getters.dActiveElement.isContainer) {
          if (checkGroupChild(store.getters.dActiveElement.uuid, 'editable')) {
            return
          }
        }
        const { type, editable }: any = store.getters.dActiveElement

        if (type === 'w-text') {
          // 不在编辑状态则执行删除
          !editable && controlStore.showMoveable && store.dispatch('deleteWidget')
        } else store.dispatch('deleteWidget')
      }
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
