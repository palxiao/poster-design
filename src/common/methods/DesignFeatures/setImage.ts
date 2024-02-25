/*
 * @Author: ShawnPhang
 * @Date: 2022-02-22 15:06:14
 * @Description: 设置图片类型元素
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-01-11 17:36:44
 */
import store from '@/store'
import { getImage } from '../getImgDetail'
export default async function setItem2Data(item: any) {
  const cloneItem = JSON.parse(JSON.stringify(item))
  const { width: screenWidth, height: screenHeight } = store.getters.dPage
  let { width: imgWidth, height: imgHeight } = item
  if (!imgWidth || !imgHeight) {
    const actual: any = await getImage(item.url)
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
