/*
 * @Author: ShawnPhang
 * @Date: 2023-10-05 16:33:07
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-08 11:09:59
 */
import { HIDDEN_BOARD_GAP_SIZE, HIDDEN_BOARD_MAX_SIZE, INITIAL_SCALE_RATIO } from '../constants'
import { BoardRect, GapSize, RectSize } from '../types/common'
import { TransformParameters, TransformParametersConfig } from '../types/init-matting'
import { computeScaledImageSize, fixed } from './util'

/** 计算画板的左上角坐标及宽高 */
export function computeBoardRect(canvas: HTMLCanvasElement): BoardRect {
  const inputBoardRect: DOMRect = canvas.getBoundingClientRect()
  const domRect: DOMRect = document.documentElement.getBoundingClientRect()
  return computeBoardRectSize(inputBoardRect, domRect)
}

export function computeBoardRectSize(inputBoardRect: DOMRect, domRect: DOMRect) {
  const { width, height, left: boardLeft, top: boardTop } = inputBoardRect
  const { left: domLeft, top: domTop } = domRect
  const left = boardLeft - domLeft
  const top = boardTop - domTop
  return { left, top, width, height }
}

/** 计合法的图片尺寸(低于2k分辨率的尺寸) */
export function computeValidImageSize(imageSource: ImageBitmap): RectSize {
  let { width, height } = imageSource
  const imageScaleRatio = computeScaleRatio({
    imageSize: { width, height },
    gapSize: HIDDEN_BOARD_GAP_SIZE,
    targetSize: HIDDEN_BOARD_MAX_SIZE,
  })
  width *= imageScaleRatio
  height *= imageScaleRatio
  return { width, height }
}

/** 计算自适应缩放比例 */
export function computeScaleRatio(transformParametersConfig: TransformParametersConfig): number {
  const { imageSize, gapSize, targetSize } = transformParametersConfig
  const drawingAreaSize = getDrawingAreaSize(targetSize, gapSize)
  return Math.min(Math.min(drawingAreaSize.width / imageSize.width, drawingAreaSize.height / imageSize.height), INITIAL_SCALE_RATIO)
}

/** 默认最大绘制区的尺寸(即画框尺寸减去间隙) */
export function getDrawingAreaSize(boardSize: RectSize, gapSize: GapSize): RectSize {
  return {
    width: boardSize.width - gapSize.horizontal * 2,
    height: boardSize.height - gapSize.vertical * 2,
  }
}

/** 计算自适应变换(缩放、平移)参数 */
export function computeTransformParameters(transformParametersConfig: TransformParametersConfig): TransformParameters {
  const scaleRatio = computeScaleRatio(transformParametersConfig)
  const positionRange = computePositionRange(transformParametersConfig, scaleRatio)
  return { scaleRatio, positionRange }
}

/** 计算自适应变换后的绘制区域 */
function computePositionRange(transformParametersConfig: TransformParametersConfig, scaleRatio: number) {
  const scaledImageSize = computeScaledImageSize(transformParametersConfig.imageSize, scaleRatio)
  return {
    minX: getPositionRangeMinX(transformParametersConfig, scaledImageSize),
    maxX: getPositionRangeMaxX(transformParametersConfig, scaledImageSize),
    minY: getPositionRangeMinY(transformParametersConfig, scaledImageSize),
    maxY: getPositionRangeMaxY(transformParametersConfig, scaledImageSize),
  }
}

/** 计算绘制区域范围最小x坐标(相对于画布左上角) */
function getPositionRangeMinX(transformParametersConfig: TransformParametersConfig, scaledImageSize: RectSize) {
  const { gapSize, targetSize } = transformParametersConfig
  return fixed((getDrawingAreaSize(targetSize, gapSize).width - scaledImageSize.width) / 2) + gapSize.horizontal
}

function getPositionRangeMinY(transformParametersConfig: TransformParametersConfig, scaledImageSize: RectSize) {
  const { gapSize, targetSize } = transformParametersConfig
  return fixed((getDrawingAreaSize(targetSize, gapSize).height - scaledImageSize.height) / 2) + gapSize.vertical
}

function getPositionRangeMaxX(transformParametersConfig: TransformParametersConfig, scaledImageSize: RectSize) {
  return fixed(getPositionRangeMinX(transformParametersConfig, scaledImageSize) + scaledImageSize.width)
}

function getPositionRangeMaxY(transformParametersConfig: TransformParametersConfig, scaledImageSize: RectSize) {
  return fixed(getPositionRangeMinY(transformParametersConfig, scaledImageSize) + scaledImageSize.height)
}

export const computeHelpers = {
  computeBoardRect,
  computeTransformParameters,
  computeScaleRatio,
  computeValidImageSize,
  computePositionRange,
  getPositionRangeMinX,
  getPositionRangeMaxX,
  getPositionRangeMinY,
  getPositionRangeMaxY,
}
