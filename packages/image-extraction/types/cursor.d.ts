import { Ref } from 'vue';

/** 鼠标指针的样式 */
export interface CursorStyle {
	display?: string;
	left?: string;
	top?: string;
	cursor?: string;
	width?: string;
}

/** 使用鼠标指针组合API的配置对象 */
export interface UseCursorConfig {
	inputCtx: Ref<CanvasRenderingContext2D | null>;
	isDragging: Ref<boolean>;
	isErasing: Ref<boolean>;
	radius: Ref<number>;
	hardness: Ref<number>;
}
