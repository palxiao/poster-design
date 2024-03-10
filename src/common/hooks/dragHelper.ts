/*
 * @Author: ShawnPhang
 * @Date: 2023-07-10 14:58:48
 * @Description: 拖拽优化
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-22 18:11:15
 */

import store from '@/store'

type TInitial = {
  offsetX: number
  offsetY: number
  pageX: number
  pageY: number
  width: number
  height: number
  finallySize: number
  flag: number
  x: number
  y: number
}

type TQueueFunction = () => void

export default class DragHelper {
  private cloneEl?: HTMLElement | null
  private dragging: boolean = false
  private initial: Partial<TInitial> = {}
  private queue: TQueueFunction[] = []

  constructor() {
    window.addEventListener('mousemove', (e) => {
      if (this.dragging && this.cloneEl) {
        const { width, height } = this.initial as TInitial
        // this.moveFlutter(e.pageX - offsetX, e.pageY - offsetY, this.distance(e))
        this.moveFlutter(e.pageX - width / 2, e.pageY - height / 2, this.distance(e))
      } else {
        this.finish()
      }
    })
    // 鼠标抬起
    window.addEventListener('mouseup', (e) => {
      const el = window.document.getElementById('app')
      if (!el || !e.target) return
      el.classList.remove('drag_active')
      const target = e.target as HTMLElement
      const cl = target.classList
      if (
        target.id === 'page-design-canvas' ||
        cl.contains('target') ||
        cl.contains('drop__mask') ||
        cl.contains('edit-text')
      ) {
        setTimeout(() => {
          this.finish(true)
        }, 10)
      } else this.finish()
    })
    // 鼠标离开了视窗
    document.addEventListener('mouseleave', (e) => {
      this.finish()
    })
    // 用户可能离开了浏览器
    window.onblur = () => {
      this.finish()
    }
  }
  /**
   * 拖动开始 mousedown
   */
  public start(e: MouseEvent, finallySize: number) {
    if (!this.cloneEl) {
      store.commit('setDraging', true)
      const app = window.document.getElementById('app')
      if (!app || !e) return
      app.classList.add('drag_active') // 整个鼠标全局变成抓取
      const target = e.target as HTMLElement
      // 选中了元素
      this.cloneEl = (target.cloneNode(true) as HTMLElement)
      this.cloneEl.classList.add('flutter')
      // 初始化数据
      this.init(e, target, finallySize || target.offsetWidth, Math.random())
      // 加载原图
      // simulate(cloneEl.src, initial.flag)
      this.cloneEl.style.width = `${target.offsetWidth}`
      // e.target.parentElement.parentElement.appendChild(this.cloneEl)
      const widgetPanel =  window.document.getElementById('widget-panel')
      if (!widgetPanel) return
      widgetPanel.appendChild(this.cloneEl)
      this.dragging = true
      target.classList.add('hide') // 放在最后
      this.queue.push(() => {
        target.classList.remove('hide')
      })
    }
  }
  // 开始拖动初始化
  private init(
    { offsetX, offsetY, pageX, pageY, x, y }: MouseEvent,
    { offsetWidth: width, offsetHeight: height }: HTMLElement,
    finallySize: number,
    flag: number
  ) {
    this.initial = { offsetX, offsetY, pageX, pageY, width, height, finallySize, flag, x, y }
    // store.commit('setDragInitData', { offsetX: 0, offsetY: 0 })
    this.moveFlutter(pageX - offsetX, pageY - offsetY, 0, 0.3)
    setTimeout(() => {
      this.moveFlutter(pageX - width / 2, pageY - height / 2, 0, 0.3)
    }, 10)
  }
  // 改变漂浮元素（合并多个操作）
  private moveFlutter(x: number, y: number, d = 0, lazy = 0) {
    const { width, height, finallySize } = this.initial as TInitial
    let scale: string | null = null
    if (d) {
      if (width > finallySize) {
        scale = width - d >= finallySize ? `transform: scale(${(width - d) / width});` : null
      } else {
        scale = width + d <= finallySize ? `transform: scale(${(width + d) / width})` : null
      }
    }

    const options = [`left: ${x}px`, `top: ${y}px`, `width: ${width}px`, `height: ${height}px`]
    scale && options.push(scale)
    options.push(`transition: all ${lazy}s`)
    this.changeStyle(options)
  }
  private changeStyle(arr: string[]) {
    if (!this.cloneEl) return
    const original = this.cloneEl.style.cssText.split(';')
    original.pop()
    this.cloneEl.style.cssText = original.concat(arr).join(';') + ';'
  }
  // 结束/完成处理（动画）
  private finish(done = false) {
    if (!this.dragging) {
      return
    }
    this.dragging = false
    store.commit('setDraging', false)
    store.commit('selectItem', {})

    if (!done) {
      const { pageX, offsetX, pageY, offsetY } = this.initial as TInitial
      this.changeStyle([`left: ${pageX - offsetX}px`, `top: ${pageY - offsetY}px`, 'transform: scale(1)', 'transition: all 0.3s'])
    }
    setTimeout(
      () => {
        this.queue.length && (this.queue.shift() as TQueueFunction)()
        this.cloneEl && this.cloneEl.remove()
        this.cloneEl = null
      },
      done ? 0 : 300,
    )
  }
  // 计算两点之间距离
  private distance({ pageX, pageY }: { pageX: number, pageY: number }) {
    const { pageX: x, pageY: y } = this.initial as TInitial
    return Math.hypot(pageX - x, pageY - y)
  }
}
