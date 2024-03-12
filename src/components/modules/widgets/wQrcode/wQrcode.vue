<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-13 15:59:52
 * @Description: 二维码
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 15:54:10
-->
<template>
  <div
    :id="`${params.uuid}`"
    ref="widgetRef"
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
    <QRCode
      ref="qrcode"
      v-bind="state.qrCodeOptions"
      :width="width"
      :height="width"
      class="target"
      :image="params.url"
      :value="params.value"
    />
  </div>
</template>

<script setup lang="ts">
// 图片组件
// const NAME = 'w-qrcode'

import { mapGetters, mapActions, useStore } from 'vuex'
import QRCode from '@/components/business/qrcode'
import { TWQrcodeSetting } from './wQrcodeSetting';
import { computed, nextTick, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import { useSetupMapGetters } from '@/common/hooks/mapGetters';
import { Options } from 'qr-code-styling';

type TProps = {
  params: TWQrcodeSetting & {
    rotate?: number
    lock?: boolean
  }
  parent: {
    top: number
    left: number
  }
}

type TState = {
  qrCodeOptions: Options
}

const store = useStore()
const props = defineProps<TProps>()
const state = reactive<TState>({
  qrCodeOptions: {}
})
const { dActiveElement, dZoom } = useSetupMapGetters(['dActiveElement', 'dZoom'])
const width = computed(() => Number(props.params.width))
const widgetRef = ref<HTMLElement | null>(null)

watch(
  () => props.params,
  () => {
    changeValues()
  },
  { immediate: true, deep: true, }
)

onUpdated(() => {
  updateRecord()
  store.commit('updateRect')
})

onMounted(async () => {
  updateRecord()
  await nextTick()
  if (widgetRef.value){
    props.params.rotate && (widgetRef.value.style.transform += `rotate(${props.params.rotate})`)
  }
})
// ...mapActions(['updateWidgetData']),
function updateRecord() {
  if (dActiveElement.value.uuid === props.params.uuid) {
    let record = dActiveElement.value.record
    if (!widgetRef.value) return
    record.width = widgetRef.value.offsetWidth
    record.height = widgetRef.value.offsetHeight
  }
  // this.updateZoom()
}

function changeValues() {
  state.qrCodeOptions = {
    qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' },
    // dotsOptions: { color: '#999999' },
    dotsOptions: {
      type: props.params.dotType,
      color: props.params.dotColor,
      gradient: {
        type: 'linear',
        rotation: props.params.dotRotation,
        colorStops: [
          { offset: 0, color: props.params.dotColor },
          { offset: 1, color: props.params.dotColorType === 'single' ? props.params.dotColor : props.params.dotColor2 },
        ],
      },
    },
  }
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
