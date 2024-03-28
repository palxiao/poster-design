
/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: 画布全局配置
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-18 21:00:00
 */

import { Store, defineStore } from 'pinia'

type TScreeData = {
  /** 记录编辑界面的宽度 */
  width: number
  /** 记录编辑界面的高度 */
  height: number
}

type TGuidelinesData = {
  verticalGuidelines: number[]
  horizontalGuidelines: number[]
}

type TCanvasState = {
  /** 画布缩放百分比 */
  dZoom: number
  /** 画布垂直居中修正值 */
  dPaddingTop: number
  /** 编辑界面 */
  dScreen: TScreeData
  /** 标尺辅助线 */
  guidelines: TGuidelinesData
}

type TStoreGetter = {
  dZoom: (state: TCanvasState) => number
  dPaddingTop: (state: TCanvasState) => number
  dScreen: (state: TCanvasState) => TScreeData
  guidelines: (state: TCanvasState) => TGuidelinesData
}

type TStoreAction = {
  /** 更新画布缩放百分比 */
  updateZoom: (zoom: number) => void
  /** 更新画布垂直居中修正值 */
  updatePaddingTop: (num: number) => void
  /** 更新编辑界面的宽高 */
  updateScreen: (data: TScreeData) => void
  /** 修改标尺线 */
  updateGuidelines: (lines: TGuidelinesData) => void
  /** 强制重绘画布 */
  reChangeCanvas: () => void
}

/** 画布全局设置 */
const CanvasStore = defineStore<"canvasStore", TCanvasState, TStoreGetter, TStoreAction>("canvasStore", {
  state: () => ({
    dZoom: 0, // 画布缩放百分比
    dPaddingTop: 0, // 画布垂直居中修正值
    dScreen: {
      width: 0, // 记录编辑界面的宽度
      height: 0, // 记录编辑界面的高度
    },
    // gridSize: {
    //   width: 0, // 网格小格子的宽度
    //   height: 0, // 网格小格子的高度
    // },
    guidelines: {
      // moveable 标尺辅助线
      verticalGuidelines: [],
      horizontalGuidelines: [],
    },
  }),
  getters: {
    dZoom: state => state.dZoom,
    dPaddingTop: state => state.dPaddingTop,
    dScreen: state => state.dScreen,
    guidelines: state => state.guidelines
  },
  actions: {
    /** 更新画布缩放百分比 */
    updateZoom(zoom: number) {
      this.dZoom = zoom
    },
    /** 更新画布垂直居中修正值 */
    updatePaddingTop(num: number) {
      this.dPaddingTop = num
    },
    /** 更新编辑界面的宽高 */
    updateScreen({ width, height }: TScreeData) {
      this.dScreen.width = width
      this.dScreen.height = height
    },
    /** 修改标尺线 */
    updateGuidelines(lines: TGuidelinesData) {
      this.guidelines = { ...this.guidelines, ...lines }
    },
    /** 强制重绘画布 */
    reChangeCanvas() {
      // const tag = this.dPage.tag
      // this.dPage.tag = tag === 0 ? 0.01 : 0
    },
  }
})

export type TCanvasStore = Store<"canvasStore", TCanvasState, TStoreGetter, TStoreAction>

export default CanvasStore
