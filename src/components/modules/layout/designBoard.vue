<template>
  <div id="page-design" ref="page-design" :style="{ paddingTop: dPaddingTop + 'px' }">
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
</template>

<script>
import { defineComponent, nextTick } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { getTarget } from '@/common/methods/target'

import setWidgetData from '@/common/methods/DesignFeatures/setWidgetData'
import PointImg from '@/utils/plugins/pointImg'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import { debounce } from 'throttle-debounce'

// 页面设计组件
const NAME = 'page-design'

import { move, moveInit } from '@/mixins/move'

export default defineComponent({
  name: NAME,
  // components: {lineGuides},
  mixins: [moveInit],
  props: ['pageDesignCanvasId'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['dPaddingTop', 'dPage', 'dZoom', 'dScreen', 'dWidgets', 'dActiveElement', 'dHoverUuid', 'dSelectWidgets', 'dAltDown', 'dDraging', 'showRotatable']),
  },
  mounted() {
    this.getScreen()
    document.getElementById('page-design').addEventListener('mousedown', this.handleSelection, false)
    document.getElementById('page-design').addEventListener('mousemove', debounce(100, false, this.handleMouseMove), false)
  },
  beforeUnmount() {},
  methods: {
    ...mapActions(['updateScreen', 'selectWidget', 'deleteWidget', 'addWidget', 'addGroup']),
    async dropOver(e) {
      if (this.dActiveElement.editable || this.dActiveElement.lock) {
        return false
      }
      e.preventDefault()
      let { data, type } = this.$store.getters.selectItem
      if (type !== 'image') {
        return
      }
      const target = await getTarget(e.target)
      const uuid = target.getAttribute('data-uuid')
      this.$store.dispatch('setDropOver', uuid)
      if (e.target.getAttribute('putIn')) {
        this._dropIn = uuid
        const imgUrl = data.value.thumb || data.value.url
        !this._srcCache && (this._srcCache = target.firstElementChild.firstElementChild.src)
        target.firstElementChild.firstElementChild.src = imgUrl
      } else {
        this._srcCache && (target.firstElementChild.firstElementChild.src = this._srcCache)
        this._srcCache = ''
        this._dropIn = ''
      }
    },
    async drop(e) {
      if (!this.dDraging) {
        return
      }
      this.$store.commit('setDraging', false)
      const dropIn = this._dropIn
      this._dropIn = ''
      this.$store.dispatch('setDropOver', '-1')
      this.$store.commit('setShowMoveable', false) // 清理上一次的选择
      let lost = e.target.className !== 'design-canvas' // className === 'design-canvas' , id: "page-design-canvas"
      // e.stopPropagation()
      e.preventDefault()
      let { data: item, type } = JSON.parse(JSON.stringify(this.$store.getters.selectItem))
      // 清除临时数据
      this.$store.commit('selectItem', {})
      let setting = {}
      if (!type) {
        return
      }
      // 处理数据
      setting = await setWidgetData(type, item, setting)
      // 绝对坐标
      const lostX = e.x - document.getElementById('page-design-canvas').getBoundingClientRect().left
      const lostY = e.y - document.getElementById('page-design-canvas').getBoundingClientRect().top
      // 放置组合
      if (type === 'group') {
        let parent = {}
        item = await getComponentsData(item)
        item.forEach((element) => {
          if (element.type === 'w-group') {
            parent.width = element.width
            parent.height = element.height
          }
        })
        const half = { x: parent.width ? (parent.width * this.$store.getters.dZoom) / 100 / 2 : 0, y: parent.height ? (parent.height * this.$store.getters.dZoom) / 100 / 2 : 0 }
        item.forEach((element) => {
          element.left += (lost ? lostX - half.x : e.layerX - half.x) * (100 / this.$store.getters.dZoom)
          element.top += (lost ? lostY - half.y : e.layerY - half.y) * (100 / this.$store.getters.dZoom)
        })
        this.addGroup(item)
      }
      // 设置坐标
      const half = { x: setting.width ? (setting.width * this.$store.getters.dZoom) / 100 / 2 : 0, y: setting.height ? (setting.height * this.$store.getters.dZoom) / 100 / 2 : 0 }
      // const half = { x: (this.dDragInitData.offsetX * this.dZoom) / 100, y: (this.dDragInitData.offsetY * this.dZoom) / 100 }
      setting.left = (lost ? lostX - half.x : e.layerX - half.x) * (100 / this.$store.getters.dZoom)
      setting.top = (lost ? lostY - half.y : e.layerY - half.y) * (100 / this.$store.getters.dZoom)
      if (lost && type === 'image') {
        // 如果不从画布加入，且不是图片类型，则判断是否加入到svg中
        const target = await getTarget(e.target)
        const targetType = target.getAttribute('data-type')
        const uuid = target.getAttribute('data-uuid')
        if (targetType === 'w-mask') {
          // 容器
          this.$store.commit('setShowMoveable', true) // 恢复选择
          const widget = this.dWidgets.find((item) => item.uuid === uuid)
          widget.imgUrl = item.value.url
          // if (e.target.className.baseVal) {
          //   !widget.imgs && (widget.imgs = {})
          //   widget.imgs[`${e.target.className.baseVal}`] = item.value.url
          // }
        } else {
          if (dropIn) {
            const widget = this.dWidgets.find((item) => item.uuid == dropIn)
            widget.imgUrl = item.value.url
            console.log('加入+', widget)
            this.$store.commit('setShowMoveable', true) // 恢复选择
          } else {
            this.addWidget(setting) // 正常加入面板
          }
        }
      } else if (type === 'bg') {
        console.log('背景图片放置')
      } else if (type !== 'group') {
        console.log(setting)
        this.addWidget(setting) // 正常加入面板
      }
      // 清除临时数据
      // this.$store.commit('selectItem', {})
    },
    getScreen() {
      let screen = this.$refs['page-design']
      this.updateScreen({
        width: screen.offsetWidth,
        height: screen.offsetHeight,
      })
    },
    async handleMouseMove(e) {
      const pImg = new PointImg(e.target)
      const { rgba } = pImg.getColorXY(e.offsetX, e.offsetY)
      if (rgba && rgba === 'rgba(0,0,0,0)') {
        console.log('解析点位颜色: ', rgba)
        let target = await getTarget(e.target)
        target.style.pointerEvents = 'none'
        setTimeout(() => {
          target.style.pointerEvents = 'auto'
        }, 300)
      }
    },
    async handleSelection(e) {
      if (e.which === 3) {
        return
      }

      let target = await getTarget(e.target)
      let type = target.getAttribute('data-type')

      if (type) {
        let uuid = target.getAttribute('data-uuid')
        if (uuid !== '-1' && !this.dAltDown) {
          let widget = this.dWidgets.find((item) => item.uuid === uuid)
          if (widget.parent !== '-1' && widget.parent !== this.dActiveElement.uuid && widget.parent !== this.dActiveElement.parent) {
            uuid = widget.parent
          }
        }

        // 设置选中元素
        // this.$store.commit('setMoveable', false)
        if (this.showRotatable !== false) {
          this.selectWidget({
            uuid: uuid,
          })
        }

        if (uuid !== '-1') {
          this.initmovement && this.initmovement(e) // 参见 mixins
        }
      } else {
        // 取消选中元素
        this.selectWidget({
          uuid: '-1',
        })
      }
    },
    getlayers() {
      return this.dWidgets.filter((item) => item.parent === this.dPage.uuid)
    },
    getChilds(uuid) {
      return this.dWidgets.filter((item) => item.parent === uuid)
    },
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
  },
})
</script>

<style lang="less" scoped>
#page-design {
  height: 100%;
  // display: flex;
  // align-items: center;
  overflow: auto;
  position: relative;
  width: 100%;
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
