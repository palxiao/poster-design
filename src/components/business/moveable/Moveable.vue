<!--
 * @Description: widget move
 * @Author: xi_zi
 * @Date: 2024-04-03 10:25:49
 * @LastEditTime: 2024-04-04 00:28:22
 * @LastEditors: xi_zi
-->
<template>
  <moveable
    v-if="targetRef"
    ref="moveableRef"
    v-bind="options"
    :target="targetRef"
    :elementGuidelines="elementGuidelines"
    :getElementRect="getElementInfo"
    :renderDirections="renderDirections"
    @drag-origin="onDragOrigin"
    @drag-origin-end="onDragOriginEnd"
    @change-targets="onChangeTargets"
    @drag-group="onDragGroup"
    @drag-group-end="onDragGroupEnd"
    @scale-group="onScaleGroup"
    @scale-group-end="onScaleGroupEnd"
    @resize-group="onResizeGroup"
    @resize-group-end="onResizeGroupEnd"
    @rotate-group="onRotateGroup"
    @rotate-group-end="onRotateGroupEnd"
  />
  <vue-selecto
    dragContainer="#page-design"
    toggleContinueSelect="shift"
    :selectableTargets="['.layer']"
    :selectByClick="false"
    :continueSelect="false"
    :selectFromInside="false"
    :hitRate="5"
    :keyContainer="keyContainer"
    @select="onSelect"
    @drag-start="onSelectoDragStart"
  />
</template>
<script lang="ts" setup>
import Moveable, { getElementInfo } from 'vue3-moveable'
import { VueSelecto } from 'vue3-selecto'
import VanillaSelecto, { OnSelect, OnDragStart as OnSelectoDragStart } from 'selecto'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useControlStore, useWidgetStore, useForceStore, useHistoryStore } from '@/store'
import type {
  MoveableRefTargetType,
  OnDragStart,
  OnDrag,
  OnDragEnd,
  OnWarp,
  OnResize,
  OnResizeEnd,
  OnScale,
  OnRotate,
  OnRotateEnd,
  RotatableProps,
  OnScaleEnd,
  OnWarpEnd,
  ElementGuidelineValueOption,
  MoveableRefType,
  OnDragOrigin,
  OnChangeTargets,
  OnDragOriginEnd,
  OnDragGroup,
  OnDragGroupEnd,
  OnScaleGroup,
  OnScaleGroupEnd,
  OnResizeGroup,
  OnResizeGroupEnd,
  OnRotateGroup,
  OnRotateGroupEnd,
} from 'vue3-moveable'
import { TUpdateWidgetMultiplePayload } from '@/store/design/widget/actions/widget'

type TModifierStyle = { transform?: string; transformOrigin?: string; width?: number; height?: number }

const widgetStore = useWidgetStore()
const controlStore = useControlStore()
const forceStore = useForceStore()
const historyStore = useHistoryStore()
const { guidelines } = storeToRefs(useCanvasStore())
const { showMoveable, showRotatable, dAltDown, resizable, scalable, warpable, dSpaceDown } = storeToRefs(controlStore)
const { dSelectWidgets, dActiveElement, activeMouseEvent, dWidgets } = storeToRefs(widgetStore)
const { updateRect, updateSelect } = storeToRefs(forceStore)

const keyContainer = document.getElementById('page-design')
const targetRef = ref<MoveableRefTargetType>()
const moveableRef = ref<Moveable>()
const elementGuidelines = ref<(ElementGuidelineValueOption | MoveableRefType<Element>)[]>([])
const renderDirections = ref<string[]>([])
let _target: string | null = null

const modifierStyle = (target: HTMLElement | SVGElement, { transform, transformOrigin, width, height }: TModifierStyle) => {
  if (transform) target.style.transform = transform
  if (transformOrigin) target.style.transformOrigin = transformOrigin
  if (width) target.style.width = `${width}px`
  if (height) target.style.height = `${height}px`
}

const updateStoreModifierStyle = (target: HTMLElement | SVGElement, { transform, transformOrigin, width, height }: TModifierStyle) => {
  const uuid = target.getAttribute('id') || ''
  const updateData:  TUpdateWidgetMultiplePayload['data'] = []
  if (transform) updateData.push({ key: 'transform', value: transform })
  if (transformOrigin) updateData.push({ key: 'transformOrigin', value: transformOrigin })
  if (width) updateData.push({ key: 'width', value: width })
  if (height) updateData.push({ key: 'height', value: height })

  widgetStore.updateWidgetMultiple({
    uuid,
    data: updateData,
  })
}

const onDragGroup = ({ events, inputEvent }: OnDragGroup) => {
  inputEvent.stopPropagation()
  inputEvent.preventDefault()
  events.forEach(({ target, transform }) => modifierStyle(target, { transform }))
}
const onDragGroupEnd = ({ targets }: OnDragGroupEnd) => targets.forEach((target) => updateStoreModifierStyle(target, { transform: target.style.transform }))

const onScaleGroup = ({ events }: OnScaleGroup) => {
  events.forEach((ev) => {
    ev.target.style.transform = ev.transform
  })
}

const onScaleGroupEnd = (e: OnScaleGroupEnd) => {}

const onResizeGroup = ({ events }: OnResizeGroup) => {
  events.forEach((ev) => {
    ev.target.style.transform = ev.transform
  })
}
const onResizeGroupEnd = (e: OnResizeGroupEnd) => {}

const onRotateGroup = ({ events }: OnRotateGroup) => {
  events.forEach((ev) => {
    ev.target.style.transform = ev.transform
  })
}

const onRotateGroupEnd = (e: OnRotateGroupEnd) => {}

const onDragStart = (e: OnDragStart) => {
  const { inputEvent, stopDrag } = e
  if (inputEvent.target.nodeName === 'PRE' && dActiveElement.value?.editable) stopDrag()
  if (dActiveElement.value?.lock) stopDrag()
}
const onDrag = ({ target, transform }: OnDrag) => modifierStyle(target, { transform })
const onDragEnd = ({ inputEvent, target }: OnDragEnd) => {
  widgetStore.setMouseEvent(null)
  inputEvent.stopPropagation()
  inputEvent.preventDefault()
  updateStoreModifierStyle(target, { transform: target.style.transform })
}

/**
 * 拖拽参数
 */
const dragOptions = reactive({
  // 是否可以拖动目标
  draggable: true,
  // 拖动节流
  throttleDrag: 1,
  // 是否通过拖动边线移动
  edgeDraggable: false,
  // 当拖动时，角度为 x，y 的节流阀。
  throttleDragRotate: 0,
  // 当拖动时，旋转 x，y。
  startDragRotate: 0,
  onDrag,
  onDragStart,
  onDragEnd,
})

const onWarp = ({ target, transform }: OnWarp) => modifierStyle(target, { transform })
const onWarpEnd = ({ target }: OnWarpEnd) => updateStoreModifierStyle(target, { transform: target.style.transform })
/**
 * 扭曲参数
 */
const warpOptions = reactive({
  //目标能否扭曲
  warpable: true,
  onWarp,
  onWarpEnd,
})

const onResize = ({ width, height, drag: { transform }, target }: OnResize) => modifierStyle(target, { transform, width, height })
const onResizeEnd = ({ target }: OnResizeEnd) => updateStoreModifierStyle(target, { transform: target.style.transform, width: parseFloat(target.style.width), height: parseFloat(target.style.height) })

/**
 * 调整大小参数
 */
const resizeOptions = reactive({
  // 开启调整大小
  resizable: true,
  // 调整大小最大宽度
  maxWidth: 'auto',
  // 调整大小最大高度
  maxHeight: 'auto',
  // 调整大小最小宽度
  minWidth: 'auto',
  // 调整大小最小高度
  minHeight: 'auto',
  // 是否保持宽高比
  keepRatio: false,
  // 宽度、高度调整时的节流
  throttleResize: 1,
  onResize,
  onResizeEnd,
})

const onScale = ({ target, drag: { transform } }: OnScale) => modifierStyle(target, { transform })
const onScaleEnd = (e: OnScaleEnd) => {
  const uuid = dActiveElement.value?.uuid || ''
  widgetStore.updateWidgetData({
    uuid,
    key: 'transform',
    value: e.target.style.transform,
  })
}
/**
 * 缩放参数
 */
const scaleOptions = reactive({
  // 是否可缩放
  scalable: true,
  // 是否保持宽度、高度的比例
  keepRatio: false,
  //节流阀的比例
  throttleScale: 0,
  onScale,
  onScaleEnd,
})

const onRotate = (e: OnRotate) => (e.target.style.transform = e.drag.transform)
const onRotateEnd = ({ target }: OnRotateEnd) => updateStoreModifierStyle(target, { transform: target.style.transform })

const rotateOptions = reactive<RotatableProps>({
  // 是否可旋转
  rotatable: true,
  // 转动时角度节流阀
  throttleRotate: 1,
  // 旋转的位置
  rotationPosition: 'bottom',
  onRotate,
  onRotateEnd,
})

const options = computed(() => {
  const opt = { ...dragOptions }
  if (showRotatable.value) Object.assign(opt, rotateOptions)
  if (warpable.value) Object.assign(opt, warpOptions)
  if (scalable.value) Object.assign(opt, scaleOptions)
  if (resizable.value) Object.assign(opt, resizeOptions)
  return opt
})

const onDragOrigin = ({ target, transformOrigin, drag }: OnDragOrigin) => {
  target.style.transformOrigin = transformOrigin
  target.style.transform = drag.transform
}

const onDragOriginEnd = ({ target }: OnDragOriginEnd) => {
  const uuid = dActiveElement.value?.uuid || ''
  widgetStore.updateWidgetData({
    uuid,
    key: 'transform',
    value: target.style.transform,
  })
  widgetStore.updateWidgetData({
    uuid,
    key: 'transformOrigin',
    value: target.style.transformOrigin,
  })
}

/**
 * target 发生变化的时候，transformOrigin 放置于中心
 * 用于兼容ps插件转码 transformOrigin 定位问题
 */
const onChangeTargets = ({ targets, moveable }: OnChangeTargets) => {
  const target = targets[0]
  if (targets.length !== 1 || !target) return
  const transformOrigin = target.style.transformOrigin
  if (!transformOrigin.includes('left') || !transformOrigin.includes('top')) return
  const cloneNode: any = target.cloneNode(true)
  cloneNode.style.position = 'fixed'
  cloneNode.style.zIndex = '-10000'
  cloneNode.style.transform = 'none'
  document.body.appendChild(cloneNode)
  const react = cloneNode?.getBoundingClientRect()
  document.body.removeChild(cloneNode)
  if (!react) return
  setTimeout(() => {
    moveable.request('originDraggable', { origin: [react.width / 2, react.height / 2] }, true)
  }, 100)
}

const onSelect = (e: OnSelect<VanillaSelecto>) => {
  e.added.forEach((el) => {
    if (!Array.from(el.classList).includes('layer-lock') && !el.hasAttribute('child')) {
      el.classList.add('widget-selected')
      widgetStore.selectWidgetsInOut({
        uuid: el.getAttribute('data-uuid') || '',
      })
    }
  })
  e.removed.forEach((el) => {
    el.classList.remove('widget-selected')
    widgetStore.selectWidgetsInOut({
      uuid: el.getAttribute('data-uuid') || '',
    })
  })
  renderDirections.value = []
  controlStore.setShowRotatable(false)
  targetRef.value = [].slice.call(document.querySelectorAll('.widget-selected'))
}

const onSelectoDragStart = (e: OnSelectoDragStart<VanillaSelecto>) => {
  if (dSpaceDown.value) e.stop()
}

const checkMouseEvent = () => {
  if (!activeMouseEvent.value || !moveableRef.value) return
  moveableRef.value.dragStart(activeMouseEvent.value)
  // 使用后销毁 mouseEvent
  widgetStore.setMouseEvent(null)
  // store.commit('setMouseEvent', null)
}

watch(
  () => dActiveElement.value,
  async (val) => {
    setTimeout(async () => {
      await nextTick()
      checkMouseEvent()
    }, 10)
    if (!val || !val.record) return
    if (val.uuid === '-1') {
      targetRef.value = null
      _target = null
      elementGuidelines.value.length = 0
      return
    }
    await nextTick()
    const targetId = `[id="${val.uuid}"]`
    _target = targetId
    controlStore.setShowRotatable(true)
    renderDirections.value = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']
    targetRef.value = document.querySelector(targetId) as MoveableRefTargetType
    controlStore.setShowMoveable(true)
    if (!elementGuidelines.value.includes(targetId)) elementGuidelines.value.push(targetId)
    checkMouseEvent()
  },
)

watch(
  () => showMoveable.value,
  (val) => {
    if (!val) return (targetRef.value = null)
    targetRef.value = _target
  },
)

watch(
  () => updateRect.value,
  () => {
    if (moveableRef.value) moveableRef.value.updateRect()
  },
)

watch(
  () => updateSelect.value,
  () => {
    const items = widgetStore.dSelectWidgets
    setTimeout(async () => {
      if (!moveableRef.value) return
      moveableRef.value.updateRect()
      await nextTick()
      for (let i = 0; i < items.length; i++) {
        document.getElementById(items[i].uuid)?.classList.add('widget-selected')
      }
      renderDirections.value = []
      controlStore.setShowRotatable(false)
      const targetCollector: MoveableRefType<HTMLElement>[] = [].slice.call(document.querySelectorAll('.widget-selected'))
      targetRef.value = targetCollector
      for (let i = 0; i < items.length; i++) {
        document.getElementById(items[i].uuid)?.classList.remove('widget-selected')
      }
    }, 400)
  },
)

/** 选择的元素 */
watch(
  () => dSelectWidgets.value,
  (items) => {
    const alt = dAltDown.value
    // if (items.length > 1) {
    //   console.log('打开组合面板')
    // }
    if (alt) {
      for (let i = 0; i < items.length; i++) {
        document.getElementById(items[i].uuid)?.classList.add('widget-selected')
      }
      renderDirections.value = []
      controlStore.setShowRotatable(false)
      const targetCollector: MoveableRefType<HTMLElement>[] = [].slice.call(document.querySelectorAll('.widget-selected'))
      targetRef.value = targetCollector
      for (let i = 0; i < items.length; i++) {
        document.getElementById(items[i].uuid)?.classList.remove('widget-selected')
      }
    }
  },
  { deep: true },
)

/** 标尺线 */
watch(
  () => guidelines.value,
  (lines) => {
    if (!moveableRef.value) return
    moveableRef.value.verticalGuidelines = lines.verticalGuidelines
    moveableRef.value.horizontalGuidelines = lines.horizontalGuidelines
  },
)

watch(
  () => updateRect.value,
  () => moveableRef.value?.updateRect(),
)
</script>
<style scoped lang="less"></style>
