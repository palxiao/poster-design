<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-02 09:41:41
 * @Description: 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-16 00:30:03
-->
<template>
  <div
    ref="widget"
    :class="['w-group', { 'layer-lock': params.lock }]"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
// 组合组件
const NAME = 'w-group'

import { mapGetters, mapActions } from 'vuex'
import { setTransformAttribute } from '@/common/methods/handleTransform'

export default {
  name: NAME,
  setting: {
    name: '组合',
    type: NAME,
    uuid: -1,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    transform: '',
    opacity: 1,
    parent: '-1',
    isContainer: true,
    record: {
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      dir: 'none',
    },
  },
  props: ['params', 'parent'],
  data() {
    return {
      // loading: false,
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dWidgets']),
  },
  // watch: {
  //   params: {
  //     async handler(nval) {
  //       this.updateRecord(nval.tempScale)
  //     },
  //     immediate: true,
  //     deep: true,
  //   },
  // },
  updated() {
    this.updateRecord()
  },
  async mounted() {
    await this.$nextTick()
    this.touchstart()
    this.updateRecord()
    document.addEventListener('mousedown', this.touchstart, false)
    document.addEventListener('mouseup', this.touchend, false)
    this.params.rotate && (this.$refs.widget.style.transform += `rotate(${this.params.rotate})`)
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.touchstart, false)
    document.removeEventListener('mouseup', this.touchend, false)
  },
  methods: {
    ...mapActions(['updateWidgetData']),
    updateRecord(tempScale) {
      if (this.dActiveElement.uuid === this.params.uuid) {
        // clearTimeout(this.timer)
        let record = this.dActiveElement.record
        if (record.width <= 0) {
          this.touchend()
        }
        // if (this.tempRecord && this.tempRecord.width && this.tempRecord.width != record.width) {
        //   return
        // }
        this.ratio = tempScale || this.params.width / record.width

        if (this.ratio != 1) {
          this.temp = {}
          if (record.width != 0) {
            for (let i = this.dWidgets.length - 1; i >= 0; --i) {
              if (this.dWidgets[i].parent === this.params.uuid) {
                this.temp[this.dWidgets[i].uuid] = { width: this.dWidgets[i].width * this.ratio, height: this.dWidgets[i].height * this.ratio, raw: this.dWidgets[i] }
              }
            }
          }
          // TODO DOM Change
          // this.dActiveElement.scale = this.ratio
          this.$refs.widget.style.transformOrigin = 'left top' // 设置scale的原点
          setTransformAttribute(this.$refs.widget, 'scale', this.ratio)
          // this.timer = setTimeout(() => {
          //   this.touchend()
          // }, 300)
        }
      }
    },
    touchstart() {
      if (this.dActiveElement.uuid !== this.params.uuid) {
        return
      }
      this.tempRecord = {
        width: this.params.width,
        height: this.params.height,
      }
      this.compWidgetsRecord = {}
      for (let i = this.dWidgets.length - 1; i >= 0; --i) {
        if (this.dWidgets[i].parent === this.params.uuid) {
          this.compWidgetsRecord[this.dWidgets[i].uuid] = {
            left: Number(document.getElementById(this.dWidgets[i].uuid).style.left.replace('px', '')),
            top: Number(document.getElementById(this.dWidgets[i].uuid).style.top.replace('px', '')),
            fontSize: Number(document.getElementById(this.dWidgets[i].uuid).style.fontSize?.replace('px', '')),
          }
        }
      }
    },
    touchend() {
      if (this.dActiveElement.uuid !== this.params.uuid) {
        return
      }
      // const opacity = this.$refs.widget.style.opacity
      // this.$refs.widget.style.opacity = 1
      setTimeout(() => {
        if (!this.temp) {
          return
        }
        this.$refs.widget.style.opacity = 0
        setTransformAttribute(this.$refs.widget, 'scale', 1)
        setTimeout(() => {
          this.$refs.widget.style.opacity = this.params.opacity
          // this.$refs.widget.style.transformOrigin = 'center' // 设置scale的原点
        }, 100)

        // const opacity = this.$refs.widget.style.opacity
        // setTransformAttribute(this.$refs.widget, 'scale', 1)
        for (const key in this.temp) {
          if (Object.hasOwnProperty.call(this.temp, key)) {
            this.keyChange(key, 'width', this.temp[key].width)
            this.keyChange(key, 'height', this.temp[key].height)
            // 重新拿前面设定好的，实时DOM修改过了
            this.keySetValue(key, 'left', this.compWidgetsRecord[key].left * this.ratio)
            this.keySetValue(key, 'top', this.compWidgetsRecord[key].top * this.ratio)
            // this.keySetValue(key, 'left', Number(document.getElementById(key).style.left.replace('px', '')) * this.ratio)
            // this.keySetValue(key, 'top', Number(document.getElementById(key).style.top.replace('px', '')) * this.ratio)
            if (this.temp[key].raw.type === 'w-text') {
              this.keyChange(key, 'fontSize', this.compWidgetsRecord[key].fontSize * this.ratio)
              // this.keyChange(key, 'fontSize', this.temp[key].raw.fontSize * this.ratio)
              // this.keyChange(key, 'letterSpacing', this.temp[key].raw.letterSpacing * this.ratio)
            }
          }
        }
        // this.$refs.widget.style.opacity = opacity
        this.temp = null

        if (this.dActiveElement.uuid === this.params.uuid) {
          let record = this.dActiveElement.record
          record.width = this.$refs.widget?.offsetWidth
          record.height = this.$refs.widget?.offsetHeight
          this.dActiveElement.width = this.$refs.widget?.offsetWidth
          this.dActiveElement.height = this.$refs.widget?.offsetHeight
        }
      }, 10)
    },
    keyChange(uuid, key, value) {
      this.updateWidgetData({
        uuid,
        key,
        value,
        pushHistory: false,
      })
    },
    keySetValue(uuid, key, value) {
      setTimeout(() => {
        const widget = this.dWidgets.find((item) => item.uuid === uuid)
        widget[key] = value + Number(this.params[key])
      }, 10)
    },
  },
}
</script>

<style lang="less" scoped>
.w-group {
  // cursor: pointer;
  outline: none;
}
</style>
