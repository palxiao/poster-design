<template>
  <div v-if="hasHeader" class="options-container">
    <slot>
      <div class="default-wrap">
        <div class="option">
          <label for="image">选择图片：</label>
          <input id="image" type="file" accept=".jpg,.png,.gif,.webp" @change="onFileChange" />
        </div>
        <div class="option">
          <span>画笔类型：</span>
          <label for="fix">修补</label>
          <input id="fix" v-model="isErasing" type="radio" :value="false" />
          <label for="matting">擦除</label>
          <input id="matting" v-model="isErasing" :value="true" type="radio" />
        </div>
        <div class="option">
          <label for="radius">画笔尺寸：</label>
          <input id="radius" v-model="radius" class="range-input" type="range" :max="RADIUS_SLIDER_MAX" :min="RADIUS_SLIDER_MIN" :step="RADIUS_SLIDER_STEP" />
          <span>{{ brushSize }}</span>
        </div>
        <div class="option">
          <label for="hardness">画笔硬度：</label>
          <input id="hardness" v-model="hardness" class="range-input" type="range" :max="HARDNESS_SLIDER_MAX" :min="HARDNESS_SLIDER_MIN" :step="HARDNESS_SLIDER_STEP" />
          <span>{{ hardnessText }}</span>
        </div>
        <button :class="saveBtnClass" :disabled="cantSave" @click="onDownloadResult">{{ saveBtnText }}</button>
      </div>
    </slot>
  </div>
  <div class="board-container">
    <div class="matting-wrapper">
      <canvas ref="inputCvs" class="matting-board"></canvas>
      <img ref="inputCursor" class="matting-cursor" :style="mattingCursorStyle" :src="cursorImage" />
    </div>
    <div class="matting-wrapper">
      <canvas ref="outputCvs" class="result-board"></canvas>
      <img class="matting-cursor" :style="mattingCursorStyle" :src="cursorImage" />
    </div>
  </div>
  <a ref="resultLink" :href="resultURL" :download="downloadFileName"></a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMatting, useMattingBoard } from './composables/use-matting'
import useMattingCursor from './composables/use-matting-cursor'
import { RADIUS_SLIDER_MIN, RADIUS_SLIDER_MAX, RADIUS_SLIDER_STEP, HARDNESS_SLIDER_MAX, HARDNESS_SLIDER_STEP, HARDNESS_SLIDER_MIN, EventType, DEFAULT_MASK_COLOR } from './constants'
import { ref, onMounted, Ref, computed, nextTick, watch, defineExpose, onUnmounted } from 'vue'
import { generateResultImageURL, getLoadedImage } from './helpers/dom-helper'

export default defineComponent({
  props: {
    // 组件内是否存在头部工具栏
    hasHeader: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['register'],
  setup(props, { emit }) {
    const inputCvs: Ref<null | HTMLCanvasElement> = ref(null)
    const outputCvs: Ref<null | HTMLCanvasElement> = ref(null)
    const resultURL: Ref<string> = ref('')
    const resultLink: Ref<null | HTMLAnchorElement> = ref(null)
    const generating: Ref<boolean> = ref(false)
    const { picFile, isErasing, radius, hardness, brushSize, hardnessText } = useMatting()
    const { width, height, inputCtx, inputHiddenCtx, outputCtx, outputHiddenCtx, draggingInputBoard, initialized, mattingSources, transformConfig, inputDrawingCtx } = useMattingBoard({ picFile, isErasing, radius, hardness })
    const { cursorImage, mattingCursorStyle, renderOutputCursor } = useMattingCursor({
      inputCtx,
      isDragging: draggingInputBoard,
      isErasing,
      radius,
      hardness,
    })
    const downloadFileName = computed(() => (picFile.value ? `matting_${picFile.value.name}` : 'null'))
    const cantSave = computed(() => generating.value || !initialized.value)
    const saveBtnClass = computed(() => ({ 'save-btn': true, disabled: cantSave.value }))
    const saveBtnText = computed(() => (generating.value ? '保存中...' : '保存'))

    const onFileChange = (ev: Event) => {
      const { files } = ev.target as HTMLInputElement
      if (files && files[0] && /.+\.(jpg|jpeg|png|gif|webp)/.test(files[0].name)) {
        picFile.value = files[0]
      } else {
        alert('未选择图片或图片格式不正确(只支持jpg、png、gif、webp), 请重新选择')
      }
    }

    const initLoadImages = (source: string, result: string) => {
      nextTick(() => {
        fetch(source)
          .then((response) => response.blob())
          .then((blob) => {
            picFile.value = new File([blob], `image_${Math.random()}.jpg`, { type: 'image/jpeg' })
          })
          .catch((error) => {
            console.error('获取图片失败:', error)
          })

        watch(
          () => initialized.value,
          async () => {
            const image: any = await loadNetImg(result)
            outputHiddenCtx.value.drawImage(image, 0, 0)
            // TODO 将 ImageBitmap 绘制到 canvas 上
            let canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            let ctx: any = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            let imageData = ctx.getImageData(0, 0, image.width, image.height)
            let data = imageData.data
            // 遍历每个像素，并将非透明像素点绘制成蒙版
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) {
                // 非透明像素
                data[i] = DEFAULT_MASK_COLOR[0] * 255
                data[i + 1] = DEFAULT_MASK_COLOR[1] * 255
                data[i + 2] = DEFAULT_MASK_COLOR[2] * 255
                data[i + 3] = (DEFAULT_MASK_COLOR[3] - 0.15) * 255 // 颜色更浅一些方便区分
              }
            }
            await nextTick()
            setTimeout(async () => {
              // 强制刷新
              // transformConfig.positionRange = { ...transformConfig.positionRange };
              transformConfig.scaleRatio += 0.0001
              transformConfig.scaleRatio -= 0.0001
              setTimeout(() => {
                inputDrawingCtx.putImageData(imageData, 0, 0)
                inputHiddenCtx.value.drawImage(inputDrawingCtx.canvas, 0, 0)
                console.log('ok')
                setTimeout(() => {
                  transformConfig.scaleRatio += 0.0001
                  transformConfig.scaleRatio -= 0.0001
                }, 100)
              }, 100)
            }, 100)
          },
        )
      })
    }
    // 加载网络图片
    function loadNetImg(src: string) {
      return new Promise((resolve) => {
        let image = new Image()
        image.crossOrigin = 'anonymous'
        image.src = src
        image.onload = function () {
          resolve(image)
        }
      })
    }

    function handlechangeRadius(e: any) {
      // if (e.code === 'Space') {
      // 		e.preventDefault();
      // 	}
      radius.value = Number(radius.value)
      if (e.code === 'BracketLeft') {
        radius.value > RADIUS_SLIDER_MIN + RADIUS_SLIDER_STEP && (radius.value -= RADIUS_SLIDER_STEP)
      } else if (e.code === 'BracketRight') {
        radius.value < RADIUS_SLIDER_MAX - RADIUS_SLIDER_STEP && (radius.value += RADIUS_SLIDER_STEP)
      }
    }

    function initContextsAndSize() {
      const inputCanvas = inputCvs.value as HTMLCanvasElement
      const outputCanvas = outputCvs.value as HTMLCanvasElement
      inputCtx.value = inputCanvas.getContext('2d')
      outputCtx.value = outputCanvas.getContext('2d')
      const { clientWidth, clientHeight } = inputCanvas
      width.value = clientWidth
      height.value = clientHeight
    }

    function onDownloadResult() {
      if (mattingSources.value && !generating.value) {
        generating.value = true
        const url = generateResultImageURL(mattingSources.value.orig, outputHiddenCtx.value)
        generating.value = false
        resultURL.value = url
        setTimeout(() => {
          resultLink.value?.click()
        })
      }
    }
    function getResult() {
      if (mattingSources.value && !generating.value) {
        return generateResultImageURL(mattingSources.value.orig, outputHiddenCtx.value)
      }
    }

    onMounted(() => {
      emit('register', {
        isErasing,
        onDownloadResult,
        onFileChange,
        initLoadImages,
        radius,
        hardness,
        brushSize,
        hardnessText,
        constants: {
          RADIUS_SLIDER_MIN,
          RADIUS_SLIDER_MAX,
          RADIUS_SLIDER_STEP,
          HARDNESS_SLIDER_MAX,
          HARDNESS_SLIDER_STEP,
          HARDNESS_SLIDER_MIN,
        },
        getResult,
      })
      initContextsAndSize()
      renderOutputCursor()
      document.addEventListener('keydown', handlechangeRadius, false)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handlechangeRadius, false)
    })

    return {
      onDownloadResult,
      onFileChange,
      inputCvs,
      outputCvs,
      resultURL,
      resultLink,
      isErasing,
      radius,
      hardness,
      brushSize,
      hardnessText,
      saveBtnText,
      downloadFileName,
      saveBtnClass,
      cursorImage,
      mattingCursorStyle,
      cantSave,
      RADIUS_SLIDER_MIN,
      RADIUS_SLIDER_MAX,
      RADIUS_SLIDER_STEP,
      HARDNESS_SLIDER_MAX,
      HARDNESS_SLIDER_STEP,
      HARDNESS_SLIDER_MIN,
    }
  },
})
</script>

<style lang="less" scoped>
.options-container {
  height: 50px;
  .default-wrap {
    display: flex;
    height: 100%;
    padding: 0 12px;
    align-items: center;
  }

  .option {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 100%;

    &:not(:last-child) {
      border-right: 1px solid #e3e7e9;
    }

    .range-input {
      position: relative;
      top: 2px;
    }
  }

  .save-btn {
    position: absolute;
    right: 20px;
    font-size: 16px;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
    }
  }
}

.board-container {
  // position: fixed;
  top: 50px;
  bottom: 0;
  left: 0;
  width: 100%;
  min-width: 800px;
  min-height: 600px;
  display: flex;

  .matting-board,
  .result-board {
    flex: 1 50%;
    border: 1px solid #c3c7c9;
    background: #e3e7e9;
    background-image: linear-gradient(45deg, #f6fafc 25%, transparent 0), linear-gradient(45deg, transparent 75%, #f6fafc 0), linear-gradient(45deg, #f6fafc 25%, transparent 0), linear-gradient(45deg, transparent 75%, #f6fafc 0);
    background-position: 0 0, 12px 12px, 12px 12px, 24px 24px;
    background-size: 24px 24px;
  }

  .matting-wrapper {
    position: relative;
    flex: 1 1;
  }

  .matting-board,
  .result-board {
    width: 100%;
    height: 100%;
  }

  .matting-board {
    cursor: none;
  }

  .result-board {
    cursor: grab;
  }

  .matting-cursor {
    /** 穿透画笔，触发画布点击事件 */
    pointer-events: none;
    display: none;
    position: absolute;
    left: -9999px;
    top: -9999px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
