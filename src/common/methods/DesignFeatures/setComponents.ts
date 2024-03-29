/*
 * @Author: ShawnPhang
 * @Date: 2022-02-22 15:06:14
 * @Description: 设置图片类型元素
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-02 11:50:00
 */
import { useCanvasStore, usePageStore } from '@/pinia'
import { TdWidgetData } from '@/pinia/design/widget'
// import store from '@/store'

export default async function setCompData(item: TdWidgetData[] | string) {
  const canvasStore = useCanvasStore()
  const pageStore = usePageStore()
  const group: TdWidgetData[] = typeof item === 'string' ? JSON.parse(item) : JSON.parse(JSON.stringify(item))
  let parent: Partial<TdWidgetData> = {}
  Array.isArray(group) &&
    group.forEach((element) => {
      element.type === 'w-group' && (parent = element)
    })
  const { width: screenWidth, height: screenHeight } = pageStore.dPage
  const { width: imgWidth = 0, height: imgHeight = 0 } = parent
  let ratio = 1
  // 先限制在画布内，保证不超过边界
  if (imgWidth > screenWidth || imgHeight > screenHeight) {
    ratio = Math.min(screenWidth / imgWidth, screenHeight / imgHeight)
  }
  // 根据画布缩放比例再进行一次调整
  if (ratio < 1) {
    ratio *= canvasStore.dZoom / 100
    group.forEach((element) => {
      element.fontSize && (element.fontSize *= ratio)
      element.width *= ratio
      element.height *= ratio
      element.left *= ratio
      element.top *= ratio
    })
  }
  return group
}
