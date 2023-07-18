/*
 * @Author: ShawnPhang
 * @Date: 2023-07-10 14:58:48
 * @Description: 拖拽优化
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-11 11:10:03
 */
import store from '@/store'
export default class dragHelper {
  private cloneEl: any = null
  private dragging: boolean = false
  private initial: any = {}
  private queue: any = []

  constructor() {
    window.addEventListener('mousemove', (e) => {
      if (this.dragging && this.cloneEl) {
        const { offsetX, offsetY, width, height } = this.initial
        // this.moveFlutter(e.pageX - offsetX, e.pageY - offsetY, this.distance(e))
        this.moveFlutter(e.pageX - width / 2, e.pageY - height / 2, this.distance(e))
      }
    })
    // 鼠标抬起
    window.addEventListener('mouseup', (e: any) => {
      ;(window as any).document.getElementById('app').classList.remove('drag_active')
      const cl = e.target.classList
      if (e.target?.id === 'page-design-canvas' || cl.contains('target') || cl.contains('drop__mask') || cl.contains('edit-text')) {
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
  public start(e: any, finallySize: any) {
    if (!this.cloneEl) {
      store.commit('setDraging', true)
      ;(window as any).document.getElementById('app').classList.add('drag_active') // 整个鼠标全局变成抓取
      // 选中了元素
      this.cloneEl = e.target.cloneNode(true)
      this.cloneEl.classList.add('flutter')
      // 初始化数据
      this.init(e, e.target, finallySize || e.target.offsetWidth, Math.random())
      // 加载原图
      // simulate(cloneEl.src, initial.flag)
      this.cloneEl.style.width = e.target.offsetWidth
      // e.target.parentElement.parentElement.appendChild(this.cloneEl)
      ;(window as any).document.getElementById('widget-panel').appendChild(this.cloneEl)
      this.dragging = true
      e.target.classList.add('hide') // 放在最后
      this.queue.push(() => {
        e.target.classList.remove('hide')
      })
    }
  }
  // 开始拖动初始化
  private init({ offsetX, offsetY, pageX, pageY, x, y }: any, { offsetWidth: width, offsetHeight: height }: any, finallySize: number, flag: any) {
    this.initial = { offsetX, offsetY, pageX, pageY, width, height, finallySize, flag, x, y }
    // store.commit('setDragInitData', { offsetX: 0, offsetY: 0 })
    this.moveFlutter(pageX - offsetX, pageY - offsetY, 0, 0.3)
    setTimeout(() => {
      this.moveFlutter(pageX - width / 2, pageY - height / 2, 0, 0.3)
    }, 10)
  }
  // 改变漂浮元素（合并多个操作）
  private moveFlutter(x: number, y: number, d = 0, lazy = 0) {
    const { width, height, finallySize } = this.initial
    let scale: any = null
    if (width > finallySize) {
      scale = d ? (width - d >= finallySize ? `transform: scale(${(width - d) / width});` : null) : null
    } else scale = d ? (width + d <= finallySize ? `transform: scale(${(width + d) / width})` : null) : null
    const options = [`left: ${x}px`, `top: ${y}px`, `width: ${width}px`, `height: ${height}px`]
    scale && options.push(scale)
    options.push(`transition: all ${lazy}s`)
    this.changeStyle(options)
  }
  private changeStyle(arr: any) {
    const original = this.cloneEl.style.cssText.split(';')
    original.pop()
    this.cloneEl.style.cssText = original.concat(arr).join(';') + ';'
  }
  // 结束/完成处理（动画）
  private finish(done = false) {
    this.dragging = false
    store.commit('setDraging', false)
    store.commit('selectItem', {})
    if (!this.cloneEl) {
      return
    }
    if (!done) {
      const { pageX, offsetX, pageY, offsetY } = this.initial
      this.changeStyle([`left: ${pageX - offsetX}px`, `top: ${pageY - offsetY}px`, 'transform: scale(1)', 'transition: all 0.3s'])
    }
    setTimeout(
      () => {
        this.queue.length && this.queue.shift()()
        this.cloneEl && this.cloneEl.remove()
        this.cloneEl = null
      },
      done ? 0 : 300,
    )
  }
  // 计算两点之间距离
  private distance({ pageX, pageY }: any) {
    const { pageX: x, pageY: y } = this.initial
    return Math.hypot(pageX - x, pageY - y)
  }
}
