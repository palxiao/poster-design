<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-10 23:02:46
 * @Description: 主画布
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-12-28 14:12:33
-->
<template>
  <div id="main">
    <div id="page-design" ref="page_design" :style="{ paddingTop: dPaddingTop + 'px', minWidth:  (dPage.width * dZoom) / 100 + (padding ?? dPresetPadding) * 2 + 'px' }">
      <div
        id="out-page"
        class="out-page"
        :style="{
          padding: padding ?? dPresetPadding + 'px',
          width: (dPage.width * dZoom) / 100 + (padding ?? dPresetPadding) * 2 + 'px',
          height: (dPage.height * dZoom) / 100 + (padding ?? dPresetPadding) * 2 + 'px',
          opacity: 1 - (dZoom < 100 ? dPage.tag : 0),
        }"
      >
        <slot />
        <resize-page v-if="needTools" :width="(dPage.width * dZoom) / 100" :height="(dPage.height * dZoom) / 100" />
        <watermark :customStyle="{ height: (dPage.height * dZoom) / 100 + 'px' }">
          <div
            :id="props.pageDesignCanvasId"
            class="design-canvas"
            :data-type="dPage.type"
            :data-uuid="dPage.uuid"
            :style="{
              width: dPage.width + 'px',
              height: dPage.height + 'px',
              transform: 'scale(' + dZoom / 100 + ')',
              transformOrigin: (dZoom >= 100 ? 'center' : 'left') + ' top',
              backgroundColor: dPage.backgroundGradient ? undefined : dPage.backgroundColor,
              backgroundImage: dPage.backgroundImage ? `url(${dPage?.backgroundImage})` : dPage.backgroundGradient || undefined,
              backgroundSize: dPage.backgroundTransform?.x ? 'auto' : 'cover',
              backgroundPositionX: (dPage.backgroundTransform?.x || 0) + 'px',
              backgroundPositionY: (dPage.backgroundTransform?.y || 0) + 'px',
              opacity: dPage.opacity + (dZoom < 100 ? dPage.tag : 0),
            }"
            @mousemove="dropOver($event)"
            @drop="drop($event)"
            @mouseup="drop($event)"
          >
            <!-- <grid-size /> -->
            <component :is="layer.type" v-for="layer in getlayers()" :id="layer.uuid" :key="layer.uuid" :class="[{ 'layer':needTools }, { 'layer-hover': layer.uuid === dHoverUuid || dActiveElement?.parent === layer.uuid, 'layer-no-hover': dActiveElement?.uuid === layer.uuid }]" :data-title="layer.type" :params="layer" :parent="dPage" :data-type="layer.type" :data-uuid="layer.uuid">
              <template v-if="layer.isContainer">
                <!-- :class="{
                  layer: true,
                  'layer-active': getIsActive(widget.uuid),
                  'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent,
                  'layer-hover': widget.uuid === dHoverUuid,
                }" -->
                <component :is="widget.type" v-for="widget in getChilds(layer.uuid)" :key="widget.uuid" child :class="[{ 'layer':needTools }, { 'layer-no-hover': dActiveElement?.uuid !== widget.parent && dActiveElement?.parent !== widget.parent }]" :data-title="widget.type" :params="widget" :parent="layer" :data-type="widget.type" :data-uuid="widget.uuid" />
              </template>
            </component>

            <!-- <ref-line v-if="dSelectWidgets.length === 0" /> -->
            <!-- <size-control v-if="dSelectWidgets.length === 0" /> -->
          </div>
        </watermark>
      </div>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { getTarget } from '@/common/methods/target'
import setWidgetData from '@/common/methods/DesignFeatures/setWidgetData'
import PointImg from '@/utils/plugins/pointImg'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import { debounce } from 'throttle-debounce'
import { move, moveInit } from '@/mixins/move'
import { useCanvasStore, useControlStore, useWidgetStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TPageState } from '@/store/design/canvas/d'
import resizePage from './comps/resize.vue'
import watermark from './comps/pageWatermark.vue'
import { TdWidgetData } from '@/store/design/widget'
import { useRoute } from 'vue-router'
const route = useRoute()

// 页面设计组件
type TProps = {
  pageDesignCanvasId: string
  /** 以下参数仅用于图片渲染html */
  padding?: number
  /** 用于生成渲染图片 */
  renderDPage?: TPageState
  renderDWdigets?: TdWidgetData[]
  zoom?: number
}

type TParentData = {
  width?: number
  height?: number
}

type TSetting = Partial<TPageState>

const controlStore = useControlStore()
const widgetStore = useWidgetStore()
const canvasStore = useCanvasStore()

const props = defineProps<TProps>()

const needTools = computed(() => route.name !== 'Draw' && route.name !== 'Html')
const { dPage: curDPage } = storeToRefs(useCanvasStore())
const { dZoom: curZoom, dPresetPadding, dPaddingTop, dScreen } = storeToRefs(canvasStore)
const { dDraging, showRotatable, dAltDown, dSpaceDown } = storeToRefs(controlStore)
const { dWidgets: curWidgets, dActiveElement, dSelectWidgets, dHoverUuid } = storeToRefs(widgetStore)

const dPage = computed(() => props.renderDPage ?? curDPage.value)
const dWidgets = computed(() => props.renderDWdigets ?? curWidgets.value)
const dZoom = computed(() => props.zoom ?? curZoom.value)

let _dropIn: string | null = ''
let _srcCache: string | null = ''

onMounted(() => {
  getScreen()
  const pageDesignEl = document.getElementById('page-design')
  if (!pageDesignEl) return
  pageDesignEl.addEventListener('mousedown', handleSelection, false)
  // pageDesignEl.addEventListener('mousemove', debounce(100, false, handleMouseMove), false)
  // 绑定空格事件
  const scrollContainer: any = document.querySelector('#main')
  const dragContainer: any = pageDesignEl
  dragContainer.onmousedown = (e: any) => {
    let mouseDownScrollPosition = {
      scrollLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
    }
    let mouseDownPoint = {
      x: e.clientX,
      y: e.clientY,
    }
    dragContainer.onmousemove = (e: any) => {
      if (!dSpaceDown.value) return
      let dragMoveDiff = {
        x: mouseDownPoint.x - e.clientX,
        y: mouseDownPoint.y - e.clientY,
      }
      scrollContainer.scrollLeft = mouseDownScrollPosition.scrollLeft + dragMoveDiff.x
      scrollContainer.scrollTop = mouseDownScrollPosition.scrollTop + dragMoveDiff.y
    }
    document.onmouseup = (e) => {
      dragContainer.onmousemove = null
      document.onmouseup = null
    }
  }
})

// components: {lineGuides},
// mixins: [moveInit],
// ...mapActions(['updateScreen', 'selectWidget', 'deleteWidget', 'addWidget', 'addGroup']),

// getBackground(data) {
//   if (data.startsWith('http')) return `url(${data})`
//   if (data.startsWith('linear-gradient')) return data
// },

async function dropOver(e: MouseEvent) {
  if (!dActiveElement.value) return
  if (dActiveElement.value.editable || dActiveElement.value.lock) {
    return false
  }
  e.preventDefault()
  let { data, type } = widgetStore.selectItem
  if (!data) return
  if (type !== 'image') {
    return
  }
  if (!e || !e.target) return
  const eventTarget = e.target as HTMLElement
  const target = await getTarget(eventTarget)
  if (!target) return
  const uuid = target.getAttribute('data-uuid')

  widgetStore.setDropOver(uuid ?? '-1')
  // store.dispatch('setDropOver', uuid)

  const imgEl = target?.firstElementChild?.firstElementChild as HTMLImageElement
  if (eventTarget.getAttribute('putIn')) {
    _dropIn = uuid
    const imgUrl = data.value.thumb || data.value.url
    !_srcCache && (_srcCache = imgEl.src)
    imgEl.src = imgUrl
  } else {
    _srcCache && (imgEl.src = _srcCache)
    _srcCache = ''
    _dropIn = ''
  }
}

async function drop(e: MouseEvent) {
  if (!dDraging.value) {
    return
  }
  if (!e || !e.target) return
  const eventTarget = e.target as HTMLElement

  controlStore.setDraging(false)
  // store.commit('setDraging', false)

  const dropIn = _dropIn
  _dropIn = ''

  widgetStore.setDropOver('-1')
  // store.dispatch('setDropOver', '-1')

  // store.commit('setShowMoveable', false) // 清理上一次的选择
  controlStore.setShowMoveable(false) // 清理上一次的选择

  let lost = eventTarget.className !== 'design-canvas' // className === 'design-canvas' , id: "page-design-canvas"
  // e.stopPropagation()
  e.preventDefault()
  let { data: item, type } = JSON.parse(JSON.stringify(widgetStore.selectItem))
  // 清除临时数据
  widgetStore.setSelectItem({})
  // store.commit('selectItem', {})

  let setting: TSetting = {}
  if (!type) {
    return
  }
  // 处理数据
  setting = await setWidgetData(type, item, setting)
  // 绝对坐标
  const canvasEl = document.getElementById('page-design-canvas')
  if (!canvasEl) return
  const lostX = e.x - canvasEl.getBoundingClientRect().left
  const lostY = e.y - canvasEl.getBoundingClientRect().top
  // 放置组合
  if (type === 'group') {
    let parent: TParentData = {}
    const componentItem = await getComponentsData(item)
    // item = await getComponentsData(item)
    componentItem.forEach((element) => {
      if (element.type === 'w-group') {
        parent.width = element.width
        parent.height = element.height
      }
    })
    const half = {
      x: parent.width ? (parent.width * dZoom.value) / 100 / 2 : 0,
      y: parent.height ? (parent.height * dZoom.value) / 100 / 2 : 0,
    }
    componentItem.forEach((element) => {
      element.left += (lost ? lostX - half.x : e.layerX - half.x) * (100 / dZoom.value)
      element.top += (lost ? lostY - half.y : e.layerY - half.y) * (100 / dZoom.value)
    })
    widgetStore.addGroup(componentItem)
    // store.dispatch('addGroup', componentItem)
    // addGroup(item)
  }
  // 设置坐标
  const half = {
    x: setting.width ? (setting.width * dZoom.value) / 100 / 2 : 0,
    y: setting.height ? (setting.height * dZoom.value) / 100 / 2 : 0,
  }
  // const half = { x: (this.dDragInitData.offsetX * this.dZoom) / 100, y: (this.dDragInitData.offsetY * this.dZoom) / 100 }
  setting.left = (lost ? lostX - half.x : e.layerX - half.x) * (100 / dZoom.value)
  setting.top = (lost ? lostY - half.y : e.layerY - half.y) * (100 / dZoom.value)
  if (lost && type === 'image') {
    // 如果不从画布加入，且不是图片类型，则判断是否加入到svg中
    const target = await getTarget(eventTarget)
    if (!target) return
    const targetType = target.getAttribute('data-type')
    const uuid = target.getAttribute('data-uuid')
    if (targetType === 'w-mask') {
      // 容器
      // store.commit('setShowMoveable', true) // 恢复选择
      controlStore.setShowMoveable(true) // 恢复选择

      const widget = dWidgets.value.find((item: { uuid: string }) => item.uuid === uuid)
      if (!widget) return
      widget.imgUrl = item.value.url
      // if (e.target.className.baseVal) {
      //   !widget.imgs && (widget.imgs = {})
      //   widget.imgs[`${e.target.className.baseVal}`] = item.value.url
      // }
    } else {
      if (dropIn) {
        const widget = dWidgets.value.find((item: { uuid: string }) => item.uuid == dropIn)
        if (!widget) return
        widget.imgUrl = item.value.url
        // store.commit('setShowMoveable', true) // 恢复选择
        controlStore.setShowMoveable(true) // 恢复选择
      } else {
        widgetStore.addWidget(setting as Required<TPageState>)
        // store.dispatch('addWidget', setting) // 正常加入面板
      }
    }
  } else if (type === 'bg') {
    console.log('背景图片放置')
  } else if (type !== 'group') {
    widgetStore.addWidget(setting as Required<TPageState>)
    // store.dispatch('addWidget', setting) // 正常加入面板
  }
  // 清除临时数据
  // this.$store.commit('selectItem', {})
}

function getScreen() {
  const pageDesignEl = document.getElementById('page-design')
  if (!pageDesignEl) return
  canvasStore.updateScreen({
    width: pageDesignEl.offsetWidth,
    height: pageDesignEl.offsetHeight,
  })
  // store.dispatch('updateScreen', {
  //   width: pageDesignEl.offsetWidth,
  //   height: pageDesignEl.offsetHeight,
  // })
}

async function handleMouseMove(e: MouseEvent) {
  if (!e || !e.target) return
  const imageTarget = e.target as HTMLImageElement
  const pImg = new PointImg(imageTarget)
  const { rgba } = pImg.getColorXY(e.offsetX, e.offsetY)
  if (rgba && rgba === 'rgba(0,0,0,0)') {
    console.log('解析点位颜色: ', rgba)
    let target = await getTarget(imageTarget)
    if (!target) return
    target.style.pointerEvents = 'none'
    setTimeout(() => {
      if (!target) return
      target.style.pointerEvents = 'auto'
    }, 300)
  }
}

async function handleSelection(e: MouseEvent) {
  if (e.which === 3) {
    return
  }
  if (!e || !e.target) return
  let target = await getTarget(e.target as HTMLElement)
  if (!target) return
  let type = target.getAttribute('data-type')

  if (type) {
    let uuid = target.getAttribute('data-uuid')
    if (uuid !== '-1' && !dAltDown.value) {
      let widget = dWidgets.value.find((item: { uuid: string }) => item.uuid === uuid)
      if (!widget || !dActiveElement.value) return
      if (widget.parent !== '-1' && widget.parent !== dActiveElement.value.uuid && widget.parent !== dActiveElement.value.parent) {
        uuid = widget.parent || null
      }
    }

    // 设置选中元素
    // this.$store.commit('setMoveable', false)
    if (showRotatable.value !== false) {
      widgetStore.selectWidget({
        uuid: uuid ?? ' -1',
      })
      // store.dispatch('selectWidget', {
      //   uuid: uuid,
      // })
    }

    if (uuid !== '-1') {
      moveInit.methods.initmovement(e) // 参见 mixins
    }
  } else {
    // 取消选中元素
    widgetStore.selectWidget({
      uuid: '-1',
    })
    // store.dispatch('selectWidget', {
    //   uuid: '-1',
    // })
  }
}

function getlayers() {
  return dWidgets.value.filter((item) => item.parent === dPage.value.uuid)
}

function getChilds(uuid: string) {
  return dWidgets.value.filter((item) => item.parent === uuid)
}
// getIsActive(uuid) {
//   if (this.dSelectWidgets.length > 0) {
//     let widget = this.dSelectWidgets.find((item) => item.uuid === uuid)
//     if (widget) {
//       return true
//     }
//     return false
//   } else {
//     return uuid === this.dActiveElement.uuid
//   }
// },
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
    margin: 0 auto;
    // padding: 60px;
    position: relative;
    .design-canvas {
      // 解决拖拽残影问题
      outline: 1px solid transparent;
      // transition: all 0.3s;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
      position: relative;
      // z-index: -9999;
      // overflow: hidden;
      // overflow: auto;
    }
    // .design-canvas ::-webkit-scrollbar {
    //   display: none; /* Chrome Safari */
    // }
  }
}
</style>
