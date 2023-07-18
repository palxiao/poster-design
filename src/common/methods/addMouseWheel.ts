/*
 * @Author: ShawnPhang
 * @Date: 2022-03-25 13:43:07
 * @Description: 添加滚动监听
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-25 14:32:19
 */
import store from '@/store'
export default function(el: Element | string, cb: Function, altLimit: boolean = true) {
  const box = typeof el === 'string' ? document.getElementById(el) : el
  addEvent(box, 'mousewheel', (e: any) => {
    const ev = e || window.event
    const down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0
    // if (down) {
    //   console.log('鼠标滚轮向下---------')
    // } else {
    //   console.log('鼠标滚轮向上++++++++++')
    // }
    if (altLimit && store.getters.dAltDown) {
      ev.preventDefault()
      cb(down)
    } else if (!altLimit) {
      ev.preventDefault()
      cb(down)
    }
    return false
  })
}

function addEvent(obj: any, xEvent: string, fn: Function) {
  if (obj.attachEvent) {
    obj.attachEvent('on' + xEvent, fn)
  } else {
    obj.addEventListener(xEvent, fn, false)
  }
}
