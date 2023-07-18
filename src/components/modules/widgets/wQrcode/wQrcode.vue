<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-13 15:59:52
 * @Description: 二维码
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 15:54:10
-->
<template>
  <div
    :id="params.uuid"
    ref="widget"
    :class="['w-qrcode', { 'layer-lock': params.lock }]"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <QRCode ref="qrcode" v-bind="qrCodeOptions" :width="width" :height="width" class="target" :image="params.url" :value="params.value" />
  </div>
</template>

<script>
// 图片组件
const NAME = 'w-qrcode'

import { mapGetters, mapActions } from 'vuex'
import QRCode from '@/components/business/qrcode'

export default {
  name: NAME,
  components: { QRCode },
  setting: {
    name: '二维码',
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
    url: '',
    dotType: 'classy',
    dotColorType: 'single',
    dotRotation: 270,
    dotColor: '#35495E',
    dotColor2: '#35495E',
    value: 'https://xp.palxp.com',
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
      qrCodeOptions: {},
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dZoom']),
    width() {
      return Number(this.params.width)
    },
  },
  watch: {
    params: {
      async handler(nval) {
        this.changeValues()
      },
      immediate: true,
      deep: true,
    },
  },
  updated() {
    this.updateRecord()
    this.$store.commit('updateRect')
  },

  async mounted() {
    this.updateRecord()
    await this.$nextTick()
    this.params.rotate && (this.$refs.widget.style.transform += `rotate(${this.params.rotate})`)
  },
  methods: {
    ...mapActions(['updateWidgetData']),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
      }
      // this.updateZoom()
    },
    changeValues() {
      this.qrCodeOptions = {
        qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' },
        // dotsOptions: { color: '#999999' },
        dotsOptions: {
          type: this.params.dotType,
          color: this.params.dotColor,
          gradient: {
            type: 'linear',
            rotation: this.params.dotRotation,
            colorStops: [
              { offset: 0, color: this.params.dotColor },
              { offset: 1, color: this.params.dotColorType === 'single' ? this.params.dotColor : this.params.dotColor2 },
            ],
          },
        },
      }
    },
  },
}
</script>

<style lang="less" scoped>
// .w-qrcode {
//   overflow: hidden;
// }
</style>
<style lang="less">
// .QRCodeVue3 {
//   &_img {
//     width: 100%;
//   }
// }
</style>
