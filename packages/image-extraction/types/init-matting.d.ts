import ListenerManager from '../helpers/listener-manager'
import { Ref } from 'vue'
import { BoardContext2Ds, BoardRect, GapSize, MattingBoardBaseConfig, PositionRange, RectSize, TransformConfig } from './common'

/** 抠图画板配置 */
export interface MattingProps {
  picFile: Ref<File | null>
  isErasing: Ref<boolean>
  radius: Ref<number>
  hardness: Ref<number>
}

/** 初始化得到的作为绘制源的图像资源 */
export interface ImageSources {
  /** 原始图片的绘制数据(原始图片初始化结果) */
  raw: ImageBitmap
  /** 蒙版图片的绘制数据(蒙版图片初始化结果) */
  mask: ImageBitmap
  orig: ImageBitmap
}

/** 初始化画板得到的结果 */
export type InitMattingResult = ImageSources & TransformConfig

/** 初始化抠图的组合API的基础配置对象 */
export interface InitMattingBaseConfig {
  boardContexts: BoardContext2Ds
  initMattingResult: Ref<InitMattingResult | null>
  transformConfig: TransformConfig
  mattingSources: Ref<ImageSources | null>
  boardRect: Ref<BoardRect | null>
  initialized: Ref<boolean>
}

/** 初始化抠图画板的组合API的基础配置对象 */
export interface UseInitMattingBoardsConfig extends InitMattingBaseConfig {
  width: Ref<number>
  height: Ref<number>
}

/** 初始化抠图绘制事件监听器的基础配置对象 */
export interface UseInitListenersConfig extends InitMattingBaseConfig {
  /** 是否正在拖动左侧输入区画板 */
  draggingInputBoard: Ref<boolean>
  /** 是否正在绘制中 */
  isDrawing: Ref<boolean>
  /** 事件管理器 */
  listenerManager: ListenerManager
}

/** 抠图画板初始化配置对象 */
export interface InitMattingConfig extends MattingBoardBaseConfig {
  picFile: File
  transformConfig: Partial<TransformConfig>
  imageSources: Partial<ImageSources>
}

/** 生成模板图像资源的配置对象 */
export interface GenerateMaskSourceConfig {
  targetSize: RectSize
  imageSource: TexImageSource
}

interface DrawingBoardsContexts {
  /** 隐藏的绘制上下文，用于绘制真实尺寸的图像 */
  hiddenCtx: CanvasRenderingContext2D
  drawingCtx: CanvasRenderingContext2D
  ctx: CanvasRenderingContext2D
}

/** 画板初始化配置对象 */
export interface InitDrawingBoardConfig extends DrawingBoardsContexts {
  /** 图片链接地址 */
  picFile: File
  targetSize: RectSize
  transformConfig: Partial<TransformConfig>
  withBorder?: boolean
  needDraw?: boolean
}

/** 计算抠图画板变换配置的配置对象 */
export interface ComputeTransformConfigConfig {
  imageSource: ImageBitmap
  targetSize: RectSize
  gapSize?: GapSize
}

/** 获取有效变换参数对象的配置对象 */
export interface GetValidTransformParametersConfig extends ComputeTransformConfigConfig {
  transformConfig: Partial<TransformConfig>
}

/** 计算变换参数(缩放因子、偏移坐标)的配置对象 */
export interface TransformParametersConfig {
  /** 图片原始尺寸 */
  imageSize: RectSize
  /** 间隙尺寸 */
  gapSize: GapSize
  /** 图片绘制的目标尺寸 */
  targetSize: RectSize
}

/** 计算好的变换参数 */
export interface TransformParameters {
  /** 缩放因子 */
  scaleRatio: number
  positionRange: PositionRange
}
