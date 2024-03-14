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
  ></div>
</template>

<script>
// svg
const NAME = 'w-svg'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  setting: {
    name: '矢量图形',
    type: NAME,
    uuid: -1,
    width: 100,
    height: 100,
    colors: [],
    left: 0,
    top: 0,
    // zoom: 1.5,
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
      attrRecord: {}, // 记录可更改的属性
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
    params: {
      async handler(nval) {
        this.attrsChange()
      },
      immediate: true,
      deep: true,
    },
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
    this.$store.commit('updateRect')
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
            // let item = svg2.select('circle')
            // item.attr({
            //   fill: 'rgb(255, 0, 0)',
            // })
            // console.log(item.attr('fill'))

            let items = svg2.node.childNodes
            svg2.node.removeAttribute('width')
            svg2.node.removeAttribute('height')
            svg2.node.setAttribute('style', 'height: inherit;width: inherit;')
            // svg2.node.setAttribute('height', 'inherit')
            _this.svgElements = []
            const colorsObj = _this.color2obj()

            deepElement(items)

            function deepElement(els) {
              // 判断是NodeList对象则继续递归，否则进入元素处理工厂
              if (els.item) {
                els.forEach((element) => {
                  elementFactory(element)
                  if (element.childNodes.length > 0) {
                    element.childNodes.forEach((element) => {
                      deepElement(element)
                    })
                  }
                })
              } else {
                elementFactory(els)
              }
            }
            // 元素工厂: 遍历元素中是否存在可自定义的颜色属性
            function elementFactory(element) {
              const attrsColor = {}
              try {
                element.attributes.forEach((attr) => {
                  if (colorsObj[attr.value]) {
                    // console.log(attr.name, colorsObj[attr.value])
                    attr.value = colorsObj[attr.value]
                    attrsColor[attr.name] = _this.params.colors.findIndex((x) => x == attr.value)
                  }
                })
              } catch (e) {}
              if (JSON.stringify(attrsColor) !== '{}') {
                _this.svgElements.push({
                  item: element,
                  attrsColor,
                })
              }
              // console.log(element.attributes, element.getAttribute('fill'), _this.params.colors)
            }

            // _this.viewBox = svg2.node.viewBox.baseVal
            // _this.svgImg = img

            // img.attr({
            //   width: '100%',
            //   height: '100%',
            //   transform: '',
            //   'xlink:href': _this.params.imgUrl || '',
            // })
            const el = this || _this.$refs.widget
            // svg.node.classList.add('svg__box')
            el.appendChild(svg.node)
            resolve()
          },
          document.getElementById(this.params.uuid),
        )
      })
    },
    color2obj() {
      const obj = {}
      for (let i = 0; i < this.params.colors.length; i++) {
        obj[`{{colors[${i}]}}`] = this.params.colors[i]
      }
      return obj
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
    attrsChange() {
      if (this.dActiveElement.uuid === this.params.uuid && this.svgElements) {
        for (const element of this.svgElements) {
          const { item, attrsColor } = element
          for (const key in attrsColor) {
            if (Object.hasOwnProperty.call(attrsColor, key)) {
              const color = this.params.colors[attrsColor[key]]
              item.setAttribute(key, color)
            }
          }
        }
      }
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
