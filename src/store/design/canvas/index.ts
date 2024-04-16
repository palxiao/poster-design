
/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: 画布全局配置
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 12:16:25
 */

import { Store, defineStore } from 'pinia'
import { TCanvasState, TScreeData, TGuidelinesData, TStoreAction, TPageState } from './d'
import { useWidgetStore } from "@/store";
import pageDefault from './page-default';

/** 画布全局设置 */
const CanvasStore = defineStore<"canvasStore", TCanvasState, {}, TStoreAction>("canvasStore", {
  state: () => ({
    dZoom: 0, // 画布缩放百分比
    dPresetPadding: 25, // 画布默认预留边距
    dBottomHeight: 0, // 画布底部工具栏高度
    dPaddingTop: 0, // 用于画布垂直居中的修正值
    dScreen: {
      width: 0, // 记录编辑界面的宽度
      height: 0, // 记录编辑界面的高度
    },
    guidelines: {
      // moveable 标尺辅助线
      verticalGuidelines: [],
      horizontalGuidelines: [],
    },
    dCurrentPage: 0,
    dPage: pageDefault
  }),
  getters: {
    getDPage() {
      const widgetStore = useWidgetStore()
      return widgetStore.dLayouts[this.dCurrentPage].global
    },
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
    /** 更新 Page 字段 */
    updatePageData({ key, value, pushHistory }) {
      const data = this.dPage
      if (data[key] !== value || pushHistory) {
        data[key] = value
      }
    },
    /** 设置 Page */
    setDPage(data: TPageState) {
      this.dPage = data
      this.updateDPage()
      // const cur = this.dPage
      // const keys = Object.keys(data) as (keyof TPageState)[];
      // keys.forEach(val => {
      //   cur[val] = data[val]
      // })
    },
    /** 更新 Page（layouts）*/
    updateDPage() {
      const widgetStore = useWidgetStore()
      widgetStore.dLayouts[this.dCurrentPage].global = this.dPage
      // const cur = this.dPage
      // const keys = Object.keys(data) as (keyof TPageState)[];
      // keys.forEach(val => {
      //   cur[val] = data[val]
      // })
    },
    /** 设置底部工具栏高度 */
    setBottomHeight(h: number) {
      this.dBottomHeight = h
    }
  }
})

export type TCanvasStore = Store<"canvasStore", TCanvasState, {}, TStoreAction>

export default CanvasStore
