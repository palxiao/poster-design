import { transformedDrawImage } from '../helpers/dom-helper'
import { initDrawingListeners } from '../helpers/init-drawing-listeners'
import { initDragListener, initScaleListener } from '../helpers/init-transform-listener'
import { BoardRect } from '../types/common'
import { ImageSources, MattingProps, UseInitListenersConfig } from '../types/init-matting'
import { onBeforeUnmount, watch, watchEffect } from 'vue'

export function useInitDrawingListeners(props: MattingProps, config: UseInitListenersConfig) {
  const { radius, hardness, isErasing } = props
  const { boardContexts, transformConfig, mattingSources, draggingInputBoard, initialized, boardRect, listenerManager } = config
  const { inputCtx } = boardContexts
  watchEffect(() => {
    if (initialized.value) {
      initDrawingListeners({
        listenerManager,
        imageSources: mattingSources.value as ImageSources,
        boardContexts,
        initDrawingConfig: { radius, hardness, transformConfig },
        isErasing: isErasing.value,
        draggingInputBoard: draggingInputBoard.value,
        boardRect: boardRect.value as BoardRect,
      })
    }
  })
  onBeforeUnmount(() => {
    listenerManager.removeMouseListeners((inputCtx.value as CanvasRenderingContext2D).canvas)
  })
}

export function useInitTransformListener(config: UseInitListenersConfig) {
  const { boardContexts, initialized, draggingInputBoard, transformConfig, isDrawing, listenerManager } = config
  const { inputCtx, inputHiddenCtx, outputCtx, outputHiddenCtx } = boardContexts
  watch(
    [initialized, draggingInputBoard, isDrawing],
    () => {
      if (initialized.value && !isDrawing.value) {
        const initConfig = {
          inputContexts: { ctx: inputCtx.value as CanvasRenderingContext2D, hiddenCtx: inputHiddenCtx.value },
          outputContexts: { ctx: outputCtx.value as CanvasRenderingContext2D, hiddenCtx: outputHiddenCtx.value },
          draggingInputBoard: draggingInputBoard.value,
          listenerManager,
          transformConfig,
        }
        initDragListener(initConfig)
        initScaleListener(initConfig)
        // 触发重新绑定绘制监听器,必须输入画板拖动结束时才能重新绑定，否则绘制监听器会覆盖拖动监听器
        if (!draggingInputBoard.value) {
          transformConfig.positionRange = { ...transformConfig.positionRange }
        }
      }
    },
    { deep: true },
  )
  watch([transformConfig], async () => {
    if (initialized.value) {
      const { positionRange, scaleRatio } = transformConfig
      const commonConfig = { positionRange, scaleRatio }
      transformedDrawImage({
        ctx: inputCtx.value as CanvasRenderingContext2D,
        hiddenCtx: inputHiddenCtx.value,
        ...commonConfig,
      })
      transformedDrawImage({
        ctx: outputCtx.value as CanvasRenderingContext2D,
        hiddenCtx: outputHiddenCtx.value,
        withBorder: true,
        ...commonConfig,
      })
    }
  })
  onBeforeUnmount(() => {
    if (initialized.value) {
      listenerManager.removeMouseListeners((outputCtx.value as CanvasRenderingContext2D).canvas)
      listenerManager.removeWheelListeners()
    }
  })
}
