import { defineStore } from "pinia";

type TControlState = {
  /** 是否正在移动组件 */
  dMoving: boolean 
  /** 是否正在抓取组件 */
  dDraging: boolean
  /** 是否正在调整组件宽高 */
  dResizeing: boolean
  /** 是否显示参考线 */
  dShowRefLine: boolean
  /** 全局控制选择框的显示 */
  showMoveable: boolean
  /** 是否显示moveable的旋转按钮 */
  showRotatable: boolean
}

type TControlAction = {
  setdMoving: (isMoving: boolean) => void
  setDraging: (isDraging: boolean) => void
  setdResizeing: (isResizing: boolean) => void
  showRefLine: (isRefLine: boolean) => void
  setShowMoveable: (isShowMoveable: boolean) => void
  setShowRotatable: (isShowRotatable: boolean) => void
}

export default defineStore<"controlStore", TControlState, {}, TControlAction>("controlStore", {
  state: () => ({
    dMoving: false, // 是否正在移动组件
    dDraging: false, // 是否正在抓取组件
    dResizeing: false, // 是否正在调整组件宽高
    dShowRefLine: true, // 是否显示参考线
    showMoveable: false, // 全局控制选择框的显示
    showRotatable: true, // 是否显示moveable的旋转按钮
  }),
  getters: {},
  actions: {
    setdMoving(bool: boolean) {
      this.dMoving = bool
    },
    setDraging(drag: boolean) {
      this.dDraging = drag
    },
    setdResizeing(bool: boolean) {
      this.dResizeing = bool
    },
    showRefLine(show: boolean) {
      this.dShowRefLine = show
    },
    setShowMoveable(show: boolean) {
      this.showMoveable = show
      // if (!show) {
      //   // TODO: 失焦时设置面板也失去关联，但会导致某些失焦状态出错(如裁剪)
      //   state.dActiveElement = state.dPage
      // }
    },
    setShowRotatable(e: boolean) {
      this.showRotatable = e
    },
  }
})