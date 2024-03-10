import { Ref } from 'vue';

/** 鼠标指针移动距离 */
export interface MouseMovements {
	/** 水平移动距离 */
	movementX: number;
	/** 垂直移动距离 */
	movementY: number;
}

/** 像素坐标 */
export interface PixelPosition {
	x: number;
	y: number;
}

/** 变换配置对象 */
export interface TransformConfig {
	positionRange: PositionRange;
	scaleRatio: number;
}

/** 绘制位置范围 */
export interface PositionRange {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

/** 矩形的尺寸 */
export interface RectSize {
	width: number;
	height: number;
}

/** 画板矩形的参数 */
export interface BoardRect extends RectSize {
	left: number;
	top: number;
}

/** 矩形的尺寸 */
export interface RectSize {
	width: number;
	height: number;
}

/** 画板绘制上下文 */
export interface BoardDrawingContexts {
	/** 画板绘制上下文 */
	ctx: Ref<CanvasRenderingContext2D | null>;
	/** 绘制输入图像的隐藏画板的绘制上下文 */
	hiddenCtx: Ref<CanvasRenderingContext2D>;
	/** 绘制画笔形状的临时画板 */
	drawingCtx: CanvasRenderingContext2D;
}

/** 画板绘制上下文对象 */
export interface BoardContext2Ds {
	/** 输入画板绘制上下文 */
	inputCtx: Ref<CanvasRenderingContext2D | null>;
	/** 输出画板绘制上下文 */
	outputCtx: Ref<CanvasRenderingContext2D | null>;
	inputDrawingCtx: CanvasRenderingContext2D;
	outputDrawingCtx: CanvasRenderingContext2D;
	/** 绘制输入图像的隐藏画板的绘制上下文 */
	inputHiddenCtx: Ref<CanvasRenderingContext2D>;
	/** 绘制输出图像的隐藏画板的绘制上下文 */
	outputHiddenCtx: Ref<CanvasRenderingContext2D>;
}

/** 绘制基础配置对象 */
export interface MattingBoardBaseConfig {
	boardContexts: BoardContext2Ds;
	/** 画布目标尺寸 */
	targetSize: RectSize;
	/** 图像绘制时与画布边缘最小间隙 */
	gapSize?: GapSize;
}

/**
 * 导航视窗区域内图片默认尺寸：以图片中心点为原点，进行等比例缩放
 * 图片上下边距至少各留80px，左右边距至少留白40px，上下边距优先级高于左右边距
 * 例如：当图片上下留白80px时，左右留白大于40px时，以上下留白80px为准
 */
export interface GapSize {
	horizontal: number;
	vertical: number;
}

/** 初始化按照变换配置绘制图像的基础配置对象 */
export interface InitTransformedDrawBaseConfig {
	/** 变换配置 */
	transformConfig: TransformConfig;
	/** 是否绘制图像边框 */
	withBorder?: boolean;
}
