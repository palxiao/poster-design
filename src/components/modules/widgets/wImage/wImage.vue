<template>
  <div
    :id="params.uuid"
    ref="widget"
    :class="['w-image', { 'layer-lock': params.lock }]"
    :style="{
      position,
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <div v-if="cropEdit" :ref="params.uuid + '_ebox'" :style="editBoxStyle" class="svg__edit__wrap">
      <img class="edit__model" :src="params.imgUrl" />
    </div>
    <div :style="{ transform: params.flip ? `rotate${params.flip}(180deg)` : undefined, borderRadius: params.radius + 'px', '-webkit-mask-image': `${params.mask ? `url('${params.mask}')` : undefined}` }" :class="['img__box', { mask: params.mask }]">
      <div v-if="params.isNinePatch" ref="target" class="target" :style="{ border: `${(params.height * params.sliceData.ratio) / 2}px solid transparent`, borderImage: `url('${params.imgUrl}') ${params.sliceData.left} round` }"></div>
      <img v-else ref="target" class="target" style="transform-origin: center" :src="params.imgUrl" />
    </div>
    <div v-if="isMask" class="drop__mask">
      <div putIn="true" :style="{ fontSize: params.width / 12 + 'px' }" class="drop__btn">拖入</div>
    </div>
  </div>
</template>

<script>
// 图片组件
const NAME = 'w-image'

import { mapGetters, mapActions } from 'vuex'
import { getMatrix } from '@/common/methods/handleTransform'
import PointImg from '@/utils/plugins/pointImg'

export default {
  name: NAME,
  setting: {
    name: '图片',
    type: NAME,
    uuid: -1,
    width: 300,
    height: 300,
    left: 0,
    top: 0,
    zoom: 1,
    transform: '',
    radius: 0,
    opacity: 1,
    parent: '-1',
    imgUrl: '',
    mask: '',
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
        transform: '',
      },
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dWidgets', 'dZoom', 'dMouseXY', 'dDropOverUuid', 'dCropUuid']),
    cropEdit() {
      return this.params.uuid === this.dCropUuid
    },
    tZoom() {
      return this.params.zoom
    },
    isMask() {
      return this.params.mask && this.dDropOverUuid === this.params.uuid
    },
    isDraw() {
      return this.$route.name === 'Draw'
    },
  },
  watch: {
    cropEdit(val) {
      // TODO 移动事件绑定
      if (val) {
        document.getElementById(this.params.uuid).addEventListener('mousedown', this.touchstart, false)
      } else {
        document.getElementById(this.params.uuid).removeEventListener('mousedown', this.touchstart, false)
      }
      this.fixRotate()
      this.lockOthers()
    },
    async tZoom() {
      await this.$nextTick()
      this.updateRecord()
    },
  },
  updated() {
    this.updateRecord()
    this.$store.commit('updateRect')
  },

  async mounted() {
    this.updateRecord()
    await this.$nextTick()
    document.addEventListener('mouseup', this.touchend, false)
    // if (this.params.transformData) {
    //   // this.$refs.widget.style.transform += `scale(${this.params.transformData.a}, ${this.params.transformData.d})`
    //   this.$refs.widget.style.transform += `matrix(${String(getMatrix(this.params.transformData))})`
    // } else {
    //   // this.$refs.widget.style.transform += `scale(${this.params.transformData.a}, ${this.params.transformData.d})`
    //   this.params.rotate && (this.$refs.widget.style.transform += `rotate(${this.params.rotate})`)
    // }
    // console.log(this.params, this.params.filter)
    // this.$refs.widget.style.filter = 'hue-rotate(100deg) blur(50px)'
    this.$refs.widget.style.transform += this.params.rotate && (this.$refs.widget.style.transform += `rotate(${this.params.rotate})`)
  },
  beforeUnmount() {
    document.removeEventListener('mouseup', this.touchend, false)
  },
  methods: {
    ...mapActions(['updateWidgetData']),
    touchstart(e) {
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
      // const left = Number(this.editBoxStyle.left.replace('px', ''))
      // const flow = (this.params.width * (1 - this.tZoom)) / 2
      // if (left + flow < 0) {
      // }
    },
    handlemousemove(e) {
      if (!this.move(e)) {
        return
      }
      e && e.stopPropagation()
      e && e.preventDefault()
      const { left, top } = this.move(e)
      // TODO 触发位置刷新
      this.holdPosition = { left, top }
      this.editBoxStyle.left = left + 'px'
      this.editBoxStyle.top = top + 'px'
      this.changeFinish(left / this.params.zoom, top / this.params.zoom)
    },
    changeFinish(x, y) {
      this.setTransform('translate', `${x}px, ${y}px`)
    },
    move(payload) {
      if (payload) {
        const widgetXY = { x: this.cropWidgetXY.x, y: this.cropWidgetXY.y }
        const dx = Number(payload.pageX) - this.dMouseXY.x
        const dy = Number(payload.pageY) - this.dMouseXY.y
        let left = Number(widgetXY.x) + Math.floor((dx * 100) / this.dZoom)
        let top = Number(widgetXY.y) + Math.floor((dy * 100) / this.dZoom)
        // TODO: 旋转后计算坐标
        // const rotate = Number(this.params.rotate.replace('deg', ''))
        // console.log(Math.sin(rotate), Math.cos(rotate))
        return { left, top }
      } else {
        return this.holdPosition
      }
    },
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
      }
      this.updateZoom()
      // 获取点位
      if (!this.isDraw) {
        const read = new PointImg(this.$refs.target)
      }
    },
    setTransform(attrName, value) {
      const iof = this.params.transform.indexOf(attrName)
      let setValue = ''
      if (iof != -1) {
        const index = iof + attrName.length
        const tf = this.params.transform
        const FRONT = tf.slice(0, index + 1)
        const half = tf.substring(index + 1)
        const END = half.substring(half.indexOf(')'))
        setValue = FRONT + value + END
      } else {
        setValue = this.params.transform + ` ${attrName}(${value})`
      }
      this.updateWidgetData({
        uuid: this.params.uuid,
        key: 'transform',
        value: setValue,
        pushHistory: false,
      })
      this.params.transform && (this.$refs.target.style.transform = this.params.transform)
    },
    setEditBox(attrName, value) {
      const iof = this.editBoxStyle.transform.indexOf(attrName)
      let setValue = ''
      if (iof != -1) {
        const index = iof + attrName.length
        const tf = this.editBoxStyle.transform
        const FRONT = tf.slice(0, index + 1)
        const half = tf.substring(index + 1)
        const END = half.substring(half.indexOf(')'))
        setValue = FRONT + value + END
      } else {
        setValue = this.editBoxStyle.transform + ` ${attrName}(${value})`
      }
      this.editBoxStyle.transform = setValue
    },
    updateZoom() {
      this.setEditBox('scale', this.params.zoom)
      this.setTransform('scale', this.params.zoom)
      // this.$refs.target.style.transform = this.params.transform
      this.handlemousemove()
    },
    fixRotate() {
      // 裁切时修正角度
      if (this.rotateTemp) {
        this.$refs.widget.style.transform = `rotate(${this.rotateTemp})`
        this.params.flip = this.flipTemp
        this.rotateTemp = null
      } else {
        this.rotateTemp = this.params.rotate
        this.$refs.widget.style.transform = `rotate(0deg)`
        this.flipTemp = this.params.flip
        this.params.flip = null
      }
      this.$store.commit('setShowMoveable', false)
      setTimeout(() => {
        this.$store.commit('setShowMoveable', true)
      }, 100)
    },
    lockOthers() {
      // 裁剪时锁定其他图层
      if (this.locksTemp && this.locksTemp.length > 0) {
        for (let i = 0; i < this.locksTemp.length; i++) {
          this.dWidgets[i].lock = this.locksTemp[i]
        }
        this.locksTemp = []
      } else {
        this.locksTemp = []
        for (const widget of this.dWidgets) {
          this.locksTemp.push(widget.lock)
        }
        this.dWidgets.forEach((widget) => {
          widget.uuid != this.params.uuid && (widget.lock = true)
        })
      }
    },
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
  },
}
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
  object-fit: contain;
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
