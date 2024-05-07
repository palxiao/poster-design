<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-10 23:02:46
 * @Description: 主画布
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 11:34:08
-->
<template>
  <div id="main" class="main-preview">
    <div id="page-design" ref="page_design" :style="{ paddingTop: dPaddingTop + 'px', minWidth: (dPage.width * dZoom) / 100 + dPresetPadding * 2 + 'px' }">
      <div
        id="out-page"
        class="out-page"
        :style="{
          padding: dPresetPadding + 'px',
          width: (dPage.width * dZoom) / 100 + dPresetPadding * 2 + 'px',
          opacity: 1 - (dZoom < 100 ? dPage.tag : 0),
        }"
      >
        <slot />
        <watermark :customStyle="{ height: (dPage.height * dZoom) / 100 + 'px' }">
          <div
            :id="pageDesignCanvasId"
            class="design-canvas"
            :data-type="dPage.type"
            :data-uuid="dPage.uuid"
            :style="{
              width: dPage.width + 'px',
              height: dPage.height + 'px',
              scale:  dZoom / 100,
              transformOrigin: (dZoom >= 100 ? 'center' : 'left') + ' top',
              backgroundColor: dPage.backgroundGradient ? undefined : dPage.backgroundColor,
              backgroundImage: dPage.backgroundImage ? `url(${dPage?.backgroundImage})` : dPage.backgroundGradient || undefined,
              backgroundSize: dPage.backgroundTransform?.x ? 'auto' : 'cover',
              backgroundPositionX: (dPage.backgroundTransform?.x || 0) + 'px',
              backgroundPositionY: (dPage.backgroundTransform?.y || 0) + 'px',
              opacity: dPage.opacity + (dZoom < 100 ? dPage.tag : 0),
              animationDuration: '10s',
            }"
            @mousedown="mousedown($event)"
            @mousemove="mousemove($event)"
            @mouseup="mouseup($event)"
          >
          
          <!--  -->
            <!-- <div class="pageItem" v-for="(item, i) in dLayouts" :key="i">
              <component :is="layer.type" v-for="layer in item.layers" :id="layer.uuid" :key="layer.uuid" :class="[layer, { 'layer-hover': layer.uuid === dHoverUuid || dActiveElement?.parent === layer.uuid, 'layer-no-hover': dActiveElement?.uuid === layer.uuid }, animationConfig(layer)]" :data-title="layer.type" :params="layer" :parent="dPage" :data-type="layer.type" :data-uuid="layer.uuid"> -->
              <component :is="layer.type" v-for="layer in dLayouts[page_index].layers" :id="layer.uuid" :key="layer.uuid" :class="[layer, { 'layer-hover': layer.uuid === dHoverUuid || dActiveElement?.parent === layer.uuid, 'layer-no-hover': dActiveElement?.uuid === layer.uuid }, animationConfig(layer)]" :data-title="layer.type" :params="layer" :parent="dPage" :data-type="layer.type" :data-uuid="layer.uuid">
                <template v-if="layer.isContainer">
                  <component :is="widget.type" v-for="widget in getChilds(layer.uuid)" :key="widget.uuid" child :class="[layer, { 'layer-no-hover': dActiveElement?.uuid !== widget.parent && dActiveElement?.parent !== widget.parent }]" :data-title="widget.type" :params="widget" :parent="layer" :data-type="widget.type" :data-uuid="widget.uuid" />
                </template>
              </component>
            <!-- </div> -->
          </div>
        </watermark>
      </div>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, reactive } from 'vue'
import { getTarget } from '@/common/methods/target'
import setWidgetData from '@/common/methods/DesignFeatures/setWidgetData'
import PointImg from '@/utils/plugins/pointImg'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import { debounce } from 'throttle-debounce'
import { move, moveInit } from '@/mixins/move'
import { useCanvasStore, useControlStore, useWidgetStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TPageState } from '@/store/design/canvas/d'
import watermark from './comps/pageWatermark.vue'
import { log } from 'console'
import useScroll from './hooks/useScroll'

// 页面设计组件
type TProps = {
  pageDesignCanvasId: string,
}

type TParentData = {
  width?: number
  height?: number
}

type TSetting = Partial<TPageState>

const controlStore = useControlStore()
const widgetStore = useWidgetStore()
const canvasStore = useCanvasStore()

const { pageDesignCanvasId } = defineProps<TProps>()


const { dPage } = storeToRefs(useCanvasStore())
let { dZoom, dPresetPadding, dPaddingTop, dScreen } = storeToRefs(canvasStore)
const { dDraging, showRotatable, dAltDown, dSpaceDown } = storeToRefs(controlStore)
const { dWidgets, dActiveElement, dSelectWidgets, dHoverUuid,dLayouts } = storeToRefs(widgetStore)
// 控制滚动相关的hooks
const {autoScroll, page_index, page_type, fnAutoScroll, fnAutoTurnPage, mousedown, mousemove, mouseup} = useScroll(dPage, dLayouts)
// 长页需调整展示比例
setTimeout(() => {
  console.log(page_type)
  if(dPage.value.page_type === 'longPage') {
      console.log(dZoom.value)
      dZoom.value = dZoom.value * 10
      console.log(dZoom.value)
  }
}, 1000);
let _srcCache: string | null = ''
onMounted(() => {
  console.log(dLayouts);
  getScreen()
  // 是否开启了自动滚动
  // if(autoScroll.value){
  //   setTimeout(() => {
  //     fnAutoTurnPage()
  //   }, 3000);
  // }
})
 
function getScreen() {
  const pageDesignEl = document.getElementById('page-design')
  if (!pageDesignEl) return
  canvasStore.updateScreen({
    width: pageDesignEl.offsetWidth,
    height: pageDesignEl.offsetHeight,
  })
}

function getChilds(uuid: string) {
  return dWidgets.value.filter((item) => item.parent === uuid)
}
// 配置动画方法
function animationConfig(layer) {
  const res = layer.transition || ''; // 获取动画的配置
  if(!res) return ''; 
  const list = [
    res?.animate ? 'animate__animated' : '', 
    res?.animate ? 'animate__' + res.animate : '',
    res?.delay ? 'animate__delay-'+ res.delay +'s' : '', 
    res?.speed ? 'animate__' + res.speed : '',
    // 判断是否预览，预览只循环展示一次，不是预览的话判断是否设置了循环，设置了的话判断循环次数并添加对应次数，否则无限循环
    res?.isPreview ? 'animate__repeat-1' : (res?.isRepeat ? (res.repeatTime ? 'animate__repeat-' + res.repeatTime : 'animate__infinite') : ''),
  ]
 return list.join(' ');
}


</script>

<style lang="less" scoped>
#main {
  overflow: auto;
  position: relative;
}
#page-design {
  scrollbar-width: none;
  min-height: 100%;
  overflow: auto;
  position: relative;
  // width: 100%;
  .out-page {
    scrollbar-width: none;
    margin: 0 auto;
    // padding: 60px;
    position: relative;
    height: calc(100vh - 25px);
    overflow-y: auto;
    .design-canvas {
      // transition: all 0.3s;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
      position: relative;
      // animation: slideIn ease 100s forwards;
      scroll-snap-type: y mandatory;
      animation: scrollTo 2s forwards;
      // z-index: -9999;
      // overflow: hidden;
      // overflow: auto;
    }
    // @keyframes slideIn {
    //     0%{
    //         margin-top: 0;
    //     }
    //     100%{
    //       margin-top: calc(-100%);
    //     }
    // }
    @keyframes scrollTo {
    0% {
      // opacity: 0;
      scroll-snap-align: start;
    }
    100% {
      // opacity: 1;
      scroll-snap-align: end;
    }
  }
  }
}
.main-preview{
  .out-page{
    margin: unset !important;
  }
}
.pageItem{
  height: 100%;
  position: relative;
}
</style>
