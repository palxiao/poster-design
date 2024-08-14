<template>
  <div
    :id="params.uuid"
    ref="widgetRef"
    :class="['w-image', { 'layer-lock': params.lock }]"
    :style="{
      position: state.position,
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <div
      v-if="cropEdit"
      :id="params.uuid + '_ebox'"
      :ref="params.uuid + '_ebox'"
      :style="state.editBoxStyle"
      class="svg__edit__wrap"
    >
      <img class="edit__model" :src="params.imgUrl" />
    </div>
    <div :style="{ transform: params.flip ? `rotate${params.flip}(180deg)` : undefined, borderRadius: params.radius + 'px', '-webkit-mask-image': `${params.mask ? `url('${params.mask}')` : 'initial'}` }" :class="['img__box', { mask: params.mask }]">
      <div v-if="params.isNinePatch" ref="targetRef" class="target" :style="{ border: `${(params.height * params.sliceData.ratio) / 2}px solid transparent`, borderImage: `url('${params.imgUrl}') ${params.sliceData.left} round` }"></div>
      <img v-else ref="targetRef" class="target" style="transform-origin: center" :src="params.imgUrl" />
    </div>
    <div v-if="isMask" class="drop__mask">
      <div putIn="true" :style="{ fontSize: params.width / 12 + 'px' }" class="drop__btn">拖入</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 图片组件
// const NAME = 'w-image'
import { CSSProperties, StyleValue, computed, nextTick, onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch } from 'vue'

// import { getMatrix } from '@/common/methods/handleTransform'
import setting from "./wImageSetting"
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useControlStore, useForceStore, useWidgetStore } from '@/store'

type TProps = {
  params: typeof setting
  parent: {
    left: number
    top: number
  }
}

type TState = {
  position: 'absolute' | 'relative', // 'absolute'relative
  editBoxStyle: CSSProperties,
  cropWidgetXY: {
    x: number
    y: number
  }
  holdPosition: {
    left: number
    top: number
  }
}

const props = defineProps<TProps>()
const state = reactive<TState>({
  position: 'absolute', // 'absolute'relative
  editBoxStyle: {
    transformOrigin: 'center',
    transform: '',
  },
  cropWidgetXY: {
    x: 0,
    y: 0,
  },
  holdPosition: {
    left: 0,
    top: 0,
  }
})
const route = useRoute()


const controlStore = useControlStore()
const widgetStore = useWidgetStore()
const forceStore = useForceStore()

const widgetRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLImageElement | null>(null)

let rotateTemp: number | null = null
let flipTemp: string | null = null

// const {
//   dActiveElement, dWidgets, dMouseXY, dDropOverUuid, dCropUuid
// } = useSetupMapGetters(['dActiveElement', 'dWidgets', 'dMouseXY', 'dDropOverUuid', 'dCropUuid'])
const { dZoom } = storeToRefs(useCanvasStore())
const {
  dActiveElement, dWidgets, dMouseXY, dDropOverUuid
} = storeToRefs(widgetStore)
const { dCropUuid } = storeToRefs(controlStore)

// ...mapGetters(['dActiveElement', 'dWidgets', 'dZoom', 'dMouseXY', 'dDropOverUuid', 'dCropUuid']),
const cropEdit = computed(() => {
  return props.params.uuid === dCropUuid.value
})
const tZoom = computed(() => {
  return props.params.zoom
})
const isMask = computed(() => {
  return props.params.mask && dDropOverUuid.value === props.params.uuid
})
const isDraw = computed(() => {
  return route.name === 'Draw'
})

watch(
  () => cropEdit.value,
  (val) => {
    // TODO 移动事件绑定
    const el = document.getElementById(`${props.params.uuid}`)
    if (val) {
      el?.addEventListener('mousedown', touchstart, false)
    } else {
      el?.removeEventListener('mousedown', touchstart, false)
    }
    fixRotate()
    lockOthers(val)
  }
)

watch(
  () => tZoom.value,
  async () => {
    await nextTick()
    updateRecord()
  }
)

onUpdated(() => {
  updateRecord()
  forceStore.setUpdateRect()
  // store.commit('updateRect')
})

onMounted(async () => {
  updateRecord()
  await nextTick()
  document.addEventListener('mouseup', touchend, false)
  // if (this.params.transformData) {
  //   // this.$refs.widget.style.transform += `scale(${this.params.transformData.a}, ${this.params.transformData.d})`
  //   this.$refs.widget.style.transform += `matrix(${String(getMatrix(this.params.transformData))})`
  // } else {
  //   // this.$refs.widget.style.transform += `scale(${this.params.transformData.a}, ${this.params.transformData.d})`
  //   this.params.rotate && (this.$refs.widget.style.transform += `rotate(${this.params.rotate})`)
  // }
  // console.log(this.params, this.params.filter)
  // this.$refs.widget.style.filter = 'hue-rotate(100deg) blur(50px)'
  if (widgetRef.value) {
    widgetRef.value.style.transform += props.params.rotate && (widgetRef.value.style.transform += `rotate(${props.params.rotate})`)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', touchend, false)
})

// ...mapActions(['updateWidgetData']),
function touchstart(e: MouseEvent) {
  // const editBox = this.$refs[props.params.uuid + '_ebox']
  const editBox = document.getElementById(props.params.uuid + '_ebox')
  state.cropWidgetXY = {
    x: Number(editBox?.style.left.replace('px', '')) || 0,
    y: Number(editBox?.style.top.replace('px', '')) || 0,
  }
  // 绑定鼠标移动事件
  document.addEventListener('mousemove', handlemousemove, true)
}

/** 取消鼠标移动事件 */
function touchend() {
  document.removeEventListener('mousemove', handlemousemove, true)
  // const left = Number(this.editBoxStyle.left.replace('px', ''))
  // const flow = (this.params.width * (1 - this.tZoom)) / 2
  // if (left + flow < 0) {
  // }
}

function handlemousemove(e?: MouseEvent) {
  if (!move(e)) {
    return
  }
  e && e.stopPropagation()
  e && e.preventDefault()
  const { left, top } = move(e)
  // TODO 触发位置刷新
  state.holdPosition = { left, top }
  state.editBoxStyle.left = left + 'px'
  state.editBoxStyle.top = top + 'px'
  changeFinish(left / props.params.zoom, top / props.params.zoom)
}

function changeFinish(x: number, y: number) {
  setTransform('translate', `${x}px, ${y}px`)
}

function move(payload?: MouseEvent) {
  if (payload) {
    const widgetXY = { x: state.cropWidgetXY.x, y: state.cropWidgetXY.y }
    const dx = Number(payload.pageX) - dMouseXY.value.x
    const dy = Number(payload.pageY) - dMouseXY.value.y
    let left = Number(widgetXY.x) + Math.floor((dx * 100) / dZoom.value)
    let top = Number(widgetXY.y) + Math.floor((dy * 100) / dZoom.value)
    // TODO: 旋转后计算坐标
    // const rotate = Number(this.params.rotate.replace('deg', ''))
    // console.log(Math.sin(rotate), Math.cos(rotate))
    return { left, top }
  } else {
    return state.holdPosition
  }
}

function updateRecord() {
  if (dActiveElement.value?.uuid === props.params.uuid) {
    let record = dActiveElement.value?.record
    if (widgetRef.value) {
      record.width = widgetRef.value.offsetWidth
      record.height = widgetRef.value.offsetHeight
    }
  }
  updateZoom()
}

function setTransform(attrName: string, value: string | number) {
  const iof = props.params.transform.indexOf(attrName)
  let setValue = ''
  if (iof != -1) {
    const index = iof + attrName.length
    const tf = props.params.transform
    const FRONT = tf.slice(0, index + 1)
    const half = tf.substring(index + 1)
    const END = half.substring(half.indexOf(')'))
    setValue = FRONT + value + END
  } else {
    setValue = props.params.transform + ` ${attrName}(${value})`
  }
  widgetStore.updateWidgetData({
    uuid: props.params.uuid,
    key: 'transform',
    value: setValue
  })
  // store.dispatch("updateWidgetData", {
  //   uuid: props.params.uuid,
  //   key: 'transform',
  //   value: setValue,
  //   pushHistory: false,
  // })
  if (props.params.transform && targetRef.value) {
    targetRef.value.style.transform = props.params.transform
  }
}

function setEditBox(attrName: string, value: string | number) {
  const iof = state.editBoxStyle.transform?.indexOf(attrName)
  let setValue = ''
  if (iof != -1 && iof != undefined) {
    const index = iof + attrName.length
    const tf = state.editBoxStyle.transform ?? ''
    const FRONT = tf.slice(0, index + 1)
    const half = tf.substring(index + 1)
    const END = half.substring(half.indexOf(')'))
    setValue = FRONT + value + END
  } else {
    setValue = state.editBoxStyle.transform + ` ${attrName}(${value})`
  }
  state.editBoxStyle.transform = setValue
}

function updateZoom() {
  setEditBox('scale', props.params.zoom)
  setTransform('scale', props.params.zoom)
  // this.$refs.target.style.transform = this.params.transform
  handlemousemove()
}

function fixRotate() {
  // 裁切时修正角度
  if (rotateTemp) {
    widgetRef.value && (widgetRef.value.style.transform = `rotate(${rotateTemp})`)
    props.params.flip = flipTemp
    rotateTemp = null
  } else {
    rotateTemp = props.params.rotate
    widgetRef.value && (widgetRef.value.style.transform = `rotate(0deg)`)
    flipTemp = props.params.flip
    props.params.flip = null
  }
  // store.commit('setShowMoveable', false)
  controlStore.setShowMoveable(false)
  setTimeout(() => {
    // store.commit('setShowMoveable', true)
    controlStore.setShowMoveable(true)
  }, 100)
}

function lockOthers(isCrop) {
  // 裁剪时锁定其他图层
  widgetStore.lockWidgets()
  if (!isCrop) return
  for (const widget of dWidgets.value) {
    if (widget.uuid === props.params.uuid) {
      widget.lock = false
      break;
    }
  }
}
// cropDone(e) {
//   e.stopPropagation()
//   e.preventDefault()
//   this.updateWidgetData({
//     uuid: this.params.uuid,
//     key: 'cropEdit',
//     value: false,
//     pushHistory: false,
//   })
// },
</script>

<style lang="less" scoped>
// .w-image {
//   // cursor: pointer;
//   // outline: none;
// }
.mask {
  -webkit-mask-size: 100% 100%;
  -webkit-mask-position: center;
}

.img__box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    display: block;
  }
}
.target {
  display: block;
  width: 100%;
  height: 100%;
}
.svg__edit__wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit__model {
  opacity: 0.2;
  width: 100%;
  height: 100%;
  // object-fit: contain;
}
.drop {
  &__mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__btn {
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    border: 2px dashed #ffffff;
    border-radius: 12px;
    padding: 2rem;
  }
}

.slider__bar {
  position: absolute;
  z-index: 999;
  right: 0;
  top: -80px;
  transform: scale(1.5);
}
</style>
