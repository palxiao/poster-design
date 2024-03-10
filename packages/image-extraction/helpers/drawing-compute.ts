import { DRAW_INTERPOLATION_RADIUS_THRESHOLD, DRAW_INTERPOLATION_STEP_BASE } from '../constants'
import { MouseMovements } from '../types/common'
import { ComputedMovements, InImageRangeConfig, InterpolationStep, RenderInterpolationConfig } from '../types/drawing'

const { sign, abs, max } = Math

/** 判断坐标位置是否在绘制的图像的范围内 */
export function isInImageRange(inRangeConfig: InImageRangeConfig): boolean {
  const { x, y, minX, maxX, minY, maxY } = inRangeConfig
  return x >= minX && x <= maxX && y >= minY && y <= maxY
}

/** 计算x/y轴方向移动距离及水平/垂直方向上的最大移动距离 */
export function computeMovements(movements: MouseMovements): ComputedMovements {
  const { movementX, movementY } = movements
  const unsignedMovementX = abs(movementX)
  const unsignedMovementY = abs(movementY)
  const maxMovement = max(unsignedMovementX, unsignedMovementY)
  return { unsignedMovementX, unsignedMovementY, maxMovement }
}

/** 是否需要插值渲染 */
export function needDrawInterpolation(maxMovement: number, radius: number): boolean {
  return radius > DRAW_INTERPOLATION_RADIUS_THRESHOLD && maxMovement > radius / DRAW_INTERPOLATION_STEP_BASE
}

/** 计算插值的步长 */
export function computeInterpolationStep(interpolationConfig: RenderInterpolationConfig): InterpolationStep {
  const { drawingConfig, unsignedMovementX, unsignedMovementY, maxMovement } = interpolationConfig
  const { movementX, movementY, stepBase } = drawingConfig
  const rawStepX = computePivotRawStep(movementX, stepBase)
  const rawStepY = computePivotRawStep(movementY, stepBase)
  const movementXIsMaximum = isMaxMovement(unsignedMovementX, maxMovement)
  const stepX = computePivotStep(movementXIsMaximum, rawStepX, unsignedMovementX, unsignedMovementY)
  const stepY = computePivotStep(!movementXIsMaximum, rawStepY, unsignedMovementY, unsignedMovementX)
  return { stepX, stepY }
}

/** 计算x/y轴方向上朝上一次鼠标指针位置的插值步长 */
function computePivotRawStep(pivotMovement: number, stepBase: number) {
  return -sign(pivotMovement) * stepBase
}

/** 是否为最大移动距离 */
function isMaxMovement(pivotMovement: number, maxMovement: number) {
  return pivotMovement === maxMovement
}

/** 计算x/y轴方向的累加步长 */
function computePivotStep(isMaxMovement: boolean, rawStepOfPivot: number, unsignedPivotMovement: number, unsignedCrossedMovement: number) {
  return isMaxMovement ? rawStepOfPivot : (unsignedPivotMovement / unsignedCrossedMovement) * rawStepOfPivot
}

/** 判断是否需要绘制插值圆点 */
export function needDrawInterpolationPoint(movement: number, moved: number, step: number) {
  return movement - moved > step
}
