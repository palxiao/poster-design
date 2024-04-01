<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-10 14:57:53
 * @Description: Psd文件解析
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-13 00:12:11
-->
<template>
  <div id="page-design-index" ref="pageDesignIndex">
    <div class="top-nav">
      <div class="top-nav-wrap">
        <div class="top-left">
          <div class="name" style="font-size: 15px">在线PSD解析</div>
        </div>
        <div style="flex: 1">
          <el-button plain type="primary" @click="jump2word">说明文档及PSD规范</el-button>
        </div>
        <el-button v-show="state.isDone" @click="clear">清空模板</el-button>
        <div class="v-tips">
          <HeaderOptions :isDone="state.isDone" @change="optionsChange" />
        </div>
      </div>
    </div>

    <div class="page-design-index-wrap">
      <!-- <widget-panel></widget-panel> -->
      <design-board class="page-design-wrap" pageDesignCanvasId="page-design-canvas">
        <div v-if="state.isDone" class="shelter" :style="{ width: (dPage.width * dZoom) / 100 + 'px', height: (dPage.height * dZoom) / 100 + 'px' }"></div>
        <uploader v-else accept=".psd" :hold="true" :drag="true" class="uploader" @load="selectFile">
          <div class="uploader__box">
            <img
              style="margin-right: 1rem"
              src="https://cdn.dancf.com/design/svg/icon_psdimport.37e6f23e.svg"
              alt="upload"
            /> 在此拖入或选择PSD文件
          </div>
        </uploader>
      </design-board>
      <style-panel v-show="state.isDone"></style-panel>
    </div>
    <!-- 缩放控制 -->
    <zoom-control v-if="state.isDone" ref="zoomControlRef" />
    <!-- 右键菜单 -->
    <right-click-menu />
    <!-- 旋转缩放组件 -->
    <Moveable />
    <!-- 遮罩百分比进度条 -->
    <ProgressLoading
      :percent="state.downloadPercent" :text="state.downloadText"
      :cancelText="state.cancelText" :msg="state.downloadMsg"
      @cancel="cancel" @done="state.downloadPercent = 0"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, nextTick, onBeforeMount, ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import RightClickMenu from '@/components/business/right-click-menu/RcMenu.vue'
import Moveable from '@/components/business/moveable/Moveable.vue'
import shortcuts from '@/mixins/shortcuts'
// import wText from '@/components/modules/widgets/wText/wText.vue'
// import wImage from '@/components/modules/widgets/wImage/wImage.vue'
import wImageSetting from '@/components/modules/widgets/wImage/wImageSetting'
import useLoading from '@/common/methods/loading'
import uploader from '@/components/common/Uploader/index.vue'
import designBoard from '@/components/modules/layout/designBoard/index.vue'
import zoomControl from '@/components/modules/layout/zoomControl/index.vue'
import HeaderOptions, { TEmitChangeData } from './components/UploadTemplate.vue'
import ProgressLoading from '@/components/common/ProgressLoading/index.vue'
// import MyWorker from '@/utils/plugins/webWorker'
import { processPSD2Page } from '@/utils/plugins/psd'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { wTextSetting } from '@/components/modules/widgets/wText/wTextSetting'
import { useCanvasStore, useControlStore, usePageStore, useWidgetStore } from '@/store'
import { storeToRefs } from 'pinia'

type TState = {
  isDone: boolean
  downloadPercent: number // 下载进度
  downloadText: string
  downloadMsg: string
  cancelText: string
}

// mixins: [shortcuts],
const state = reactive<TState>({
  isDone: true,
  downloadPercent: 0, // 下载进度
  downloadText: '',
  downloadMsg: '',
  cancelText: '',
})
const widgetStore = useWidgetStore()
const controlStore = useControlStore()

const route = useRoute()

// const { dZoom } = useSetupMapGetters(['dZoom'])
const pageStore = usePageStore()
const { dPage } = storeToRefs(pageStore)
const { dZoom } = storeToRefs(useCanvasStore())

const zoomControlRef = ref<typeof zoomControl | null>()

let loading: ReturnType<typeof useLoading> | null = null
    // const myWorker = new MyWorker('loadPSD')

onMounted(async () => {
  await nextTick()
  if (zoomControlRef.value){
    zoomControlRef.value.screenChange()
  }
  state.isDone = false
})

function loadJS() {
  const link_element = document.createElement('script')
  link_element.setAttribute('src', '/psd.js')
  document.head.appendChild(link_element)
}

async function selectFile(file: File) {
  loading = useLoading()
  await loadPSD(file)
  loading.close()
  state.isDone = true
}

async function loadPSD(file: File) {
  // const { compositeBuffer, psdFile } = await myWorker.start(file)
  const data = await processPSD2Page(file)

  setTimeout(async () => {
    const types: any = {
      text: wTextSetting,
      image: wImageSetting,
    }
    for (let i = 0; i < data.clouds.length; i++) {
      const x: any = data.clouds[i]
      const rawData = JSON.parse(JSON.stringify(types[x.type])) || {}
      delete x.type
      x.src && (x.imgUrl = x.src) && delete x.src
      widgetStore.addWidget(Object.assign(rawData, x))
      // store.dispatch('addWidget', Object.assign(rawData, x))
    }

    const { width, height, background: bg } = data

    pageStore.setDPage(Object.assign(pageStore.dPage, { width, height, backgroundColor: bg.color, backgroundImage: bg.image }))
    // store.commit('setDPage', Object.assign(store.getters.dPage, { width, height, backgroundColor: bg.color, backgroundImage: bg.image }))
    
    await loadDone()
  }, 10)
}

async function clear() {
  widgetStore.setDWidgets([])
  // store.commit('setDWidgets', [])

  pageStore.setDPage(Object.assign(pageStore.dPage, { width: 1920, height: 1080, backgroundColor: '#ffffff', backgroundImage: '' }))
  // store.commit('setDPage', Object.assign(store.getters.dPage, { width: 1920, height: 1080, backgroundColor: '#ffffff', backgroundImage: '' }))
  
  // store.commit('setShowMoveable', false)
  controlStore.setShowMoveable(false)
  
  await nextTick()
  state.isDone = false
}

const optionsChange = ({ downloadPercent, downloadText, downloadMsg = '', cancelText = '' }: TEmitChangeData) => {
  typeof downloadPercent === 'number' && (state.downloadPercent = downloadPercent)
  state.downloadText = downloadText
  state.downloadMsg = downloadMsg
  state.cancelText = cancelText
}

const cancel = () => {
  state.downloadPercent = 100
  window.open(`${window.location.protocol + '//' + window.location.host}/home?id=${route.query.id}`)
}

const {handleKeydowm, handleKeyup, dealCtrl} = shortcuts.methods

// ...mapGetters(['dPage', 'dZoom']),

let checkCtrl: number | undefined

onMounted(() => {
  const instance = getCurrentInstance()
  document.addEventListener('keydown', handleKeydowm(controlStore, checkCtrl, instance, dealCtrl), false)
  document.addEventListener('keyup', handleKeyup(controlStore, checkCtrl), false)
  loadJS()
})

onBeforeMount(() => {
  const instance = getCurrentInstance()
  document.removeEventListener('keydown', handleKeydowm(controlStore, checkCtrl, instance, dealCtrl), false)
  document.removeEventListener('keyup', handleKeyup(controlStore, checkCtrl), false)
  document.oncontextmenu = null
})
// ...mapActions(['selectWidget']),

async function loadDone() {
  await nextTick()
  if (!zoomControlRef.value) return
  zoomControlRef.value.screenChange()
  setTimeout(() => {
    widgetStore.selectWidget({ uuid: '-1' })
    // store.dispatch('selectWidget', { uuid: '-1' })
    // selectWidget({
    //   uuid: '-1',
    // })
    // this.$store.commit('setShowMoveable', false)
  }, 100)
}
function jump2word() {
  window.open('https://xp.palxp.cn/#/articles/1687855172725')
  // window.open('https://kdocs.cn/l/clmBsIkhve8d')
}

defineExpose({
  loadJS,
  selectFile,
  clear,
  cancel,
  optionsChange,
})
</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');
.uploader {
  position: absolute;
  z-index: 999;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  &__box {
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
.v-tips {
  padding: 0 1rem;
  font-size: 15px;
  color: #666666;
}
</style>
