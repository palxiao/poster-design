import { EventType, GLOBAL_COMPOSITE_OPERATION_DESTINATION_OUT, GLOBAL_COMPOSITE_OPERATION_SOURCE_OVER } from '../constants'
import { MouseMovements, PixelPosition } from '../types/common'
import { BoardDrawingConfig, BrushDrawingBaseConfig, CanDrawAndBindMouseListenerConfig, ComputePositionAndMovementConfig, ComputeRealPositionConfig, DrawingListenerConfig, InitDrawingConfig, InitDrawingListenerConfig, PositionAndMovements } from '../types/drawing-listeners'
import { isInImageRange } from './drawing-compute'
import { executeMattingDrawing } from './drawing-helper'
import { transformHelpers, updateRangeByMovements } from './transform-helper'
import { computeRealRadius, computeStep, computeStepBase, getRawDistance } from './util'

export function initDrawingListeners(config: InitDrawingListenerConfig) {
  const { listenerManager, initDrawingConfig } = config
  const listenerConfig = generateDrawingListenerConfig(config)
  let spaceDown = false
  const {
    inputBoardDrawingConfig: { ctx: inputCtx, hiddenCtx: inputHiddenCtx },
    outputBoardDrawingConfig: { hiddenCtx: outputHiddenCtx },
    brushDrawingBaseConfig: { positionRange },
  } = listenerConfig
  const { boardRect, draggingInputBoard } = listenerConfig
  resetPivotalOptions(listenerConfig)
  const drawingListener = generateDrawingListener(listenerConfig)
  let canDrawAndBindListener = false
  // --- TODO: 临时快捷键测试 ----
  document.removeEventListener('keydown', handleKeydown, false)
  function handleKeydown(e: any) {
    if (e.code === 'Space') {
      e.preventDefault()
    }
    spaceDown = e.code === 'Space'
  }
  document.addEventListener('keydown', handleKeydown, false)
  function handleKeyup(e: any) {
    spaceDown = false
  }
  document.removeEventListener('keydown', handleKeyup, false)
  document.addEventListener('keyup', handleKeyup, false)
  // --- END ---
  listenerManager.initMouseListeners({
    mouseTarget: (inputCtx.value as CanvasRenderingContext2D).canvas,
    down(ev) {
      if (!spaceDown) {
        canDrawAndBindListener = canDrawAndBindMoveListener({
          ev,
          boardRect,
          positionRange,
          draggingInputBoard,
        })
        if (canDrawAndBindListener) {
          drawingListener(ev)
        }
        return canDrawAndBindListener
      }
    },
    move(ev) {
      const { positionRange } = initDrawingConfig.transformConfig
      spaceDown && updateRangeByMovements(ev, positionRange)
      if (!draggingInputBoard && canDrawAndBindListener) {
        drawingListener(ev)
      }
    },
    up(ev) {
      if (!draggingInputBoard && canDrawAndBindListener) {
        canDrawAndBindListener = false
        drawingListener(ev)
      }
    },
  })
}

/** 生成绘制监听器的配置对象 */
function generateDrawingListenerConfig(config: InitDrawingListenerConfig): DrawingListenerConfig {
  const {
    imageSources,
    imageSources: { raw, mask },
    initDrawingConfig,
    boardContexts,
    ...restConfig
  } = config
  const { inputCtx, inputHiddenCtx, inputDrawingCtx, outputCtx, outputHiddenCtx, outputDrawingCtx } = boardContexts
  const brushDrawingBaseConfig: BrushDrawingBaseConfig = generateBrushBaseConfig(initDrawingConfig)
  const inputBoardDrawingConfig: BoardDrawingConfig = {
    ctx: inputCtx,
    hiddenCtx: inputHiddenCtx,
    drawingCtx: inputDrawingCtx,
    mattingSource: mask,
  }
  const outputBoardDrawingConfig: BoardDrawingConfig = {
    ctx: outputCtx,
    hiddenCtx: outputHiddenCtx,
    drawingCtx: outputDrawingCtx,
    mattingSource: raw,
  }
  return {
    brushDrawingBaseConfig,
    mattingSources: imageSources,
    inputBoardDrawingConfig,
    outputBoardDrawingConfig,
    ...restConfig,
  }
}

/** 重置画板配置对象中关键的选项 */
function resetPivotalOptions(config: DrawingListenerConfig) {
  const { inputBoardDrawingConfig, outputBoardDrawingConfig } = config
  const {
    mattingSources: { raw, mask },
    isErasing,
  } = config
  if (isErasing) {
    inputBoardDrawingConfig.mattingSource = raw
    outputBoardDrawingConfig.hiddenCtx.value.globalCompositeOperation = GLOBAL_COMPOSITE_OPERATION_DESTINATION_OUT
  } else {
    inputBoardDrawingConfig.mattingSource = mask
    outputBoardDrawingConfig.hiddenCtx.value.globalCompositeOperation = GLOBAL_COMPOSITE_OPERATION_SOURCE_OVER
  }
}

/** 生成画笔的基础配置对象 */
function generateBrushBaseConfig(config: InitDrawingConfig): BrushDrawingBaseConfig {
  const {
    radius: rawRadius,
    hardness,
    transformConfig: { scaleRatio, positionRange },
  } = config
  const radius = computeRealRadius(rawRadius.value, scaleRatio)
  const stepBase = computeStepBase(radius)
  const step = computeStep(radius)
  return { radius, step, stepBase, scaleRatio, positionRange, hardness: hardness.value }
}

/** 生成擦补画笔的绘制监听器 */
function generateDrawingListener(config: DrawingListenerConfig) {
  const {
    brushDrawingBaseConfig,
    brushDrawingBaseConfig: { step, scaleRatio, positionRange },
    boardRect: { left, top },
  } = config
  const { inputBoardDrawingConfig, outputBoardDrawingConfig, isErasing } = config
  let totalMovement = 0
  return (ev: MouseEvent) => {
    // TODO: 绘制
    const positionAndMovements = computePositionAndMovements({
      ev,
      scaleRatio,
      positionRange,
      left,
      top,
    })
    const { movementX, movementY } = positionAndMovements
    const commonPointConfig = {
      ...brushDrawingBaseConfig,
      ...positionAndMovements,
    }
    totalMovement += getRawDistance(movementX, movementY)
    if (canDrawing(totalMovement, step, ev.type)) {
      totalMovement = 0
      executeMattingDrawing([
        { ...commonPointConfig, ...inputBoardDrawingConfig },
        { ...commonPointConfig, ...outputBoardDrawingConfig, isErasing },
      ])
    }
  }
}

/** 判断是否可以绘制 */
function canDrawing(totalMovement: number, step: number, eventType: string): boolean {
  return totalMovement >= step || eventType === EventType.MouseDown
}

/** 计算绘制点坐标位置及鼠标指针水平、垂直移动距离 */
function computePositionAndMovements(config: ComputePositionAndMovementConfig): PositionAndMovements {
  const { ev, scaleRatio, positionRange, left, top } = config
  const { minX, minY } = positionRange
  const { movementX, movementY, pageX, pageY } = ev
  const realPosition = computeRealPosition({ pageX, pageY, left, top, minX, minY, scaleRatio })
  const realMovements = computeRealMovements({ movementX, movementY }, scaleRatio)
  return { ...realPosition, ...realMovements }
}

/** 计算相对于真实图像尺寸的鼠标位置 */
function computeRealPosition(config: ComputeRealPositionConfig): PixelPosition {
  const { pageX, pageY, left, top, minX, minY, scaleRatio } = config
  const x = (pageX - left - minX) / scaleRatio
  const y = (pageY - top - minY) / scaleRatio
  return { x, y }
}

/** 计算相对于真实图像尺寸的移动距离 */
function computeRealMovements(rawMovements: MouseMovements, scaleRatio: number) {
  const { movementX: rawMovementX, movementY: rawMovementY } = rawMovements
  const movementX = rawMovementX / scaleRatio
  const movementY = rawMovementY / scaleRatio
  return { movementX, movementY }
}

/** 判断是否可以绘制且绑定鼠标移动绘制的监听器 */
function canDrawAndBindMoveListener(canDrawAndBindConfig: CanDrawAndBindMouseListenerConfig) {
  const { ev, boardRect, positionRange, draggingInputBoard } = canDrawAndBindConfig
  const { pageX, pageY } = ev
  const { left, top } = boardRect
  const { minX, maxX, minY, maxY } = positionRange
  const x = transformHelpers.computePivot(pageX, left)
  const y = transformHelpers.computePivot(pageY, top)
  const inImageRange = isInImageRange({ x, y, minX, maxX, minY, maxY })
  return inImageRange && !draggingInputBoard
}
