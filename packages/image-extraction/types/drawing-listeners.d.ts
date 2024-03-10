import ListenerManager from '../helpers/listener-manager'
import { Ref } from 'vue'
import { BoardContext2Ds, BoardDrawingContexts, BoardRect, MouseMovements, PixelPosition, PositionRange, TransformConfig } from './common'
import { ImageSources } from './init-matting'

/** 初始化抠图绘制的配置对象 */
export interface InitDrawingListenerConfig {
  /** 监听器管理器 */
  listenerManager: ListenerManager
  /** 图像绘制源 */
  imageSources: ImageSources
  /** 画板绘制上下文 */
  boardContexts: BoardContext2Ds
  /** 初始化绘制的配置 */
  initDrawingConfig: InitDrawingConfig
  /** 是否为擦除画笔 */
  isErasing: boolean
  /** 是否正在拖动左侧输入区画板 */
  draggingInputBoard: boolean
  boardRect: BoardRect
}

/** 画笔绘制的基础配置 */
export interface BrushDrawingBaseConfig extends TransformConfig {
  /** 画笔半径 */
  radius: number
  /** 绘制距离间隔(移动时移动距离大于step才会进行绘制) */
  step: number
  /** 插值绘制时的间隔步长 */
  stepBase: number
  /** 画笔硬度 */
  hardness: number
}

/** 初始化绘制的配置对象 */
interface InitDrawingConfig {
  radius: Ref<number>
  hardness: Ref<number>
  transformConfig: TransformConfig
}

/** 画板绘制配置 */
export interface BoardDrawingConfig extends BoardDrawingContexts {
  mattingSource: ImageBitmap
}

/** 执行绘制的配置对象 */
export interface DrawingListenerConfig {
  /** 画笔绘制的基础配置 */
  brushDrawingBaseConfig: BrushDrawingBaseConfig
  /** 画板矩形的参数 */
  boardRect: BoardRect
  mattingSources: ImageSources
  /** 绘制输入上下文 */
  inputBoardDrawingConfig: BoardDrawingConfig
  /** 绘制输出上下文 */
  outputBoardDrawingConfig: BoardDrawingConfig
  /** 是否正在拖动左侧输入区画板 */
  draggingInputBoard: boolean
  /** 是否为擦除画笔 */
  isErasing: boolean
}

/** 计算绘制点坐标位置及鼠标指针水平、垂直移动距离的配置对象 */
export interface ComputePositionAndMovementConfig {
  ev: MouseEvent
  scaleRatio: number
  positionRange: PositionRange
  left: number
  top: number
}

/** 像素坐标及鼠标指针移动量 */
export type PositionAndMovements = MouseMovements & PixelPosition

/** 计算相对于真实图像尺寸的鼠标指针位置的配置对象 */
export interface ComputeRealPositionConfig {
  /** 鼠标指针的pageX */
  pageX: number
  /** 鼠标指针的pageY */
  pageY: number
  /** 画布的pageX */
  left: number
  /** 画布的pageY */
  top: number
  /** 图像左边缘相对于画布左上角的x坐标 */
  minX: number
  /** 图像上边缘相对于画布左上角的y坐标 */
  minY: number
  /** 图像缩放比例 */
  scaleRatio: number
}

/** 判断是否可以绘制并绑定鼠标事件监听器的配置对象 */
export interface CanDrawAndBindMouseListenerConfig {
  ev: MouseEvent
  boardRect: BoardRect
  positionRange: PositionRange
  /** 是否正在拖动左侧输入区画板 */
  draggingInputBoard: boolean
}
