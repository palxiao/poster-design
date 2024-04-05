
/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: 画布全局配置
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-05 14:52:06
 */

import { Store, defineStore } from 'pinia'
import { TCanvasState, TScreeData, TGuidelinesData, TStoreAction, TPageState } from './d'

/** 画布全局设置 */
const CanvasStore = defineStore<"canvasStore", TCanvasState, {}, TStoreAction>("canvasStore", {
  state: () => ({
    dZoom: 0, // 画布缩放百分比
    dPaddingTop: 0, // 画布垂直居中修正值
    dScreen: {
      width: 0, // 记录编辑界面的宽度
      height: 0, // 记录编辑界面的高度
    },
    guidelines: {
      // moveable 标尺辅助线
      verticalGuidelines: [],
      horizontalGuidelines: [],
    },
    dPage: {
      name: '背景页面',
      type: 'page',
      uuid: '-1',
      left: 0,
      top: 0,
      width: 1920, // 画布宽度
      height: 1080, // 画布高度
      backgroundColor: '#ffffff', // 画布背景颜色
      backgroundGradient: '', // 用于兼容渐变颜色
      backgroundImage: '', // 画布背景图片
      backgroundTransform: {},
      opacity: 1, // 透明度
      tag: 0, // 强制刷新用
      setting: [
        {
          label: '背景颜色',
          parentKey: 'backgroundColor',
          value: false,
        },
      ],
      record: {},
    }
  }),
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
      const cur = this.dPage
      const keys = Object.keys(data) as (keyof TPageState)[];
      keys.forEach(val => {
        cur[val] = data[val]
      })
    }
  }
})

export type TCanvasStore = Store<"canvasStore", TCanvasState, {}, TStoreAction>

export default CanvasStore
