import { EventType, UPDATE_BOARDRECT_DEBOUNCE_TIME } from '../constants'
import { resizeCanvas } from '../helpers/dom-helper'
import { computeBoardRect } from '../helpers/init-compute'
import { initMatting } from '../helpers/init-matting'
import { MattingProps, UseInitMattingBoardsConfig } from '../types/init-matting'
import { debounce } from 'throttle-debounce'
import { onMounted, onUnmounted, watch } from 'vue'

export function useInitMattingBoards(props: MattingProps, useInitMattingBoardsConfig: UseInitMattingBoardsConfig) {
  const { picFile } = props
  const {
    boardContexts,
    boardContexts: { inputCtx, outputCtx, inputHiddenCtx, outputHiddenCtx },
  } = useInitMattingBoardsConfig
  const { initMattingResult, width, height, initialized } = useInitMattingBoardsConfig
  const { boardRect, transformConfig, mattingSources } = useInitMattingBoardsConfig
  const updateBoardRect = () => {
    boardRect.value = computeBoardRect((inputCtx.value as CanvasRenderingContext2D).canvas)
  }
  const resizeBoards = () => {
    requestAnimationFrame(() => {
      const commonConfig = { targetHeight: height.value, targetWidth: width.value, transformConfig }
      resizeCanvas({
        ctx: inputCtx.value as CanvasRenderingContext2D,
        hiddenCtx: inputHiddenCtx.value,
        ...commonConfig,
      })
      resizeCanvas({
        ctx: outputCtx.value as CanvasRenderingContext2D,
        hiddenCtx: outputHiddenCtx.value,
        withBorder: true,
        ...commonConfig,
      })
    })
  }
  watch([picFile], async () => {
    if (picFile.value && width.value && height.value) {
      initialized.value = false
      initMattingResult.value = await initMatting({
        boardContexts,
        picFile: picFile.value,
        targetSize: { width: width.value, height: height.value },
        transformConfig: {},
        imageSources: {},
      })
      const { raw, mask, orig, positionRange, scaleRatio } = initMattingResult.value
      transformConfig.positionRange = positionRange
      transformConfig.scaleRatio = scaleRatio
      mattingSources.value = { raw, mask, orig }
      updateBoardRect()
      resizeBoards()
      initialized.value = true
    }
  })
  onMounted(() => {
    window.addEventListener(EventType.Resize, resizeBoards)
    window.addEventListener('scroll', debounce(UPDATE_BOARDRECT_DEBOUNCE_TIME, updateBoardRect))
  })
  onUnmounted(() => {
    window.removeEventListener(EventType.Resize, resizeBoards)
  })
}
