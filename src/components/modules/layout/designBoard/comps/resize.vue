<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-06 15:17:03
 * @Description: 画布尺寸操作柄
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-08 12:28:15
-->
<template>
  <div v-show="show" class="page-resize" :style="{ width: Math.floor(pw) + 'px', height: Math.floor(ph) + 'px' }">
    <div @mousedown="handlemousedown($event, 'ns', true)" class="resize__bar resize__bar-top"></div>
    <div @mousedown="handlemousedown($event, 'ew')" class="resize__bar resize__bar-right"></div>
    <div @mousedown="handlemousedown($event, 'ns')" class="resize__bar resize__bar-bottom"></div>
    <div @mousedown="handlemousedown($event, 'ew', true)" class="resize__bar resize__bar-left"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore, useCanvasStore } from '@/store'
import { storeToRefs } from 'pinia'
const widgetStore = useWidgetStore()
const canvasStore = useCanvasStore()

const props = defineProps<{
  width: number
  height: number
}>()

type Direction = 'ns' | 'ew' // 上下 | 左右

const { dActiveElement } = storeToRefs(widgetStore)
const show = computed(() => dActiveElement.value?.uuid === '-1')

let initData = { x: 0, y: 0, w: 0, h: 0 }
let moveDir = ''
let moveRev: any = undefined

const handlemousedown = (e: any, dir: Direction, isReverse?: boolean) => {
  moveDir = dir
  moveRev = isReverse
  e.stopPropagation()
  e.preventDefault()
  initData = { x: e.pageX, y: e.pageY, w: canvasStore.dPage.width, h: canvasStore.dPage.height }
  document.addEventListener('mousemove', handlemousemove, true)
  document.addEventListener('mouseup', stopMove, true)
}

const stopMove = () => {
  document.removeEventListener('mousemove', handlemousemove, true)
  document.removeEventListener('mouseup', stopMove, true)
}

function handlemousemove(e: any) {
  const { x, y, w, h } = initData
  if (moveDir === 'ew') {
    const dx = e.pageX - x
    const moveX = Math.floor((dx * 100) / canvasStore.dZoom)
    const result = moveRev ? w - moveX * 2 : w + moveX * 2
    result <= 5000 && result > 0 && (canvasStore.dPage.width = result)
  } else {
    const dy = e.pageY - y
    const moveY = Math.floor((dy * 100) / canvasStore.dZoom)
    const result = moveRev ? h - moveY * 2 : h + moveY * 2
    result <= 5000 && result > 0 && (canvasStore.dPage.height = result)
  }
}

const pw = computed(() => props.width)
const ph = computed(() => props.height)
</script>

<style lang="less" scoped>
@bar-color: rgba(0, 0, 0, 0.2);

.page-resize {
  pointer-events: none;
  position: absolute;
  z-index: 10;
  .resize__bar {
    pointer-events: auto;
    position: absolute;
    &-left {
      left: -14px;
    }
    &-right {
      right: -14px;
    }
    &-left,
    &-right {
      position: reactive;
      cursor: ew-resize;
      width: 10px;
      height: 24px;
      top: 50%;
      transform: translateY(-12px);
    }
    &-left:after,
    &-right:after {
      position: absolute;
      content: '';
      left: 3px;
      width: 4px;
      height: 24px;
      border-radius: 12px;
      background: @bar-color;
    }
    &-top {
      top: -14px;
    }
    &-bottom {
      bottom: -12px;
    }
    &-top,
    &-bottom {
      cursor: ns-resize;
      width: 24px;
      height: 10px;
      left: 50%;
      transform: translateX(-12px);
    }
    &-top:after,
    &-bottom:after {
      position: absolute;
      content: '';
      top: 4px;
      width: 24px;
      height: 4px;
      border-radius: 12px;
      background: @bar-color;
    }
  }
}
</style>
