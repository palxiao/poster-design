/*
 * @Author: ShawnPhang
 * @Date: 2023-10-05 16:33:07
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-08 11:09:17
 */
import { INITIAL_RADIUS, INITIAL_HARDNESS, RADIUS_TO_BRUSH_SIZE_RATIO, HARDNESS_ZOOM_TO_SLIDER_RATIO, INITIAL_TRANSFORM_CONFIG } from '../constants'
import { createContext2D } from '../helpers/dom-helper'
import ListenerManager from '../helpers/listener-manager'
import { BoardRect, TransformConfig } from '../types/common'
import { ImageSources, InitMattingBaseConfig, InitMattingResult, MattingProps } from '../types/init-matting'
import { ref, computed, Ref, reactive } from 'vue'
import { useInitDrawingListeners, useInitTransformListener } from './use-init-listeners'
import { useInitMattingBoards } from './use-init-matting'

export function useMatting() {
  const picFile = ref<null | File>(null)
  const isErasing = ref(false)
  const radius = ref(INITIAL_RADIUS)
  const hardness = ref(INITIAL_HARDNESS)
  const brushSize = computed(() => radius.value * RADIUS_TO_BRUSH_SIZE_RATIO)
  const hardnessText = computed(() => `${Math.round((hardness.value as number) * HARDNESS_ZOOM_TO_SLIDER_RATIO)}%`)

  return {
    picFile,
    isErasing,
    radius,
    hardness,
    brushSize,
    hardnessText,
  }
}

const inputDrawingCtx: CanvasRenderingContext2D = createContext2D()
const outputDrawingCtx: CanvasRenderingContext2D = createContext2D()

export function useMattingBoard(props: MattingProps) {
  const width = ref(0)
  const height = ref(0)
  const inputCtx: Ref<CanvasRenderingContext2D | null> = ref(null)
  const outputCtx: Ref<CanvasRenderingContext2D | null> = ref(null)
  const initMattingResult: Ref<InitMattingResult | null> = ref(null)
  const draggingInputBoard = ref(false)
  const isDrawing = ref(false)
  const transformConfig: TransformConfig = reactive(INITIAL_TRANSFORM_CONFIG)
  const mattingSources: Ref<ImageSources | null> = ref(null)
  const boardRect: Ref<BoardRect | null> = ref(null)
  const initialized = ref(false)
  const inputHiddenCtx = ref(createContext2D())
  const outputHiddenCtx = ref(createContext2D())
  const listenerManager = new ListenerManager()
  const initMattingConfig: InitMattingBaseConfig = {
    boardContexts: { inputCtx, outputCtx, inputDrawingCtx, outputDrawingCtx, inputHiddenCtx, outputHiddenCtx },
    initMattingResult,
    transformConfig,
    mattingSources,
    initialized,
    boardRect,
  }
  const initListenersConfig = { ...initMattingConfig, draggingInputBoard, isDrawing, listenerManager }
  useInitMattingBoards(props, { ...initMattingConfig, width, height })
  useInitDrawingListeners(props, initListenersConfig)
  useInitTransformListener(initListenersConfig)
  return {
    width,
    height,
    inputCtx,
    outputCtx,
    inputHiddenCtx,
    outputHiddenCtx,
    draggingInputBoard,
    transformConfig,
    initialized,
    mattingSources,
    inputDrawingCtx,
  }
}
