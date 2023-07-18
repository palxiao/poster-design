/*
 * @Author: ShawnPhang
 * @Date: 2022-02-22 15:06:14
 * @Description: 设置图片类型元素
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-07 14:57:51
 */
import store from '@/store'
export default async function setCompData(item: any) {
  const group = typeof item === 'string' ? JSON.parse(item) : JSON.parse(JSON.stringify(item))
  let parent: any = {}
  Array.isArray(group) &&
    group.forEach((element: any) => {
      element.type === 'w-group' && (parent = element)
    })
  const { width: screenWidth, height: screenHeight } = store.getters.dPage
  const { width: imgWidth, height: imgHeight } = parent
  let ratio = 1
  // 先限制在画布内，保证不超过边界
  if (imgWidth > screenWidth || imgHeight > screenHeight) {
    ratio = Math.min(screenWidth / imgWidth, screenHeight / imgHeight)
  }
  // 根据画布缩放比例再进行一次调整
  if (ratio < 1) {
    ratio *= store.getters.dZoom / 100
    group.forEach((element: any) => {
      element.fontSize && (element.fontSize *= ratio)
      element.width *= ratio
      element.height *= ratio
      element.left *= ratio
      element.top *= ratio
    })
  }
  return group
}
