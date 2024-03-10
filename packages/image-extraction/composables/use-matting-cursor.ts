import { ERASE_POINT_INNER_COLOR, ERASE_POINT_OUTER_COLOR, EventType, INITIAL_HARDNESS, INITIAL_RADIUS, REPAIR_POINT_INNER_COLOR, REPAIR_POINT_OUTER_COLOR } from '../constants'
import { drawBrushPoint, getLoadedImage } from '../helpers/dom-helper'
import { DrawingCircularConfig } from '../types/dom'
import { computed, reactive, ref, Ref, UnwrapRef, watch, watchEffect } from 'vue'
import iconEraser from '../assets/eraser.png'
import { CursorStyle, UseCursorConfig } from '../types/cursor'

export class MattingCursor {
  ctx: CanvasRenderingContext2D
  cursorImage: Ref<string | undefined> = ref('')
  inputCursorStyle: Ref<CursorStyle | null> = ref(null)
  mattingCursorStyle: UnwrapRef<CursorStyle> = reactive(Object.create(null))
  radius = ref(INITIAL_RADIUS)
  hardness = ref(INITIAL_HARDNESS)

  inputCanvas = computed(() => (this.inputCtx.value as CanvasRenderingContext2D).canvas as HTMLElement)
  pointInnerColor = computed(() => (this.isErasing.value ? ERASE_POINT_INNER_COLOR : REPAIR_POINT_INNER_COLOR))
  pointOuterColor = computed(() => (this.isErasing.value ? ERASE_POINT_OUTER_COLOR : REPAIR_POINT_OUTER_COLOR))

  constructor(private inputCtx: Ref<CanvasRenderingContext2D | null>, private isErasing: Ref<boolean>) {
    this.ctx = this.creatCursorCanvas()
    this
  }

  creatCursorCanvas() {
    const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D
    return this.updateCtx(ctx)
  }

  updateCtx(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
    ctx.canvas.width = this.radius.value * 2
    ctx.canvas.height = this.radius.value * 2
    return ctx
  }

  async createCursorImage() {
    this.ctx = this.updateCtx(this.ctx)
    const drawingConfig: DrawingCircularConfig = {
      ctx: this.ctx as CanvasRenderingContext2D,
      x: this.radius.value,
      y: this.radius.value,
      radius: this.radius.value,
      hardness: this.hardness.value,
      innerColor: this.pointInnerColor.value,
      outerColor: this.pointOuterColor.value,
    }
    drawBrushPoint(drawingConfig)
    await this.drawIcon()
    return await this.ctx.canvas.toDataURL()
  }

  async drawIcon() {
    if (this.isErasing.value) {
      const eraser = await getLoadedImage(iconEraser)
      this.ctx.drawImage(eraser, 0, 0, this.radius.value * 2, this.radius.value * 2)
    }
  }

  renderOutputCursor() {
    const target = this.inputCanvas.value
    target.addEventListener(EventType.Mouseover, this.onShowCursor.bind(this))
    target.addEventListener(EventType.Mousemove, this.onRenderOutputCursor.bind(this))
    target.addEventListener(EventType.Mouseout, this.onHideCursor.bind(this))
  }

  onShowCursor() {
    this.mattingCursorStyle.display = 'initial'
  }

  onHideCursor() {
    this.mattingCursorStyle.display = 'none'
  }

  onRenderOutputCursor(e: MouseEvent) {
    this.mattingCursorStyle.left = e.offsetX - this.radius.value + 'px'
    this.mattingCursorStyle.top = e.offsetY - this.radius.value + 'px'
  }

  changeOutputCursorByDrag([isDragging]: boolean[]) {
    if (isDragging) {
      this.onHideCursor()
    } else {
      this.onShowCursor()
    }
  }

  updateCursorParams(currHardness: number, currRadius: number) {
    this.hardness.value = currHardness
    this.radius.value = currRadius
  }
}

export default function useMattingCursor(config: UseCursorConfig) {
  const { inputCtx, isDragging, isErasing, hardness, radius } = config
  const mattingCursor = new MattingCursor(inputCtx, isErasing)
  const { cursorImage, mattingCursorStyle, renderOutputCursor } = mattingCursor

  watchEffect(async () => {
    mattingCursor.updateCursorParams(hardness.value, radius.value)
    cursorImage.value = await mattingCursor.createCursorImage()
  })

  watch([isDragging], mattingCursor.changeOutputCursorByDrag.bind(mattingCursor))

  return {
    mattingCursor,
    mattingCursorStyle,
    cursorImage,
    renderOutputCursor: renderOutputCursor.bind(mattingCursor),
  }
}
