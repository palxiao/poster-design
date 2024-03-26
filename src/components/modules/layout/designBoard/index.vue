<template>
  <div id="main">
    <div id="page-design" ref="page_design" :style="{ paddingTop: dPaddingTop + 'px', minWidth: (dPage.width * dZoom) / 100 + 120 + 'px' }" >
      <div
        id="out-page"
        class="out-page"
        :style="{
          width: (dPage.width * dZoom) / 100 + 120 + 'px',
          height: (dPage.height * dZoom) / 100 + 120 + 'px',
          opacity: 1 - (dZoom < 100 ? dPage.tag : 0),
        }"
      >
        <slot />
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
            backgroundColor: dPage.backgroundColor,
            backgroundImage: `url(${dPage?.backgroundImage})`,
            backgroundSize: dPage?.backgroundTransform?.x ? 'auto' : 'cover',
            backgroundPositionX: (dPage?.backgroundTransform?.x || 0) + 'px',
            backgroundPositionY: (dPage?.backgroundTransform?.y || 0) + 'px',
            opacity: dPage.opacity + (dZoom < 100 ? dPage.tag : 0),
          }"
          @mousemove="dropOver($event)"
          @drop="drop($event)"
          @mouseup="drop($event)"
        >
          <!-- <grid-size /> -->

          <!-- :class="{
              layer: true,
              'layer-active': getIsActive(layer.uuid),
              'layer-hover': layer.uuid === dHoverUuid || dActiveElement.parent === layer.uuid,
            }" -->
          <component :is="layer.type" v-for="layer in getlayers()" :id="layer.uuid" :key="layer.uuid" :class="['layer', { 'layer-hover': layer.uuid === dHoverUuid || dActiveElement.parent === layer.uuid, 'layer-no-hover': dActiveElement.uuid === layer.uuid }]" :data-title="layer.type" :params="layer" :parent="dPage" :data-type="layer.type" :data-uuid="layer.uuid">
            <template v-if="layer.isContainer">
              <!-- :class="{
                  layer: true,
                  'layer-active': getIsActive(widget.uuid),
                  'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent,
                  'layer-hover': widget.uuid === dHoverUuid,
                }" -->
              <component :is="widget.type" v-for="widget in getChilds(layer.uuid)" :key="widget.uuid" child :class="['layer', { 'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent }]" :data-title="widget.type" :params="widget" :parent="layer" :data-type="widget.type" :data-uuid="widget.uuid" />
            </template>
          </component>

          <!-- <ref-line v-if="dSelectWidgets.length === 0" /> -->
          <!-- <size-control v-if="dSelectWidgets.length === 0" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
import { getTarget } from '@/common/methods/target'
// import { ElScrollbar } from 'element-plus'
import setWidgetData from '@/common/methods/DesignFeatures/setWidgetData'
import PointImg from '@/utils/plugins/pointImg'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import { debounce } from 'throttle-debounce'
import { move, moveInit } from '@/mixins/move'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { useCanvasStore, useControlStore, usePageStore } from '@/pinia'
import { storeToRefs } from 'pinia'
// 页面设计组件
type TProps = {
  pageDesignCanvasId: string
}

type TParentData = {
  width?: number
  height?: number
}

type TSetting = {
  width?: number
  height?: number
  top?: number
  left?: number
}

const store = useStore()
const controlStore = useControlStore()
const { pageDesignCanvasId } = defineProps<TProps>()
const {
  dWidgets,
  dActiveElement, dSelectWidgets, dAltDown,
  dHoverUuid
} = useSetupMapGetters(['dWidgets', 'dActiveElement', 'dHoverUuid', 'dSelectWidgets', 'dAltDown'])
const { dPage } = storeToRefs(usePageStore())
const { dZoom, dPaddingTop, dScreen } = storeToRefs(useCanvasStore())
const { dDraging, showRotatable } = storeToRefs(useControlStore())


let _dropIn: string | null = ''
let _srcCache: string | null = ''

onMounted(() => {
  getScreen()
  const pageDesignEl = document.getElementById('page-design')
  if (!pageDesignEl) return
  pageDesignEl.addEventListener('mousedown', handleSelection, false)
  pageDesignEl.addEventListener('mousemove', debounce(100, false, handleMouseMove), false)
})

  // components: {lineGuides},
  // mixins: [moveInit],
    // ...mapActions(['updateScreen', 'selectWidget', 'deleteWidget', 'addWidget', 'addGroup']),

    // getBackground(data) {
    //   if (data.startsWith('http')) return `url(${data})`
    //   if (data.startsWith('linear-gradient')) return data
    // },

async function dropOver(e: MouseEvent) {
  if (dActiveElement.value.editable || dActiveElement.value.lock) {
    return false
  }
  e.preventDefault()
  let { data, type } = store.getters.selectItem
  if (type !== 'image') {
    return
  }
  if (!e || !e.target) return
  const eventTarget = e.target as HTMLElement
  const target = await getTarget(eventTarget)
  if (!target) return
  const uuid = target.getAttribute('data-uuid')
  store.dispatch('setDropOver', uuid)

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
  store.commit('setDraging', false)
  const dropIn = _dropIn
  _dropIn = ''
  store.dispatch('setDropOver', '-1')

  // store.commit('setShowMoveable', false) // 清理上一次的选择
  controlStore.setShowMoveable(false) // 清理上一次的选择

  let lost = eventTarget.className !== 'design-canvas' // className === 'design-canvas' , id: "page-design-canvas"
  // e.stopPropagation()
  e.preventDefault()
  let { data: item, type } = JSON.parse(JSON.stringify(store.getters.selectItem))
  // 清除临时数据
  store.commit('selectItem', {})
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
      y: parent.height ? (parent.height * dZoom.value) / 100 / 2 : 0
    }
    componentItem.forEach((element) => {
      element.left += (lost ? lostX - half.x : e.layerX - half.x) * (100 / dZoom.value)
      element.top += (lost ? lostY - half.y : e.layerY - half.y) * (100 / dZoom.value)
    })
    store.dispatch('addGroup', componentItem)
    // addGroup(item)
  }
  // 设置坐标
  const half = { 
    x: setting.width ? (setting.width * dZoom.value) / 100 / 2 : 0,
    y: setting.height ? (setting.height * dZoom.value) / 100 / 2 : 0
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

      const widget = dWidgets.value.find((item: {uuid: string}) => item.uuid === uuid)
      widget.imgUrl = item.value.url
      // if (e.target.className.baseVal) {
      //   !widget.imgs && (widget.imgs = {})
      //   widget.imgs[`${e.target.className.baseVal}`] = item.value.url
      // }
    } else {
      if (dropIn) {
        const widget = dWidgets.value.find((item: {uuid: string}) => item.uuid == dropIn)
        widget.imgUrl = item.value.url
        console.log('加入+', widget)

        // store.commit('setShowMoveable', true) // 恢复选择
        controlStore.setShowMoveable(true) // 恢复选择

      } else {
        store.dispatch('addWidget', setting) // 正常加入面板
        // addWidget(setting) // 正常加入面板
      }
    }
  } else if (type === 'bg') {
    console.log('背景图片放置')
  } else if (type !== 'group') {
    console.log(setting)
    store.dispatch('addWidget', setting) // 正常加入面板
    // addWidget(setting) // 正常加入面板
  }
  // 清除临时数据
  // this.$store.commit('selectItem', {})
}

function getScreen() {
  const pageDesignEl = document.getElementById('page-design')
  if (!pageDesignEl) return
  store.dispatch('updateScreen', {
    width: pageDesignEl.offsetWidth,
    height: pageDesignEl.offsetHeight,
  })
  // updateScreen({
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
      let widget = dWidgets.value.find((item: {uuid: string}) => item.uuid === uuid)
      if (widget.parent !== '-1' && widget.parent !== dActiveElement.value.uuid && widget.parent !== dActiveElement.value.parent) {
        uuid = widget.parent
      }
    }

    // 设置选中元素
    // this.$store.commit('setMoveable', false)
    if (showRotatable.value !== false) {
      store.dispatch('selectWidget', {
        uuid: uuid,
      })
      // selectWidget({
      //   uuid: uuid,
      // })
    }

    if (uuid !== '-1') {
      moveInit.methods.initmovement(e) // 参见 mixins
    }
  } else {
    // 取消选中元素
    store.dispatch('selectWidget', {
      uuid: '-1',
    })
    // selectWidget({
    //   uuid: '-1',
    // })
  }
}

function getlayers() {
  return dWidgets.value.filter((item: { parent: string }) => item.parent === dPage.value.uuid)
}

function getChilds(uuid: string) {
  return dWidgets.value.filter((item: { parent: string }) => item.parent === uuid)
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
  overflow: auto; position: relative;
}
#page-design {
  scrollbar-width: none;
  min-height: 100%;
  // display: flex;
  // align-items: center;
  overflow: auto;
  position: relative;
  // width: 100%;
  .out-page {
    margin: 0 auto;
    padding: 60px;
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
</style>
