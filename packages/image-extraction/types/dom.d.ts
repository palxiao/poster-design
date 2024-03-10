import { InitTransformedDrawBaseConfig, PositionRange, RectSize, TransformConfig } from './common';

/** canvas尺寸重置配置对象 */
export interface ResizeCanvasConfig extends InitTransformedDrawBaseConfig {
	/** canvas 2D上下文 */
	ctx: CanvasRenderingContext2D;
	hiddenCtx: CanvasRenderingContext2D;
	/** 尺寸重置的目标宽度 */
	targetWidth: number;
	/** 尺寸重置的目标高度 */
	targetHeight: number;
}

/** 创建2D绘制上下文的配置对象 */
export interface CreateContext2DConfig {
	targetSize?: RectSize;
	cloneCanvas?: HTMLCanvasElement;
}

/** 初始化隐藏画板的配置对象 */
export interface InitHiddenBoardConfig {
	targetSize: RectSize;
	hiddenCtx: CanvasRenderingContext2D;
	drawingCtx: CanvasRenderingContext2D;
}

/** 初始化隐藏画布并返回图像的配置对象 */
export interface InitHiddenBoardWithImageConfig extends InitHiddenBoardConfig {
	imageSource: ImageBitmap;
}

/** 从画布获取图像资源的配置对象 */
export interface GetImageSourceConfig {
	ctx: CanvasRenderingContext2D;
	imageSource: ImageBitmap;
	width: number;
	height: number;
}

/** 画板变换时绘制的上下文对象 */
export interface DirectlyDrawingContext {
	/** 画板绘制上下文 */
	ctx: CanvasRenderingContext2D;
	/** 隐藏的绘制上下文 */
	hiddenCtx: CanvasRenderingContext2D;
}

/** 画板变换时绘制图像的配置对象 */
export interface TransformedDrawingImageConfig extends DirectlyDrawingContext, TransformConfig {
	clearOld?: boolean;
	withBorder?: boolean;
}

/** 绘制图像边框的配置对象 */
export interface DrawImageLineBorderConfig {
	/** 边框的上下左右位置信息 */
	positionRange: PositionRange;
	ctx: CanvasRenderingContext2D;
	/** 边框颜色 */
	lineStyle: string;
	lineWidth: number;
}

/** 绘制圆点的配置对象 */
export interface DrawingCircularConfig {
	ctx: CanvasRenderingContext2D | CanvasRenderingContext2D;
	x: number;
	y: number;
	radius: number;
	hardness: number;
	innerColor?: string;
	outerColor?: string;
}
