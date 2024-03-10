/*
 * @Author: ShawnPhang
 * @Date: 2023-10-05 16:33:07
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-08 11:10:07
 */
import { InitMattingDragConfig, InitMattingScaleConfig } from '../types/transform'
import { redrawMattingBoardsWhileScaling, updateRangeByMovements } from './transform-helper'

/** 初始化画板变换的监听器 */
export function initDragListener(mattingTransformConfig: InitMattingDragConfig) {
  const {
    outputContexts: { ctx: outputCtx2D },
    // inputContexts: { ctx: inputCtx2D },
    transformConfig,
    listenerManager,
  } = mattingTransformConfig
  listenerManager.initMouseListeners({
    mouseTarget: outputCtx2D.canvas,
    move(ev) {
      const { positionRange } = transformConfig
      updateRangeByMovements(ev, positionRange)
    },
  })
}

/** 初始化缩放监听器 */
export function initScaleListener(mattingTransformConfig: InitMattingScaleConfig): VoidFunction {
  const {
    inputContexts: { ctx: inputCtx },
    outputContexts: { ctx: outputCtx },
    listenerManager,
  } = mattingTransformConfig
  return listenerManager.initWheelListener({
    mattingBoards: [inputCtx.canvas, outputCtx.canvas],
    wheel(ev) {
      ev.preventDefault()
      redrawMattingBoardsWhileScaling(ev, mattingTransformConfig)
    },
  })
}
