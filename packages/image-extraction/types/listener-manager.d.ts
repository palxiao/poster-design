export interface MouseListenerContext {
	/** 触发鼠标事件的目标DOM */
	mouseTarget: HTMLElement;
	/** mousemove监听器 */
	move: (ev: MouseEvent) => void;
	/** mousedown监听器 */
	down?: (ev: MouseEvent) => void | boolean;
	/** mouseup监听器 */
	up?: (ev: MouseEvent) => void;
}

/** 用于解绑mousedown监听器、mouseup监听器的回调的配置对象 */
export interface UnbindDownUpConfig {
	/** 解绑mousedown监听器的回调 */
	unbindDown: VoidFunction;
	/** 解绑mouseup监听器的回调 */
	unbindUp: VoidFunction;
}

/** 事件监听配置对象 */
export interface ListenerConfig {
	/** 事件类型 */
	eventType: string;
	/** 事件监听器 */
	listener: EventListener;
	stop?: boolean;
	prevent?: boolean;
}

export interface WheelListenerContext {
	/** 输入端(左侧)画板 */
	mattingBoards: HTMLCanvasElement[];
	/** 滑动开始的监听器 */
	wheel: (ev: WheelEvent) => void;
}

/** 存放UnbindDownUpConfig对象的容器 */
export type UnbindDownUpCache = WeakMap<HTMLElement, UnbindDownUpConfig>;

/** 存放解绑mousemove监听器的回调的容器 */
export type UnbindMoveCache = WeakMap<HTMLElement, VoidFunction>;

/** 解绑Wheel监听器的回调的容器 */
export type UnbindWheelCache = Set<VoidFunction>;
