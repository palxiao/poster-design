/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-10-08 18:27:13
 */
// import { moveByDom, resizeByDom, initLine } from 'view-line'
// import 'view-line/dist/view-line.css'
// let isDraging = false
// const offset = { top: 0, left: 0 }
import store from '@/store'

const move = {
  methods: {
    initmovement(e: any) {
      // let target = this.$store.state.pageDesign.dActiveElement
      const target = this.$store.getters.dActiveElement

      // 设置移动状态初始值
      this.$store.dispatch('initDMove', {
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

    handlemousemove(e) {
      e.stopPropagation()
      e.preventDefault()

      this.$store.dispatch('dMove', {
        x: e.pageX,
        y: e.pageY,
      })
    },

    handlemouseup() {
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      this.$store.dispatch('stopDMove')
    },
  },
}

const moveInit = {
  methods: {
    initmovement(e: any) {
      if (!store.getters.dAltDown) {
        // 设置mouseevent给moveable初始
        // 在组合操作时排除
        this.$store.commit('setMouseEvent', e)
      }

      const target = this.$store.getters.dActiveElement
      this.$store.dispatch('initDMove', {
        startX: e.pageX,
        startY: e.pageY,
        originX: target.left,
        originY: target.top,
      })

      const handlemouseup = () => {
        // 销毁选中即刻移动
        this.$store.commit('setMouseEvent', null)
        document.removeEventListener('mouseup', handlemouseup, true)
      }
      document.addEventListener('mouseup', handlemouseup, true)
    },
  },
}

export { move, moveInit }
