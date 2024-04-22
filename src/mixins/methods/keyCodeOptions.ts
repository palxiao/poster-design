/*
 * @Author: ShawnPhang
 * @Date: 2022-03-09 14:20:09
 * @Description: 处理常用操作
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-19 15:55:22
 */
import { useControlStore, useWidgetStore } from '@/store'
import { TdWidgetData } from '@/store/design/widget'

const appContainer: any = document.querySelector('#app')
const controlStore = useControlStore()
const widgetStore = useWidgetStore()

export default function keyCodeOptions(e: any, params: any) {
  const { range } = params
  switch (e.keyCode) {
    case 38:
      udlr('top', -1 * range, e)
      break
    case 40:
      udlr('top', Number(range), e)
      break
    case 37:
      udlr('left', -1 * range, e)
      break
    case 39:
      udlr('left', Number(range), e)
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

  if (e.key === ' ') {
    dealWithSpace(e)
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
  }
}

function dealWithSpace(event: any) {
  const widgetStore: any = useWidgetStore()
  // 防止编辑文字时空格按不出来
  if (!widgetStore.dActiveElement.editable) {
    event.preventDefault()
    if (widgetStore.dActiveElement?.uuid == '-1') {
      appContainer.classList.add('move-case')
      if (!controlStore.dSpaceDown) {
        widgetStore.lockWidgets()
      }
      controlStore.setSpaceDown(true)
    }
  }
}
