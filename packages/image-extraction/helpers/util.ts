/*
 * @Author: ShawnPhang
 * @Date: 2023-10-05 16:33:07
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-08 11:10:19
 */
import { DRAWING_STEP_BASE, DRAWING_STEP_BASE_BASE, MIN_RADIUS } from '../constants'
import { RectSize, TransformConfig } from '../types/common'

const { sqrt, max } = Math

export function fixed(num: number): number {
  return num | 0
}
// 比Math.hypot(x,y)快一些(在数量级较大的情况下)
export function getRawDistance(xDistance: number, yDistance: number): number {
  return sqrt(xDistance ** 2 + yDistance ** 2)
}

/** 计算插值绘制的间隔步长 */
export function computeStepBase(radius: number) {
  return radius / DRAWING_STEP_BASE_BASE
}

/** 计算真实(相对真实，如果图像分辨率会控制在2K以内以保证性能)尺寸的画笔绘制点的半径 */
export function computeRealRadius(rawRadius: number, scaleRatio: number) {
  return max(MIN_RADIUS, rawRadius) / scaleRatio
}

/** 计算移动绘制的节流步长 */
export function computeStep(radius: number) {
  return radius / DRAWING_STEP_BASE
}

/** 基于新的缩放比例计算新的绘制范围 */
export function computeNewTransformConfigByScaleRatio(transformConfig: TransformConfig, pictureSize: RectSize, scaleRatio: number): TransformConfig {
  const { minX, minY } = transformConfig.positionRange
  const { width, height } = pictureSize
  const maxX = minX + width * scaleRatio
  const maxY = minY + height * scaleRatio
  return { positionRange: { minX, maxX, minY, maxY }, scaleRatio }
}

/** 获取图片缩放到画框区域内的实际尺寸 */
export function computeScaledImageSize(imageSize: RectSize, scaleRatio: number): RectSize {
  return {
    width: imageSize.width * scaleRatio,
    height: imageSize.height * scaleRatio,
  }
}
