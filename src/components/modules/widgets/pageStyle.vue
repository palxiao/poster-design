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
        <color-select v-show="state.mode === '颜色'" v-model="state.innerElement.backgroundColor" :modes="['纯色']" @change="colorChange" @finish="(value) => finish('backgroundColor', value)" />
        <!-- <bg-img-select :img="innerElement.backgroundImage"/> -->
        <div v-if="state.mode === '图片' && state.innerElement.backgroundImage" style="margin-top: 2rem">
          <el-image style="max-height: 428px" :src="state.innerElement.backgroundImage" fit="contain"></el-image>
          <el-button class="btn-wrap" size="small" @click="deleteBg">删除</el-button>
        </div>
        <uploader v-show="state.mode === '图片'" class="btn-wrap" @done="uploadImgDone">
          <el-button style="width: 100%" plain>{{ state.innerElement.backgroundImage ? '更换背景' : '上传背景' }}图</el-button>
        </uploader>
        <el-button v-show="state.mode === '图片' && state.innerElement.backgroundImage" class="btn-wrap" size="small" @click="downloadBG">{{ state.downP ? state.downP + ' %' : '下载背景图' }}</el-button>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
// 画布组件样式
// const NAME = 'page-style'
import { nextTick, onMounted, reactive, watch } from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
import numberInput from '../settings/numberInput.vue'
import colorSelect, { colorChangeData } from '../settings/colorSelect.vue'
import uploader, { TUploadDoneData } from '@/components/common/Uploader/index.vue'
import api from '@/api'
import _dl from '@/common/methods/download'
// import ColorPipette from '@/utils/plugins/color-pipette'
import Tabs from '@palxp/color-picker/comps/Tabs.vue'
import TabPanel from '@palxp/color-picker/comps/TabPanel.vue'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'

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

const store = useStore()
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
const { dActiveElement } = useSetupMapGetters(['dActiveElement'])
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

// ...mapActions(['updatePageData']),
function colorChange(e: colorChangeData) {
  if (e.mode === '渐变') {
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
  state.innerElement = JSON.parse(JSON.stringify(dActiveElement.value))
  state.innerElement.backgroundImage && (state.mode = state.modes[1])
}
function changeValue() {
  if (state.tag) {
    state.tag = false
    return
  }
  for (let key in state.innerElement) {
    if (key !== 'setting' && key !== 'record' && state.innerElement[key] !== dActiveElement.value[key]) {
      if (state.ingoreKeys.indexOf(key) !== -1) {
        dActiveElement.value[key] = state.innerElement[key]
      } else {
        store.dispatch('updatePageData', {
          key: key,
          value: state.innerElement[key],
        })
        // updatePageData({
        //   key: key,
        //   value: this.innerElement[key],
        // })
      }
    }
  }
}

function finish(key: string, value: string | number) {
  store.dispatch('updatePageData', {
    key: key,
    value: value,
    pushHistory: true,
  })
}
async function uploadImgDone(img: TUploadDoneData) {
  await api.material.addMyPhoto(img)
  store.dispatch('updatePageData', {
    key: 'backgroundTransform',
    value: {},
  })
  finish('backgroundImage', img.url)
}
async function deleteBg() {
  _localTempBG = null
  store.dispatch('updatePageData', {
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
</script>

<style>
/* :deep(.el-collapse-item__header) {
  padding: 0;
  font-size: 14px;
  color: #666666;
} */
.el-collapse-item__header {
  padding: 0 !important;
  font-size: 14px !important;
  color: #666666 !important;
}
.el-collapse-item__wrap {
  padding: 0 !important;
}
.el-collapse-item__content {
  padding-bottom: 18px !important;
}
</style>

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
  width: 100%; margin-top: 0.7rem;
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
</style>
