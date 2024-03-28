<!--
 * @Author: ShawnPhang
 * @Date: 2023-09-18 17:34:44
 * @Description: 
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastUpdateContent: Support typescript
 * @LastEditTime: 2024-02-25 14:51:00
-->
<template>
  <div id="page-design-index" ref="pageDesignIndex" class="page-design-bg-color">
    <div :style="state.style" class="top-nav">
      <div class="top-nav-wrap">
        <div class="top-left">
          <div class="name" @click="jump2home">{{ state.APP_NAME }}</div>
          <div class="operation">
            <div :class="['operation-item', { disable: !undoable }]" @click="undoable ? handleHistory('undo') : ''"><i class="iconfont icon-undo" /></div>
            <div :class="['operation-item', { disable: !redoable }]" @click="redoable ? handleHistory('redo') : ''"><i class="iconfont icon-redo" /></div>
          </div>
          <el-tooltip effect="dark" content="标尺" placement="bottom">
            <i style="font-size: 20px" class="icon sd-biaochi extra-operation" @click="changeLineGuides" />
          </el-tooltip>
        </div>
        <HeaderOptions ref="optionsRef" v-model="state.isContinue" @change="optionsChange" />
      </div>
    </div>
    <div class="page-design-index-wrap">
      <widget-panel></widget-panel>
      <design-board class="page-design-wrap" pageDesignCanvasId="page-design-canvas">
        <!-- 用于挡住画布溢出部分，因为使用overflow有bug -->
        <div class="shelter" :style="{ width: Math.floor((dPage.width * dZoom) / 100) + 'px', height: Math.floor((dPage.height * dZoom) / 100) + 'px' }"></div>
        <!-- 提供一个背景图层 -->
        <div class="shelter-bg transparent-bg" :style="{ width: Math.floor((dPage.width * dZoom) / 100) + 'px', height: Math.floor((dPage.height * dZoom) / 100) + 'px' }"></div>
      </design-board>
      <style-panel></style-panel>
    </div>
    <!-- 标尺 -->
    <line-guides :show="state.showLineGuides" />
    <!-- 缩放控制 -->
    <zoom-control ref="zoomControlRef" />
    <!-- 右键菜单 -->
    <right-click-menu />
    <!-- 旋转缩放组件 -->
    <Moveable />
    <!-- 遮罩百分比进度条 -->
    <ProgressLoading
      :percent="state.downloadPercent"
      :text="state.downloadText"
      cancelText="取消"
      @cancel="downloadCancel"
      @done="state.downloadPercent = 0"
    />
  </div>
</template>

<script lang="ts" setup>
import _config from '../config'
import {
  CSSProperties, computed, nextTick,
  onBeforeUnmount, onMounted, reactive, ref,
} from 'vue'
import { useStore } from 'vuex'
import RightClickMenu from '@/components/business/right-click-menu/RcMenu.vue'
import Moveable from '@/components/business/moveable/Moveable.vue'
import designBoard from '@/components/modules/layout/designBoard/index.vue'
import zoomControl from '@/components/modules/layout/zoomControl/index.vue'
import lineGuides from '@/components/modules/layout/lineGuides.vue'
import shortcuts from '@/mixins/shortcuts'
// import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'
import HeaderOptions from './components/HeaderOptions.vue'
import ProgressLoading from '@/components/common/ProgressLoading/index.vue'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { useRoute } from 'vue-router'
import { wGroupSetting } from '@/components/modules/widgets/wGroup/groupSetting'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useControlStore, usePageStore, useHistoryStore } from '@/pinia'

type TState = {
  style: CSSProperties
  downloadPercent: number // 下载进度
  downloadText: string
  isContinue: boolean
  APP_NAME: string
  showLineGuides: boolean
}

const {
  dActiveElement, dCopyElement
} = useSetupMapGetters(['dActiveElement', 'dCopyElement'])
const historyStore = useHistoryStore()
const { dPage } = storeToRefs(usePageStore())
const { dZoom } = storeToRefs(useCanvasStore())
const { dHistoryParams } = storeToRefs(useHistoryStore())


const state = reactive<TState>({
  style: {
    left: '0px',
  },
  // openDraw: false,
  downloadPercent: 0, // 下载进度
  downloadText: '',
  isContinue: true,
  APP_NAME: _config.APP_NAME,
  showLineGuides: false,
})
const optionsRef = ref<typeof HeaderOptions | null>(null)
const zoomControlRef = ref<typeof zoomControl | null>(null)
const store = useStore()
const controlStore = useControlStore()
const route = useRoute()

const beforeUnload = function (e: Event): any {
  if (dHistoryParams.value.length > 0) {
    const confirmationMessage: string = '系统不会自动保存您未修改的内容';
    (e || window.event).returnValue = (confirmationMessage as any) // Gecko and Trident
    return confirmationMessage // Gecko and WebKit
  } else return false
}

!_config.isDev && window.addEventListener('beforeunload', beforeUnload)

function jump2home() {
  // const fullPath = window.location.href.split('/')
  // window.open(fullPath[0] + '//' + fullPath[2])
  window.open('https://xp.palxp.cn/')
}

defineExpose({
  jump2home,
})

const undoable = computed(() => {
  return !(
    dHistoryParams.value.index === -1 || 
    (dHistoryParams.value.index === 0 && dHistoryParams.value.length === dHistoryParams.value.maxLength))
})

const redoable = computed(() => {
  return !(dHistoryParams.value.index === dHistoryParams.value.length - 1)
})

function zoomSub() {
  if (!zoomControlRef.value) return
  zoomControlRef.value.sub()
}

function zoomAdd() {
  if (!zoomControlRef.value) return
  zoomControlRef.value.add()
}

function save() {
  if (!optionsRef.value) return
  optionsRef.value.save()
}

const { handleKeydowm, handleKeyup, dealCtrl } = shortcuts.methods
let checkCtrl: number | undefined
const instanceFn = { save, zoomAdd, zoomSub }

onMounted(() => {
  store.dispatch('initGroupJson', JSON.stringify(wGroupSetting))
  // initGroupJson(JSON.stringify(wGroup.setting))
  window.addEventListener('scroll', fixTopBarScroll)
  // window.addEventListener('click', this.clickListener)
  document.addEventListener('keydown', handleKeydowm(controlStore, checkCtrl, instanceFn, dealCtrl), false)
  document.addEventListener('keyup', handleKeyup(controlStore, checkCtrl), false)
  loadData()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', fixTopBarScroll)
  // window.removeEventListener('click', this.clickListener)
  document.removeEventListener('keydown', handleKeydowm(controlStore, checkCtrl, instanceFn, dealCtrl), false)
  document.removeEventListener('keyup', handleKeyup(controlStore, checkCtrl), false)
  document.oncontextmenu = null
})
    // ...mapActions(['selectWidget', 'initGroupJson', 'handleHistory']),

function handleHistory(data: "undo" | "redo") {
  historyStore.handleHistory(data)
  // store.dispatch('handleHistory', data)
}

function changeLineGuides() {
  state.showLineGuides = !state.showLineGuides
}

function downloadCancel() {
  state.downloadPercent = 0
  state.isContinue = false
}

function loadData() {
  // 初始化加载页面
  const { id, tempid, tempType } = route.query
  if (!optionsRef.value) return
  optionsRef.value.load(id, tempid, tempType, async () => {
    if (!zoomControlRef.value) return
    // await nextTick()
    // zoomControlRef.value.screenChange()
    // 初始化激活的控件为page
    store.dispatch('selectWidget', { uuid: '-1' })
    // selectWidget({
    //   uuid: '-1',
    // })
  })
}

function fixTopBarScroll() {
  const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
  state.style.left = `-${scrollLeft}px`
}

// function clickListener(e: Event) {
//   console.log('click listener', e)
// }

function optionsChange({ downloadPercent, downloadText }: { downloadPercent: number, downloadText: string }) {
  state.downloadPercent = downloadPercent
  state.downloadText = downloadText
}
</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');
</style>
