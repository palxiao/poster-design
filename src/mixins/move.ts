/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-31 09:31:52
 */
import store from '@/store'

const move = {
  methods: {
    initmovement(e: any) {
      // let target = store.state.pageDesign.dActiveElement
      const target = store.getters.dActiveElement

      // 设置移动状态初始值
      store.dispatch('initDMove', {
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

    handlemousemove(e: any) {
      e.stopPropagation()
      e.preventDefault()

      store.dispatch('dMove', {
        x: e.pageX,
        y: e.pageY,
      })
    },

    handlemouseup() {
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      store.dispatch('stopDMove')
    },
  },
}

const moveInit = {
  methods: {
    initmovement(e: any) {
      if (!store.getters.dAltDown) {
        // 设置mouseevent给moveable初始
        // 在组合操作时排除
        store.commit('setMouseEvent', e)
      }

      const target = store.getters.dActiveElement
      store.dispatch('initDMove', {
        startX: e.pageX,
        startY: e.pageY,
        originX: target.left,
        originY: target.top,
      })

      const handlemouseup = () => {
        // 销毁选中即刻移动
        store.commit('setMouseEvent', null)
        document.removeEventListener('mouseup', handlemouseup, true)
      }
      document.addEventListener('mouseup', handlemouseup, true)
    },
  },
}

export { move, moveInit }
