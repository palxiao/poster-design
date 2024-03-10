import { ZOOM_OUT_COEFFICIENT, ZOOM_IN_COEFFICIENT, SCALE_STEP, MIN_SCALE_RATIO, MAX_SCALE_RATIO } from '../constants'
import { PixelPosition, PositionRange, TransformConfig } from '../types/common'
import { GenerateRangeOffsetConfig, InitMattingTransformConfig } from '../types/transform'
import { computeHelpers } from './init-compute'

const { sign } = Math

/** 生成表示绘制范围各个值偏移量的对象 */
export function generateRangeOffset(rangeOffsetConfig: GenerateRangeOffsetConfig): PositionRange {
  const { pageX, pageY, positionRange } = rangeOffsetConfig
  const { minX, maxX, minY, maxY } = positionRange
  return { minX: minX - pageX, maxX: maxX - pageX, minY: minY - pageY, maxY: maxY - pageY }
}

/** 根据当前鼠标位置更新绘制范围 */
export function updateRangeByMovements(ev: MouseEvent, positionRange: PositionRange) {
  const { movementX: deltaX, movementY: deltaY } = ev
  positionRange.minX += deltaX
  positionRange.maxX += deltaX
  positionRange.minY += deltaY
  positionRange.maxY += deltaY
}

/** 变换(平移、缩放)时重绘画板中图像 */
export function redrawMattingBoardsWhileScaling(ev: WheelEvent, scalingConfig: InitMattingTransformConfig) {
  const { transformConfig, inputContexts: inputContext, outputContexts: outputContext } = scalingConfig
  updateTransformConfigWhileScaling(ev, transformConfig)
}

/** 鼠标滚轮滚动缩放时更新变换参数 */
function updateTransformConfigWhileScaling(ev: WheelEvent, transformConfig: TransformConfig) {
  const { deltaY, pageX, pageY, target } = ev
  const { positionRange, scaleRatio } = transformConfig
  const { left, top } = computeHelpers.computeBoardRect(target as HTMLCanvasElement)
  const x = transformHelpers.computePivot(pageX, left)
  const y = transformHelpers.computePivot(pageY, top)
  const deltaRatio = transformHelpers.computeDeltaRatio(deltaY)
  const targetScaleRatio = transformHelpers.computeNewScaleRatio(scaleRatio, deltaRatio)
  transformConfig.scaleRatio = transformHelpers.computeClampedTargetScaleRatio(targetScaleRatio)
  // 不能直接使用deltaRatio，scaleRatio接近最大/最小值时，二者就不相等了。
  const rangeScaleRatio = computeRangeScaleRatio(transformConfig.scaleRatio, scaleRatio)
  transformConfig.positionRange = transformHelpers.computeNewPositionRange(positionRange, { x, y }, rangeScaleRatio)
}

/** 计算鼠标的位置对应的像素在图像中的位置 */
function computePivot(pagePivot: number, leftOrTop: number) {
  return pagePivot - leftOrTop
}

/** 计算变化比率 */
function computeDeltaRatio(deltaY: number) {
  const scaleCoefficient = transformHelpers.isZoomOut(deltaY) ? ZOOM_OUT_COEFFICIENT : ZOOM_IN_COEFFICIENT
  return scaleCoefficient * SCALE_STEP
}

/** 是否为缩小 */
function isZoomOut(deltaY: number): boolean {
  return -sign(deltaY) === ZOOM_OUT_COEFFICIENT
}

/** 计算新的缩放比率 */
function computeNewScaleRatio(scaleRatio: number, deltaRatio: number): number {
  return scaleRatio + scaleRatio * deltaRatio
}

/** 计算绘制范围的变化比率 */
function computeRangeScaleRatio(newRatio: number, oldRatio: number): number {
  return (newRatio - oldRatio) / oldRatio
}

/** 夹住缩放比例使其不会超出范围 */
function computeClampedTargetScaleRatio(scaleRatio: number): number {
  return scaleRatio < MIN_SCALE_RATIO ? MIN_SCALE_RATIO : scaleRatio > MAX_SCALE_RATIO ? MAX_SCALE_RATIO : scaleRatio
}

/** 计算新的绘制范围 */
function computeNewPositionRange(positionRange: PositionRange, position: PixelPosition, deltaRatio: number): PositionRange {
  const { x, y } = position
  let { minX, maxX, minY, maxY } = positionRange
  minX = transformHelpers.computeNewSingleRange(minX, x, deltaRatio)
  maxX = transformHelpers.computeNewSingleRange(maxX, x, deltaRatio)
  minY = transformHelpers.computeNewSingleRange(minY, y, deltaRatio)
  maxY = transformHelpers.computeNewSingleRange(maxY, y, deltaRatio)
  return { minX, maxX, minY, maxY }
}

/** 计算缩放后x/y轴方向的新的绘制范围值 */
function computeNewSingleRange(singleRange: number, pivot: number, deltaRatio: number): number {
  const vectorDistance = singleRange - pivot
  const deltaRange = vectorDistance * deltaRatio
  return singleRange + deltaRange
}

export const transformHelpers = {
  updateTransformConfigWhileScaling,
  computePivot,
  computeDeltaRatio,
  isZoomOut,
  computeNewScaleRatio,
  computeClampedTargetScaleRatio,
  computeNewPositionRange,
  computeNewSingleRange,
}
