<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-10 23:02:46
 * @Description: 主画布
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 11:34:08
-->
<template>
  <div id="main">
    <div id="page-design" ref="page_design" :style="{ paddingTop: dPaddingTop + 'px', minWidth: (dPage.width * dZoom) / 100 + dPresetPadding * 2 + 'px' }">
      <div
        id="out-page"
        class="out-page"
        :style="{
          padding: dPresetPadding + 'px',
          width: (dPage.width * dZoom) / 100 + dPresetPadding * 2 + 'px',
          height: (dPage.height * dZoom) / 100 + dPresetPadding * 2 + 'px',
          opacity: 1 - (dZoom < 100 ? dPage.tag : 0),
        }"
      >
        <slot />
        <resize-page :width="(dPage.width * dZoom) / 100" :height="(dPage.height * dZoom) / 100" />
        <watermark :customStyle="{ height: (dPage.height * dZoom) / 100 + 'px' }">
          <div
            :id="pageDesignCanvasId"
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
            <component :is="layer.type" v-for="layer in getlayers()" :id="layer.uuid" :key="layer.uuid" :class="['layer', { 'layer-hover': layer.uuid === dHoverUuid || dActiveElement?.parent === layer.uuid, 'layer-no-hover': dActiveElement?.uuid === layer.uuid }, animationConfig(layer)]" :data-title="layer.type" :params="layer" :parent="dPage" :data-type="layer.type" :data-uuid="layer.uuid">
              <template v-if="layer.isContainer">
                <!-- :class="{
                  layer: true,
                  'layer-active': getIsActive(widget.uuid),
                  'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent,
                  'layer-hover': widget.uuid === dHoverUuid,
                }" -->
                <component :is="widget.type" v-for="widget in getChilds(layer.uuid)" :key="widget.uuid" child :class="['layer', { 'layer-no-hover': dActiveElement?.uuid !== widget.parent && dActiveElement?.parent !== widget.parent }]" :data-title="widget.type" :params="widget" :parent="layer" :data-type="widget.type" :data-uuid="widget.uuid" />
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
import { onMounted } from 'vue'
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
const { dZoom, dPresetPadding, dPaddingTop, dScreen } = storeToRefs(canvasStore)
const { dDraging, showRotatable, dAltDown, dSpaceDown } = storeToRefs(controlStore)
const { dWidgets, dActiveElement, dSelectWidgets, dHoverUuid } = storeToRefs(widgetStore)

let _dropIn: string | null = ''
let _srcCache: string | null = ''

onMounted(() => {
  console.log(dPage);
  
  getScreen()
  const pageDesignEl = document.getElementById('page-design')
  console.log(pageDesignEl);
  
  if (!pageDesignEl) return
  pageDesignEl.addEventListener('mousedown', handleSelection, false)
  pageDesignEl.addEventListener('mousemove', debounce(100, false, handleMouseMove), false)
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
        console.log('加入+', widget)

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
    console.log(setting)
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
    margin: 0 auto;
    // padding: 60px;
    position: relative;
    .design-canvas {
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
.main-preview{
  pointer-events: none !important;
  .out-page{
    margin: unset !important;
  }
}
</style>
