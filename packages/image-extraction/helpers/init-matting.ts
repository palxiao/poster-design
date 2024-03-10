/*
 * @Author: ShawnPhang
 * @Date: 2023-10-05 16:33:07
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-08 11:10:05
 */
import { DEFAULT_IMAGE_SMOOTH_CHOICE, INITIAL_GAP_SIZE } from '../constants'
import { TransformConfig } from '../types/common'
import { ComputeTransformConfigConfig, GenerateMaskSourceConfig, GetValidTransformParametersConfig, InitMattingConfig, InitMattingResult } from '../types/init-matting'
import { getLoadedImage, initHiddenBoard, initHiddenBoardWithSource, transformedDrawImage } from './dom-helper'
import { computeTransformParameters, computeValidImageSize } from './init-compute'
import { initMaskRenderer } from './mask-renderer'

export async function initMatting(initMattingConfig: InitMattingConfig): Promise<InitMattingResult> {
  const {
    boardContexts: { inputCtx, outputCtx, inputHiddenCtx, inputDrawingCtx, outputHiddenCtx, outputDrawingCtx },
    picFile,
    transformConfig,
    targetSize,
    gapSize,
  } = initMattingConfig
  // hideCanvas(inputContext2D, outputContext2D);
  ;(inputCtx.value as CanvasRenderingContext2D).imageSmoothingEnabled = DEFAULT_IMAGE_SMOOTH_CHOICE
  ;(outputCtx.value as CanvasRenderingContext2D).imageSmoothingEnabled = DEFAULT_IMAGE_SMOOTH_CHOICE
  const imageSource = await getLoadedImage(picFile)
  const { scaleRatio, positionRange } = getValidTransformConfig({ imageSource, transformConfig, targetSize, gapSize })
  const validImageSize = computeValidImageSize(imageSource)
  initHiddenBoardWithSource({
    imageSource,
    targetSize: validImageSize,
    hiddenCtx: inputHiddenCtx.value,
    drawingCtx: inputDrawingCtx,
  })
  transformedDrawImage({
    hiddenCtx: inputHiddenCtx.value,
    ctx: inputCtx.value as CanvasRenderingContext2D,
    scaleRatio,
    positionRange,
  })
  initHiddenBoard({
    targetSize: validImageSize,
    hiddenCtx: outputHiddenCtx.value,
    drawingCtx: outputDrawingCtx,
  })

  const raw = await createImageBitmap(inputHiddenCtx.value.canvas)
  const mask = await generateMaskImageSource({ targetSize: validImageSize, imageSource })
  return { orig: imageSource, raw, mask, positionRange, scaleRatio }
}

/** 生成蒙版后的图像资源 */
function generateMaskImageSource(config: GenerateMaskSourceConfig): Promise<ImageBitmap> {
  const {
    targetSize: { width, height },
    imageSource,
  } = config
  const cvs = document.createElement('canvas')
  cvs.width = width
  cvs.height = height
  const render = initMaskRenderer(cvs)
  if (render) {
    render(imageSource)
  }
  return createImageBitmap(cvs)
}

/** 获取有效的变换配置 */
function getValidTransformConfig(getParametersConfig: GetValidTransformParametersConfig): TransformConfig {
  const { transformConfig, ...computeConfig } = getParametersConfig
  if (isInvalidTransformConfig(transformConfig)) {
    const { scaleRatio, positionRange } = computeTransformConfig(computeConfig)
    transformConfig.scaleRatio = scaleRatio
    transformConfig.positionRange = positionRange
  }
  return transformConfig as TransformConfig
}

/** 判断变换配置是否无效 */
function isInvalidTransformConfig(transformConfig: Partial<TransformConfig>) {
  const { scaleRatio, positionRange } = transformConfig
  return !scaleRatio || !positionRange
}

/** 计算画板的变换配置对象 */
function computeTransformConfig(computeConfig: ComputeTransformConfigConfig): TransformConfig {
  const { imageSource, targetSize, gapSize = INITIAL_GAP_SIZE } = computeConfig
  const imageSize = computeValidImageSize(imageSource)
  return computeTransformParameters({
    gapSize,
    imageSize,
    targetSize,
  })
}
