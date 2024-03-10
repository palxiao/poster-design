import { BoardDrawingContexts, MouseMovements, PixelPosition, PositionRange } from './common';
import { BrushDrawingBaseConfig } from './drawing-listeners';

/** 抠图绘制的配置对象 */
export interface MattingDrawingConfig extends MouseMovements, BrushDrawingBaseConfig, BoardDrawingContexts, PixelPosition {
	stepBase: number;
	mattingSource: ImageBitmap;
	/** 是否为擦除画笔 */
	isErasing?: boolean;
}

export interface ComputedMovements {
	unsignedMovementX: number;
	unsignedMovementY: number;
	maxMovement: number;
}

/** 处理插值的绘制点的配置对象 */
export interface RenderInterpolationConfig {
	/** 绘制点的配置对象 */
	drawingConfig: MattingDrawingConfig;
	/** 无符号水平移动距离 */
	unsignedMovementX: number;
	/** 无符号水平移动距离 */
	unsignedMovementY: number;
	/** 无符号水平/垂直移动距离较大的那个 */
	maxMovement: number;
}

/** 判断是否在图像范围内 */
export type InImageRangeConfig = PositionRange & PixelPosition;

/** 插值步长 */
export interface InterpolationStep {
	stepX: number;
	stepY: number;
}
