import { GapSize, RectSize, TransformConfig } from '../types/common'
import { GLColor } from '../types/matting-drawing'

export enum EventType {
  Mouseover = 'mouseover',
  Mouseenter = 'mouseenter',
  Mouseout = 'mouseout',
  Mouseleave = 'mouseleave',
  Mouseup = 'mouseup',
  Mousemove = 'mousemove',
  MouseDown = 'mousedown',
  DblClick = 'dblclick',
  Click = 'click',
  ContextMenu = 'contextmenu',
  KeyDown = 'keydown',
  Keyup = 'keyup',
  Keypress = 'keypress',
  Scroll = 'scroll',
  Resize = 'resize',
  Wheel = 'wheel',
  UndoRedoStateChanged = 'undoRedoStateChanged',
}

export const INITIAL_RADIUS = 12.5
export const INITIAL_HARDNESS = 0.5
/**  */
export const RADIUS_TO_BRUSH_SIZE_RATIO = 4

export const RADIUS_SLIDER_MIN = 0.25
export const RADIUS_SLIDER_STEP = 0.25
export const RADIUS_SLIDER_MAX = 25
/** 画笔绘制点最小半径像素 */
export const MIN_RADIUS = 0.5

export const HARDNESS_SLIDER_MIN = 0
export const HARDNESS_SLIDER_STEP = 0.01
export const HARDNESS_SLIDER_MAX = 1
/** 硬度放大到滑动条显示的值范围的放大倍数 */
export const HARDNESS_ZOOM_TO_SLIDER_RATIO = 100

export const INITIAL_SCALE_RATIO = 1
/** 默认的变换配置对象 */
export const INITIAL_TRANSFORM_CONFIG: TransformConfig = {
  scaleRatio: INITIAL_SCALE_RATIO,
  positionRange: {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  },
}
/**
 * 导航视窗区域内图片默认尺寸：以图片中心点为原点，进行等比例缩放
 * 图片上下边距至少各留80px，左右边距至少留白40px，上下边距优先级高于左右边距
 * 例如：当图片上下留白80px时，左右留白大于40px时，以上下留白80px为准
 */
export const INITIAL_GAP_SIZE: GapSize = {
  horizontal: 40,
  vertical: 80,
}

/** 隐藏画板的间隙对象——隐藏画板不需要留白 */
export const HIDDEN_BOARD_GAP_SIZE: GapSize = {
  horizontal: 0,
  vertical: 0,
}
/** 隐藏画板的最大尺寸——默认情况下与图片原始尺寸一致，但不能超过2000px,超过2000px会进行缩放以免影响性能 */
export const HIDDEN_BOARD_MAX_SIZE: RectSize = {
  width: 2000,
  height: 2000,
}

/** 默认的图像平滑选项值 */
export const DEFAULT_IMAGE_SMOOTH_CHOICE = false
export const IMAGE_BORDER_STYLE = '#000000'
export const INITIAL_IMAGE_BORDER_WIDTH = 1

export const DEFAULT_MASK_COLOR: GLColor = [0.47, 0.42, 0.9, 0.5]

/** 窗口滚动时更新boardRect的节流等待时间 */
export const UPDATE_BOARDRECT_DEBOUNCE_TIME = 100
/** 计算stepBase(绘制补帧线条的迭代中的增量，基于真实尺寸的半径得到)的系数的倒数 */
export const DRAWING_STEP_BASE_BASE = 20
/** 计算绘制圆点的节流步长的系数的倒数 */
export const DRAWING_STEP_BASE = 3.5

export const GLOBAL_COMPOSITE_OPERATION_SOURCE_OVER = 'source-over'
export const GLOBAL_COMPOSITE_OPERATION_DESTINATION_IN = 'destination-in'
export const GLOBAL_COMPOSITE_OPERATION_DESTINATION_OUT = 'destination-out'

/** 计算绘制补帧线条的节流步长的系数的倒数 */
export const DRAW_INTERPOLATION_STEP_BASE = 2.5
/** 绘制补帧线条的画笔半径阈值 */
export const DRAW_INTERPOLATION_RADIUS_THRESHOLD = 1
/** 径向渐变开始圆形的半径 */
export const GRADIENT_INNER_RADIUS = 0
/** 渐变开始的偏移值 */
export const GRADIENT_BEGIN_OFFSET = 0
/** 渐变结束的偏移值 */
export const GRADIENT_END_OFFSET = 1
/** 修补渐变开始的颜色 */
export const REPAIR_POINT_INNER_COLOR = 'rgba(119,106,230,1)'
/** 修补渐变结束的颜色 */
export const REPAIR_POINT_OUTER_COLOR = 'rgba(119,106,230,0)'
/** 擦除渐变开始的颜色 */
export const ERASE_POINT_INNER_COLOR = 'rgba(255,255,255,1)'
/** 擦除结束的颜色 */
export const ERASE_POINT_OUTER_COLOR = 'rgba(255,255,255,0)'
/** 0° */
export const ZERO_DEGREES = 0
/** 360° */
export const ONE_TURN_DEGREES = Math.PI * 2
/** 执行前进后退动作时的防抖时间 */
export const ACTION_THROTTLE_TIME = 300
/** 放大的系数 */
export const ZOOM_IN_COEFFICIENT = 1
/** 缩小的系数 */
export const ZOOM_OUT_COEFFICIENT = -1
/** 缩放比率变化的步长 */
export const SCALE_STEP = 0.04
export const MIN_SCALE_RATIO = 0.15
export const MAX_SCALE_RATIO = 10
