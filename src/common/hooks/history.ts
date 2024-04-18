/*
 * @Author: ShawnPhang
 * @Date: 2024-04-18 16:10:07
 * @Description: 事件自动注册，生成差分补丁，使用双栈记录
 *  事件自动注册的逻辑是鼠标事件黑名单，键盘事件白名单，跑一段时间看看实际情况如何
 *  差分补丁目前已知的问题是，对于预期以外的影响状态树的修改，现在都会写进历史记录，看起来就像多了一段毫无变化的历史栈一样
 *  例如图层的 left 在修改后可能为 12.6262638 但为了输入框中显示友好，在 input 组件中将自动格式化为 12.63，这个逻辑以前不会有问题，现在则不能这么做了
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-18 20:54:41
 */
import { onMounted } from 'vue'
// import WebWorker from '@/utils/plugins/webWorker'
import historyFactory from '@/utils/widgets/diffLayouts'
import { useHistoryStore, useWidgetStore } from '@/store'

const blackClass: string[] = ['operation-item', 'icon-undo', 'icon-redo']
const whiteKey: string[] = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Backspace']

const historyStore = useHistoryStore()
const widgetStore = useWidgetStore()
// const historyWorker = new WebWorker('history')
const diffLayouts = new historyFactory()

let processing = false
let historyTimer: any = null

function noPutHistory(target: any) {
  const classList = Array.from(target.classList)
  return classList.filter((v: any) => blackClass.includes(v)).length > 0
}

export default () => {
  // historyWorker.start(null, (changes: any) => {
  //   changes.patches.length > 0 && historyStore.changeHistory(changes)
  //   processing = false
  // })
  diffLayouts.onmessage((changes: any) => {
    changes.patches.length > 0 && historyStore.changeHistory(changes)
    processing = false
  })
  onMounted(() => {
    document.addEventListener(
      'mousedown',
      (e: any) => {
        if (noPutHistory(e.target)) return
        // historyWorker.send(!processing ? { op: 'diff', data: JSON.stringify(widgetStore.dLayouts) } : null)
        diffLayouts.postMessage(!processing ? { op: 'diff', data: JSON.stringify(widgetStore.dLayouts) } : null)
        processing = true
      },
      false,
    )
    document.addEventListener(
      'mouseup',
      (e: any) => {
        if (noPutHistory(e.target)) return
        clearTimeout(historyTimer)
        historyTimer = setTimeout(() => {
          // historyWorker.send({ op: 'done', data: JSON.stringify(widgetStore.dLayouts) })
          diffLayouts.postMessage({ op: 'done', data: JSON.stringify(widgetStore.dLayouts) })
        }, 150)
      },
      false,
    )
    document.addEventListener(
      'keydown',
      (e) => {
        if (!whiteKey.includes(e.key)) return
        // historyWorker.send(!processing ? { op: 'diff', data: JSON.stringify(widgetStore.dLayouts) } : null)
        diffLayouts.postMessage(!processing ? { op: 'diff', data: JSON.stringify(widgetStore.dLayouts) } : null)
        processing = true
      },
      false,
    )
    document.addEventListener(
      'keyup',
      (e) => {
        if (!whiteKey.includes(e.key)) return
        clearTimeout(historyTimer)
        historyTimer = setTimeout(() => {
          // historyWorker.send({ op: 'done', data: JSON.stringify(widgetStore.dLayouts) })
          diffLayouts.postMessage({ op: 'done', data: JSON.stringify(widgetStore.dLayouts) })
        }, 150)
      },
      false,
    )
  })
}
