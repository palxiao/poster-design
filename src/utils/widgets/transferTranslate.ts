/*
 * @Description: transform 工具
 * @Author: xi_zi
 * @Date: 2024-04-03 15:17:57
 * @LastEditTime: 2024-04-03 23:11:53
 * @LastEditors: xi_zi
 */
import { TdWidgetData } from "@/store/design/widget";

/**
 * 兼容旧版 top left 数据
 * @param widgetData 
 * @returns 
 */
export const transferTransformWidgets = (widgetData: TdWidgetData[]): TdWidgetData[] => {
  return widgetData.map(data => transferTransformWidget(data))
}

/**
 * 兼容旧版 top left 数据
 * @param data 
 * @returns 
 */
export const transferTransformWidget = (data: TdWidgetData): TdWidgetData => {
  const resData = { ...data }
  const { left, top, transform, } = resData
  console.log(data, 'widgetTransformStyle')
  if (left !== undefined || top !== undefined) {
    const regex = /translate\([^)]*\)/g
    resData.transform = `translate(${left ?? 0}px, ${top ?? 0}px) ${(transform ?? '').replace(regex, '')}`
    delete resData.left;
    delete resData.top
  } else if (transform?.includes('translate')) {
    resData.transform = transform
  }
  console.log(resData, 'widgetTransformStyle==end')
  return resData
}

/**
 * 将transform中的translate移除
 * @param transform 
 * @returns 
 */
export const removeTranslate = (transform: string = '') => `${(transform ?? '').replace(/translate\([^)]*\)/g, '')}`

/**
 * 获取transform中的translate
 * @param transform 
 * @returns 
 */
export const getOffsetFromTransform = (transform: string = '') => {
  const res = { x: 0, y: 0 }
  const regex = /translate\((-?\d+(\.\d+)?)(px)?,\s*(-?\d+(\.\d+)?)(px)?\)/g
  transform.replace(regex, (_match, x, _1, _2, y) => {
    res.x = parseFloat(x ?? 0)
    res.y = parseFloat(y ?? 0)
    return ''
  });
  return res
}