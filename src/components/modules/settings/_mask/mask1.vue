<template>
  <div
    :id="params.uuid"
    ref="widget"
    class="w-svg"
    :style="{
      position,
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <!-- <div v-for="(img, i) in params.imgs" v-show="cropEdit" :key="i" :ref="params.uuid + '_ebox_' + i" :style="editBoxs[i]" class="svg__edit__wrap">
      <img :img-key="i" class="edit__model" :src="img" />
    </div> -->
    <div v-show="cropEdit" :ref="params.uuid + '_ebox'" :style="editBoxStyle" class="svg__edit__wrap">
      <img class="edit__model" :src="params.imgUrl" />
    </div>
  </div>
</template>

<script>
// svg
const NAME = 'w-svg'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  setting: {
    name: '图片容器',
    type: NAME,
    uuid: -1,
    width: 300,
    height: 300,
    left: 0,
    top: 0,
    zoom: 1.5,
    transform: '',
    radius: 0,
    opacity: 1,
    parent: '-1',
    svgUrl: '',
    setting: [],
    record: {
      width: 0,
      height: 0,
      minWidth: 10,
      minHeight: 10,
      dir: 'all',
    },
  },
  props: ['params', 'parent'],
  data() {
    return {
      position: 'absolute', // 'absolute'relative
      editBoxStyle: {
        transformOrigin: 'center',
      },
      editBoxs: {},
      editingKey: '',
      cropWidgetXY: {}, // 裁剪框移动作用
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dZoom', 'dMouseXY']),
    tZoom() {
      return this.params.zoom
    },
    cropEdit() {
      return this.params.cropEdit
    },
    imgChange() {
      return this.params.imgUrl
    },
  },
  watch: {
    async tZoom() {
      await this.$nextTick()
      this.updateRecord()
    },
    imgChange() {
      // TODO 更新所有图片
      this.svgImg.attr({
        'xlink:href': this.params.imgUrl,
      })
    },
    cropEdit(val) {
      // TODO 移动事件绑定
      if (val) {
        document.getElementById(this.params.uuid).addEventListener('mousedown', this.touchstart, false)
      } else {
        document.getElementById(this.params.uuid).removeEventListener('mousedown', this.touchstart, false)
      }
    },
  },
  updated() {
    this.updateRecord()
  },
  async mounted() {
    await this.$nextTick()
    await this.loadSvg()
    this.updateRecord()
    // document.getElementById(this.params.uuid).addEventListener('mousedown', this.touchstart, false)
    document.addEventListener('mouseup', this.touchend, false)
    this.params.transform && (this.$refs.widget.style.transform = this.params.transform)
    this.params.rotate && (this.$refs.widget.style.transform += `rotate(${this.params.rotate})`)
  },
  beforeUnmount() {
    document.removeEventListener('mouseup', this.touchend, false)
  },
  methods: {
    ...mapActions(['updateWidgetData']),
    touchstart(e) {
      // TODO move start
      // const imgKey = e.target.getAttribute('img-key')
      // this.editingKey = imgKey
      // this.editBoxs[this.editingKey] = {
      //   transformOrigin: 'center',
      // }
      // const editBox = this.$refs[this.params.uuid + '_ebox_' + imgKey]
      const editBox = this.$refs[this.params.uuid + '_ebox']
      this.cropWidgetXY = {
        x: Number(editBox.style.left.replace('px', '')) || 0,
        y: Number(editBox.style.top.replace('px', '')) || 0,
      }
      // 绑定鼠标移动事件
      document.addEventListener('mousemove', this.handlemousemove, true)
    },
    touchend() {
      // 取消鼠标移动事件
      document.removeEventListener('mousemove', this.handlemousemove, true)
      // document.removeEventListener('mouseup', () => {}, true)
    },
    handlemousemove(e) {
      e.stopPropagation()
      e.preventDefault()
      const { left, top } = this.move(e)
      // TODO
      this.editBoxStyle.left = left + 'px'
      this.editBoxStyle.top = top + 'px'
      // this.editBoxs[this.editingKey].left = left + 'px'
      // this.editBoxs[this.editingKey].top = top + 'px'
      const { width, height } = this.params
      const { width: vWidth, height: vHeight } = this.viewBox
      const params = {
        x: left / (width / vWidth) / this.params.zoom,
        y: top / (height / vHeight) / this.params.zoom,
      }
      // this.svgImg.attr(params)
      this.changeFinish('x', params.x)
      this.changeFinish('y', params.y)
      // console.log('-----', left / (width / vWidth) / this.params.zoom)
    },
    loadSvg() {
      // console.log(this.params)
      const _this = this
      const Snap = window.Snap
      return new Promise((resolve) => {
        Snap.load(
          this.params.svgUrl,
          function (svg) {
            let svg2 = Snap(svg.node)
            let img = svg2.select('image')
            _this.viewBox = svg2.node.viewBox.baseVal
            _this.svgImg = img
            // TODO 收集所有图片容器
            // _this.svgImgs = {}
            // svg2.selectAll('image').forEach((element) => {
            //   element.attr({
            //     width: '100%',
            //     height: '100%',
            //     transform: '',
            //     'xlink:href': _this.params.imgs ? _this.params.imgs[element.node.className.baseVal] : '',
            //   })
            //   _this.svgImgs[element.node.className.baseVal] = element
            //   _this.editBoxs[element.node.className.baseVal] = {}
            // })
            // img.attr({
            //   width: '100%',
            //   height: '100%',
            //   transform: '',
            //   'xlink:href': _this.params.imgUrl || '',
            // })
            const el = this || _this.$refs.widget
            el.appendChild(svg.node)
            resolve()
          },
          document.getElementById(this.params.uuid),
        )
      })
    },
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
      }
      this.updateZoom()
    },
    updateZoom() {
      // TODO
      this.editBoxStyle.transform = `scale(${this.params.zoom})`
      // this.editingKey && (this.editBoxs[this.editingKey].transform = `scale(${this.params.zoom})`)
      if (this.svgImg) {
        const { x, y } = this.params
        this.svgImg.attr({
          x: x || 0,
          y: y || 0,
          style: `transform-origin: center;transform: scale(${this.params.zoom})`,
        })
        // 根据图片位置设置回editBox的位置
        const { width, height } = this.params
        const { width: vWidth, height: vHeight } = this.viewBox
        const params = {
          left: x * (width / vWidth) * this.params.zoom,
          top: y * (height / vHeight) * this.params.zoom,
        }
        // TODO
        this.editBoxStyle.left = params.left + 'px'
        this.editBoxStyle.top = params.top + 'px'
        // if (this.editingKey) {
        //   this.editBoxs[this.editingKey].left = params.left + 'px'
        //   this.editBoxs[this.editingKey].top = params.top + 'px'
        // }
      }
    },
    changeFinish(key, value) {
      this.updateWidgetData({
        uuid: this.params.uuid,
        key: key,
        value: value,
        pushHistory: true,
      })
    },
    move(payload) {
      // const widgetXY = { x: this.cropWidgetXY.x / this.dZoom, y: this.cropWidgetXY.y / this.dZoom }
      const widgetXY = { x: this.cropWidgetXY.x, y: this.cropWidgetXY.y }
      const dx = Number(payload.pageX) - this.dMouseXY.x
      const dy = Number(payload.pageY) - this.dMouseXY.y
      let left = Number(widgetXY.x) + Math.floor((dx * 100) / this.dZoom)
      let top = Number(widgetXY.y) + Math.floor((dy * 100) / this.dZoom)
      return { left, top }
    },
  },
}
</script>

<style lang="less" scoped>
.svg__edit__wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.w-svg {
  cursor: pointer;
  outline: none;
}
.edit__model {
  opacity: 0.3;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>