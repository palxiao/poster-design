import { DEFAULT_IMAGE_SMOOTH_CHOICE, GLOBAL_COMPOSITE_OPERATION_DESTINATION_IN, GRADIENT_BEGIN_OFFSET, GRADIENT_END_OFFSET, GRADIENT_INNER_RADIUS, IMAGE_BORDER_STYLE, INITIAL_IMAGE_BORDER_WIDTH, ONE_TURN_DEGREES, REPAIR_POINT_INNER_COLOR, REPAIR_POINT_OUTER_COLOR, ZERO_DEGREES } from '../constants'
import { PositionRange } from '../types/common'
import { CreateContext2DConfig, DrawImageLineBorderConfig, DrawingCircularConfig, GetImageSourceConfig, InitHiddenBoardConfig, InitHiddenBoardWithImageConfig, ResizeCanvasConfig, TransformedDrawingImageConfig } from '../types/dom'
// import { isString } from 'lodash'

function isString(value: string) {
  return typeof value === 'string'
}

export function resizeCanvas(config: ResizeCanvasConfig) {
  const { ctx, targetWidth, targetHeight, hiddenCtx, transformConfig, withBorder = false } = config
  const { positionRange, scaleRatio } = transformConfig
  ctx.canvas.width = targetWidth
  ctx.canvas.height = targetHeight
  ctx.imageSmoothingEnabled = DEFAULT_IMAGE_SMOOTH_CHOICE
  transformedDrawImage({ ctx, hiddenCtx, positionRange, scaleRatio, withBorder, clearOld: false })
}

/** 创建2D绘制上下文 */
export function createContext2D(createConfig: CreateContext2DConfig = {}): CanvasRenderingContext2D {
  const { targetSize, cloneCanvas } = createConfig
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const context2D: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D
  if (targetSize) {
    canvas.width = targetSize.width
    canvas.height = targetSize.height
  }
  if (cloneCanvas) {
    domHelpers.copyImageInCanvas(context2D, cloneCanvas)
  }
  return context2D
}

/** 复制画布中的图像 */
function copyImageInCanvas(hiddenContext: CanvasRenderingContext2D, cloneCanvas: HTMLCanvasElement) {
  hiddenContext.canvas.width = cloneCanvas.width
  hiddenContext.canvas.height = cloneCanvas.height
  hiddenContext.drawImage(cloneCanvas, 0, 0)
}

/** 隐藏各个画布 */
export function hideCanvas(...ctxs: CanvasRenderingContext2D[]) {
  for (const ctx of ctxs) {
    ctx.canvas.style.display = 'none'
  }
}

/** 显示各个画布 */
export function showCanvas(...ctxs: CanvasRenderingContext2D[]) {
  for (const ctx of ctxs) {
    ctx.canvas.style.display = 'initial'
  }
}

/** 获取指定链接下的位图图像 */
export async function getLoadedImage(picFile: File | string): Promise<ImageBitmap> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = isString(picFile) ? picFile : URL.createObjectURL(picFile)
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })
  return createImageBitmap(img)
}

export function initHiddenBoardWithSource(initConfig: InitHiddenBoardWithImageConfig) {
  initHiddenBoard(initConfig)
  const {
    hiddenCtx: ctx,
    imageSource,
    targetSize: { width, height },
  } = initConfig
  return getImageSourceFromCtx({ ctx, imageSource, width, height })
}

/** 初始化隐藏的绘制画板和成果图画板 */
export function initHiddenBoard(initConfig: InitHiddenBoardConfig): void {
  const { targetSize, hiddenCtx, drawingCtx } = initConfig
  const { width, height } = targetSize
  hiddenCtx.canvas.width = width
  hiddenCtx.canvas.height = height
  drawingCtx.canvas.width = width
  drawingCtx.canvas.height = height
}

/** 获取画布全屏绘制后的图像 */
export function getImageSourceFromCtx(config: GetImageSourceConfig) {
  const { ctx, imageSource, width, height } = config
  ctx.drawImage(imageSource, 0, 0, width, height)
  return createImageBitmap(ctx.canvas)
}

/** 清除画布中之前的内容 */
function clearCanvas(ctx: CanvasRenderingContext2D) {
  const {
    canvas: { width, height },
  } = ctx
  ctx.clearRect(0, 0, width, height)
}

/** 绘制抠图成果图的线框 */
function drawImageBorder(borderConfig: DrawImageLineBorderConfig) {
  const { ctx, lineStyle, lineWidth, positionRange } = borderConfig
  const { minY: top, maxX: right, maxY: bottom, minX: left } = positionRange
  ctx.imageSmoothingEnabled = !DEFAULT_IMAGE_SMOOTH_CHOICE
  ctx.fillStyle = lineStyle
  ctx.fillRect(left, top, right - left + lineWidth, lineWidth)
  ctx.fillRect(left, bottom, right - left + lineWidth, lineWidth)
  ctx.fillRect(left, top + lineWidth, lineWidth, bottom - top - lineWidth)
  ctx.fillRect(right, top + lineWidth, lineWidth, bottom - top - lineWidth)
  ctx.imageSmoothingEnabled = DEFAULT_IMAGE_SMOOTH_CHOICE
}

/** 绘制画板上图像的边框 */
function drawBoardImageBorder(ctx: CanvasRenderingContext2D, hiddenCtx: CanvasRenderingContext2D) {
  const { width, height } = hiddenCtx.canvas
  const positionRange: PositionRange = { minX: 0, minY: 0, maxX: width, maxY: height }
  drawImageBorder({
    ctx,
    positionRange,
    lineStyle: IMAGE_BORDER_STYLE,
    lineWidth: INITIAL_IMAGE_BORDER_WIDTH,
  })
}

/** 进行变换和绘制 */
export function transformedDrawImage(transformedConfig: TransformedDrawingImageConfig) {
  const { ctx, positionRange, scaleRatio, hiddenCtx } = transformedConfig
  const { clearOld = true, withBorder } = transformedConfig
  const { minX: translateX, minY: translateY } = positionRange
  if (clearOld) {
    clearCanvas(ctx)
  }
  ctx.save()
  ctx.translate(translateX, translateY)
  ctx.scale(scaleRatio, scaleRatio)
  ctx.drawImage(hiddenCtx.canvas, 0, 0)
  if (withBorder) {
    drawBoardImageBorder(ctx, hiddenCtx)
  }
  ctx.restore()
}

/** 绘制擦补画笔圆点 */
export function drawBrushPoint(drawingConfig: DrawingCircularConfig) {
  const { ctx, x, y, radius, hardness } = drawingConfig
  const { innerColor = REPAIR_POINT_INNER_COLOR, outerColor = REPAIR_POINT_OUTER_COLOR } = drawingConfig
  ctx.beginPath()
  const gradient = ctx.createRadialGradient(x, y, GRADIENT_INNER_RADIUS, x, y, radius)
  gradient.addColorStop(GRADIENT_BEGIN_OFFSET, innerColor)
  gradient.addColorStop(hardness, innerColor)
  gradient.addColorStop(GRADIENT_END_OFFSET, outerColor)
  ctx.fillStyle = gradient
  ctx.arc(x, y, radius, ZERO_DEGREES, ONE_TURN_DEGREES)
  ctx.fill()
}

/** 生成结果图像的URL */
export function generateResultImageURL(rawImage: ImageBitmap, resultCtx: CanvasRenderingContext2D) {
  const resultImageCtx = createResultImageContext2D(rawImage, resultCtx)
  return resultImageCtx.canvas.toDataURL()
}

/** 创建绘制了原始尺寸结果图的绘制上下文 */
function createResultImageContext2D(imageSource: ImageBitmap, resultImageCtx: CanvasRenderingContext2D): CanvasRenderingContext2D {
  const context2D = createRawImageContext2D(imageSource)
  drawResultImageInContext2D(context2D, resultImageCtx, imageSource)
  return context2D
}

/** 创建绘制了原始尺寸图片的绘制上下文 */
function createRawImageContext2D(imageSource: ImageBitmap): CanvasRenderingContext2D {
  const context2D = createContext2D({ targetSize: imageSource })
  context2D.drawImage(imageSource, 0, 0)
  return context2D
}

/** 在传入的绘制上下文上绘制原始尺寸的结果图 */
function drawResultImageInContext2D(ctx: CanvasRenderingContext2D, resultImageCtx: CanvasRenderingContext2D, imageSource: ImageBitmap): void {
  ctx.globalCompositeOperation = GLOBAL_COMPOSITE_OPERATION_DESTINATION_IN
  ctx.drawImage(resultImageCtx.canvas, 0, 0, imageSource.width, imageSource.height)
}

export const domHelpers = {
  copyImageInCanvas,
}
