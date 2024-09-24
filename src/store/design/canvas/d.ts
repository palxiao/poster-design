/*
 * @Author: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-04-05 06:23:23
 * @Description:  
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-09-25 00:39:00
 */
export type TScreeData = {
  /** 记录编辑界面的宽度 */
  width: number
  /** 记录编辑界面的高度 */
  height: number
}

export type TGuidelinesData = {
  verticalGuidelines: number[]
  horizontalGuidelines: number[]
}

export type TCanvasState = {
  /** 画布缩放百分比 */
  dZoom: number
  /** 画布默认预留边距 */
  dPresetPadding: number,
  /** 画布底部工具栏高度 */
  dBottomHeight: number,
  /** 画布垂直居中修正值 */
  dPaddingTop: number
  /** 编辑界面 */
  dScreen: TScreeData
  /** 标尺辅助线 */
  guidelines: TGuidelinesData
  /** 页面数据 */
  dPage: TPageState
  /** 当前页面下标 */
  dCurrentPage: number
}

export type TStoreAction = {
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
  /** 更新Page数据 */
  updatePageData<T extends keyof TPageState>(data: {
    key: T
    value: TPageState[T]
    // pushHistory?: boolean
  }): void
  getDPage(data: TPageState): TPageState
  /** 设置dPage */
  setDPage(data: TPageState): void
  /** 更新 Page（从layouts获取）*/
  updateDPage(): void
  /** 设置底部工具栏高度 */
  setBottomHeight(h: number): void
  /** 更新当前页面下标 */
  setDCurrentPage(n: number): void
}

export type TPageState = {
  name: string
  type: string
  uuid: string
  left: number
  top: number
  /** 画布宽度 */
  width: number
  /** 画布高度 */
  height: number
  /** 画布背景颜色 */
  backgroundColor: string
  /** 画布背景颜色(兼容渐变色) */
  backgroundGradient: string,
  /** 画布背景图片 */
  backgroundImage: string
  backgroundTransform: {
    x?: number
    y?: number
  }
  /** 透明度 */
  opacity: number
  /** 强制刷新用 */
  tag: number
}

