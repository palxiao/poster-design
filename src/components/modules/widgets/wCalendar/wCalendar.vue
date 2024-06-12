<!--
 * @Author: aren
 * @Description: 日历
-->
<template>
  <div
    :id="`${params.uuid}`"
    ref="widgetRef"
    :class="['w-calendar', { 'layer-lock': params.lock }]"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <calendar
      ref="calendar"
      class="target"
      :params="params"
      :value="params.value"></calendar>
  </div>
</template>

<script setup lang="ts">
// 图片组件
// const NAME = 'w-qrcode'


// import calendar from './calendar'
import { TWCalendarSetting } from './wCalendarSetting';
import { computed, nextTick, onMounted, onUpdated, reactive, ref, watch } from 'vue';
// import { useSetupMapGetters } from '@/common/hooks/mapGetters';
import { Options } from 'qr-code-styling';
import { useForceStore, useWidgetStore } from '@/store';
import { storeToRefs } from 'pinia';

type TProps = {
  params: TWCalendarSetting & {
    rotate?: number
    lock?: boolean
  }
  parent: {
    top: number
    left: number
  }
}

type TState = {
  calendarOptions: Options
}


const forceStore = useForceStore()
const widgetStore = useWidgetStore()
const props = defineProps<TProps>()
const state = reactive<TState>({
  calendarOptions: {}
})
// const { dActiveElement } = useSetupMapGetters(['dActiveElement'])
const { dActiveElement } = storeToRefs(widgetStore)
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
  forceStore.setUpdateRect()
  // store.commit('updateRect')
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
  if (dActiveElement.value?.uuid === props.params.uuid) {
    let record = dActiveElement.value?.record
    if (!widgetRef.value) return
    record.width = widgetRef.value.offsetWidth
    record.height = widgetRef.value.offsetHeight
  }
  // this.updateZoom()
}

function changeValues() {
  
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
