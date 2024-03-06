/*
 * @Author: ShawnPhang
 * @Date: 2022-02-22 15:06:14
 * @Description: 设置图片类型元素
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-01 20:55:51
 */
import store from '@/store'
import { getImage } from '../getImgDetail'

export type TItem2DataParam = {
  width: number
  height: number
  url: string
  model?: string
  canvasWidth?: number
}

export type TItem2DataResult = {
  width: number
  height: number
  canvasWidth: number
}

export default async function setItem2Data(item: TItem2DataParam): Promise<Required<TItem2DataParam>> {
  const cloneItem = JSON.parse(JSON.stringify(item))
  const { width: screenWidth, height: screenHeight } = store.getters.dPage
  let { width: imgWidth, height: imgHeight } = item
  if (!imgWidth || !imgHeight) {
    const actual = await getImage(item.url)
    cloneItem.width = imgWidth = actual.width
    cloneItem.height = imgHeight = actual.height
  }
  let ratio = 1
  // 先限制在画布内，保证不超过边界
  if (imgWidth > screenWidth || imgHeight > screenHeight) {
    ratio = Math.min(screenWidth / imgWidth, screenHeight / imgHeight)
  }
  // 根据画布缩放比例再进行一次调整
  if (ratio < 1) {
    cloneItem.width = cloneItem.width * ratio * (store.getters.dZoom / 100)
    cloneItem.height = cloneItem.height * ratio * (store.getters.dZoom / 100)
  }

  cloneItem.canvasWidth = cloneItem.width * (store.getters.dZoom / 100)
  // cloneItem.canvasHeight = cloneItem.height * (store.getters.dZoom / 100)
  return cloneItem
}
