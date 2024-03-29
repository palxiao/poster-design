/*
 * @Author: ShawnPhang
 * @Date: 2022-03-09 14:20:09
 * @Description: 处理常用操作
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-30 10:09:55
 */
import { useControlStore, useWidgetStore } from '@/pinia'
import { TdWidgetData } from '@/pinia/design/widget'
// import store from '@/store'

export default function keyCodeOptions(e: any, params: any) {
  const { f } = params
  const controlStore = useControlStore()
  const widgetStore = useWidgetStore()

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
        if (widgetStore.dActiveElement?.isContainer) {
          if (checkGroupChild(widgetStore.dActiveElement?.uuid, 'editable')) {
            return
          }
        }
        if (!widgetStore.dActiveElement) return
        const { type, editable } = widgetStore.dActiveElement

        if (type === 'w-text') {
          // 不在编辑状态则执行删除
          !editable && controlStore.showMoveable && widgetStore.deleteWidget()
          // !editable && controlStore.showMoveable && store.dispatch('deleteWidget')
        } else {
          widgetStore.deleteWidget()
          // store.dispatch('deleteWidget')
        }
      }
      break
  }
}
/**
 * 对组合的子元素某个值进行判断
 */
function checkGroupChild(pid: number | string, key: keyof TdWidgetData) {
  const widgetStore = useWidgetStore()
  let itHas = false
  const childs = widgetStore.dWidgets.filter((x) => x.parent === pid) || []
  childs.forEach((element) => {
    element[key] && (itHas = true)
  })
  return itHas
}
/**
 * TODO 键盘操作上下左右移动组件
 */
function udlr(type: keyof TdWidgetData, value: any, event: any) {
  const widgetStore = useWidgetStore()
  if (!widgetStore.dActiveElement) return
  if (Number(widgetStore.dActiveElement.uuid) != -1) {
    if (widgetStore.dActiveElement.editable) {
      return
    } else if (widgetStore.dActiveElement.isContainer && checkGroupChild(widgetStore.dActiveElement.uuid, 'editable')) {
      return
    }
    event.preventDefault()
    const result = Number(widgetStore.dActiveElement[type]) + value
    widgetStore.updateWidgetData({
      uuid: widgetStore.dActiveElement.uuid,
      key: type,
      value: result,
    })
    // store.dispatch('updateWidgetData', {
    //   uuid: store.getters.dActiveElement.uuid,
    //   key: type,
    //   value: result,
    // })

    // TODO: 键盘移位需要防抖入栈
    // timer = setTimeout(() => {
    //   this.pushHistory()
    // }, 100)
  }
}
