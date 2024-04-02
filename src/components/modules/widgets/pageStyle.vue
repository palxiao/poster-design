<template>
  <div id="page-style">
    <div v-if="state.showBgLib" style="width: 256px;height: 100%;">
      <span class="header-back" @click="state.showBgLib = false">
        <i class="iconfont icon-right"></i> 选择背景
      </span>
      <bg-img-list-wrap style="padding-top: 2rem;" model="stylePanel" />
    </div>
    <el-collapse v-else v-model="state.activeNames">
      <el-collapse-item title="画布尺寸" name="1">
        <div class="position-size">
          <number-input v-model="state.innerElement.width" label="宽" :maxValue="5000" @finish="(value) => finish('width', value)" />
          <number-input v-model="state.innerElement.height" label="高" :maxValue="5000" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="背景设置" name="2">
        <el-button style="width: 100%; margin: 0 0 1rem 0;" type="primary" link @click="state.showBgLib = true">在背景库中选择</el-button>
        <Tabs :value="state.mode" @update:value="onChangeMode">
          <TabPanel v-for="label in state.modes" :key="label" :label="label"></TabPanel>
        </Tabs>
        <color-select v-show="state.mode === '颜色'" v-model="state.innerElement.backgroundColor" :modes="['纯色','渐变']" @change="colorChange" @finish="(value) => finish('backgroundColor', value)" />
        <div v-if="state.mode === '图片' && state.innerElement.backgroundImage" style="margin-top: 1.2rem">
          <div class="backgroud-wrap">
            <el-image style="height: 100%" :src="state.innerElement.backgroundImage" fit="contain"></el-image>
            <div class="bg-control">
              <div class="btns">
                <uploader style="width: 47%;" @done="uploadImgDone">
                  <el-button style="width: 100%;" plain>上传图片</el-button>
                </uploader>
                <el-button style="width: 47%;" @click="state.showBgLib = true" plain>背景库</el-button>
              </div>
            </div>
            <div class="bg-options">
              <el-tooltip :show-after="300" :hide-after="0" effect="dark" content="下载图片" placement="top">
                <div @click="downloadBG" class="btn-item"><icon-download width="16" /></div>
              </el-tooltip>
              <el-tooltip :show-after="300" :hide-after="0" effect="dark" content="删除" placement="top">
                <div @click="deleteBg" class="btn-item"><icon-delete width="16" /></div>
              </el-tooltip>
            </div>
          </div>
          <!-- <el-image style="max-height: 428px" :src="state.innerElement.backgroundImage" fit="contain"></el-image> -->
          <!-- <el-button class="btn-wrap" size="small" @click="deleteBg">删除</el-button> -->
        </div>
        <uploader v-show="state.mode === '图片' && !state.innerElement.backgroundImage" class="btn-wrap" @done="uploadImgDone">
          <el-button style="width: 100%" plain>上传背景图</el-button>
        </uploader>
        <!-- <el-button v-show="state.mode === '图片' && state.innerElement.backgroundImage" class="btn-wrap" size="small" @click="downloadBG">{{ state.downP ? state.downP + ' %' : '下载背景图' }}</el-button> -->
        <el-button v-show="state.mode === '图片' && state.innerElement.backgroundImage" class="btn-wrap" @click="shiftOut">将背景分离为图层</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
// 画布组件样式
// const NAME = 'page-style'
import { nextTick, onMounted, reactive, watch } from 'vue'

import numberInput from '../settings/numberInput.vue'
import colorSelect, { colorChangeData } from '../settings/colorSelect.vue'
import uploader, { TUploadDoneData } from '@/components/common/Uploader/index.vue'
import api from '@/api'
import _dl from '@/common/methods/download'
// import ColorPipette from '@/utils/plugins/color-pipette'
import Tabs from '@palxp/color-picker/comps/Tabs.vue'
import TabPanel from '@palxp/color-picker/comps/TabPanel.vue'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { useCanvasStore, useWidgetStore } from '@/store'
import { TPageState } from '@/store/design/canvas/d'
import { storeToRefs } from 'pinia'
import { Delete as iconDelete, Download as iconDownload } from '@element-plus/icons-vue'
import wImageSetting from '@/components/modules/widgets/wImage/wImageSetting'
// import setImageData from '@/common/methods/DesignFeatures/setImage'

type TState = {
  activeNames: string[]
  innerElement: Record<string, any>
  tag: boolean
  ingoreKeys: string[]
  downP: number
  mode: string
  modes: string[]
  showBgLib: boolean
}


const pageStore = useCanvasStore()
const widgetStore = useWidgetStore()
const state = reactive<TState>({
  activeNames: ['1', '2', '3', '4'],
  innerElement: {},
  tag: false,
  ingoreKeys: ['backgroundColor', 'name', 'width', 'height'],
  downP: 0,
  mode: '颜色',
  modes: ['颜色', '图片'],
  showBgLib: false
})
// const { dActiveElement } = useSetupMapGetters(['dActiveElement'])
const { dActiveElement } = storeToRefs(widgetStore)
let _localTempBG: string | null = null

watch(
  () => dActiveElement.value,
  () => {
    change()
  },
  { deep: true }
)

watch(
  () => state.innerElement,
  () => {
    changeValue()
  },
  { deep: true }
)

onMounted(() => {
  change()
})

function colorChange(e: colorChangeData) {
  if (e.mode === '渐变') {
    console.log('渐变背景');
    
    // setTimeout(() => {
    //   console.log(1, e)
    //   this.finish('backgroundImage', e.color)
    // }, 1000)
  }
}
function onChangeMode(value: string) {
  state.mode = value
  if (value === '颜色') {
    _localTempBG = state.innerElement.backgroundImage
    finish('backgroundImage', '')
  } else {
    _localTempBG && finish('backgroundImage', _localTempBG)
  }
}
function change() {
  state.mode = state.modes[0]
  state.tag = true
  state.innerElement = dActiveElement.value || {}
  state.innerElement.backgroundImage && (state.mode = state.modes[1])
}
function changeValue() {
  if (state.tag) {
    state.tag = false
    return
  }
  for (let key in state.innerElement) {
    if (
      key !== 'setting' && key !== 'record' &&
      state.innerElement[key] !== (dActiveElement.value as Record<string, any>)[key]
    ) {
      if (state.ingoreKeys.indexOf(key) !== -1) {
        (dActiveElement.value as Record<string, any>)[key] = state.innerElement[key]
      } else {
        pageStore.updatePageData({
          key: key as keyof TPageState,
          value: state.innerElement[key],
        })
      }
    }
  }
}

function finish(key: keyof TPageState, value: string | number) {
  pageStore.updatePageData({
    key: key,
    value: value,
    pushHistory: true,
  })
}
async function uploadImgDone(img: TUploadDoneData) {
  await api.material.addMyPhoto(img)
  pageStore.updatePageData({
    key: 'backgroundTransform',
    value: {},
  })
  finish('backgroundImage', img.url)
}
async function deleteBg() {
  _localTempBG = null
  pageStore.updatePageData({
    key: 'backgroundImage',
    value: '',
    pushHistory: true,
  })
  await nextTick()
  state.mode = state.modes[1]
}
async function downloadBG() {
  await _dl.downloadImg(state.innerElement.backgroundImage, (p) => {
    state.downP = p < 99 ? p / 100 : 0
  })
}

// 分离背景图，添加到画布中
async function shiftOut() {
  let setting = JSON.parse(JSON.stringify(wImageSetting))
  setting.width = state.innerElement.width
  setting.height = state.innerElement.height
  setting.imgUrl = state.innerElement.backgroundImage
  // store.dispatch('addWidget', setting)
  setting.uuid = `bg-${(new Date()).getTime()}`
  widgetStore.dWidgets.unshift(setting)
  widgetStore.selectWidget({
    uuid: widgetStore.dWidgets[0].uuid,
  })
  // store.dispatch('selectWidget', {
  //   uuid: store.getters.dWidgets[0].uuid,
  // })
  deleteBg()
}
</script>

<style lang="less" scoped>
#page-style {
  height: 100%;
  width: 100%;
}
.position-size {
  display: flex;
  // justify-content: space-between;
  width: 100%;
  .number-input {
    flex: 0.25;
  }
}
.select {
  margin-bottom: 10px;
}
.btn-wrap {
  width: 100%; margin-top: 1.2rem;
}
.header {
  &-back {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 14px;
      font-weight: 600;
      height: 2.9rem;
      position: absolute;
      z-index: 2;
      background: #ffffff;
      width: 259px;
      .icon-right {
        transform: rotate(180deg);
      }
    }
}

.backgroud-wrap {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  padding: 16px;
  background-color: #f1f2f4;
  border-radius: 8px;
  .bg-options {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
  }
  .btn-item {
    margin-left: 5px;
    cursor: pointer;
    background-color: #ffffff;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 14px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
  }
  .bg-control {
    transition: all 0.3s;
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.07);
    .btns {
      padding: 0 2%;
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-around;
      bottom: 12px;
    }
  }
  .bg-control:hover {
    opacity: 1;
  }
}
</style>
