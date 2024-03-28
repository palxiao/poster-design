
/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description:
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-18 21:00:00
 */

import { Store, defineStore } from "pinia";

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
  /** 记录是否按下alt键 / 或ctrl */
  dAltDown: boolean
}

type TControlAction = {
  setdMoving: (isMoving: boolean) => void
  setDraging: (isDraging: boolean) => void
  setdResizeing: (isResizing: boolean) => void
  showRefLine: (isRefLine: boolean) => void
  setShowMoveable: (isShowMoveable: boolean) => void
  setShowRotatable: (isShowRotatable: boolean) => void
  updateAltDown: (isPressAltDown: boolean) => void
}

/** 全局控制配置 */
const ControlStore =  defineStore<"controlStore", TControlState, {}, TControlAction>("controlStore", {
  state: () => ({
    dMoving: false, // 是否正在移动组件
    dDraging: false, // 是否正在抓取组件
    dResizeing: false, // 是否正在调整组件宽高
    dShowRefLine: true, // 是否显示参考线
    showMoveable: false, // 全局控制选择框的显示
    showRotatable: true, // 是否显示moveable的旋转按钮
    dAltDown: false, // 记录是否按下alt键 / 或ctrl
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
    /** TODO 组合操作 */
    updateAltDown(e: boolean) {
      this.dAltDown = e
      console.log('控制组合按键, 成组功能为: realCombined')
    }
  }
})

export type TControlStore = Store<"controlStore", TControlState, {}, TControlAction>

export default ControlStore
