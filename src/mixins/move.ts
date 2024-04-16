/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 19:10:18
 */
import { useControlStore, useWidgetStore } from '@/store'
// import store from '@/store'

const move = {
  methods: {
    initmovement(e: any) {
      // let target = store.state.pageDesign.dActiveElement
      const widgetStore = useWidgetStore()
      const target = widgetStore.dActiveElement
      if (!target) return
      // 设置移动状态初始值
      widgetStore.initDMove({
        startX: e.pageX,
        startY: e.pageY,
        originX: target.left,
        originY: target.top,
      })

      // 绑定鼠标移动事件
      document.addEventListener('mousemove', this.handlemousemove, true)

      // 取消鼠标移动事件
      document.addEventListener('mouseup', this.handlemouseup, true)
    },

    handlemousemove(e: MouseEvent) {
      const widgetStore = useWidgetStore()
      e.stopPropagation()
      e.preventDefault()

      widgetStore.dMove({
        x: e.pageX,
        y: e.pageY,
      })
    },

    handlemouseup() {
      const controlStore = useControlStore()
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      controlStore.stopDMove()
    },
  },
}

const moveInit = {
  methods: {
    initmovement(e: MouseEvent) {
      const controlStore = useControlStore()
      const widgetStore = useWidgetStore()
      if (!controlStore.dAltDown) {
        // 设置mouseevent给moveable初始
        // 在组合操作时排除
        widgetStore.setMouseEvent(e)
      }

      const target = widgetStore.dActiveElement
      if (!target) return
      widgetStore.initDMove({
        startX: e.pageX,
        startY: e.pageY,
        originX: target.left,
        originY: target.top,
      })

      const handlemouseup = () => {
        const widgetStore = useWidgetStore()
        // 销毁选中即刻移
        widgetStore.setMouseEvent(null)
        
        document.removeEventListener('mouseup', handlemouseup, true)
      }
      document.addEventListener('mouseup', handlemouseup, true)
    },
  },
}

export { move, moveInit }
