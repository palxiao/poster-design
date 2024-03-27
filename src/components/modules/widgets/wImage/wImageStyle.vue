<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:41:53
 * @Description: 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-22 16:14:48
-->
<template>
  <div id="w-image-style">
    <el-collapse v-model="state.activeNames">
      <el-collapse-item title="位置尺寸" name="1">
        <div class="line-layout">
          <number-input v-model="state.innerElement.left" label="X" @finish="(value) => finish('left', value)" />
          <number-input v-model="state.innerElement.top" label="Y" @finish="(value) => finish('top', value)" />
          <number-input v-model="state.innerElement.width" style="margin-top: 0.5rem" label="宽" @finish="(value) => finish('width', value)" />
          <number-input v-model="state.innerElement.height" style="margin-top: 0.5rem" label="高" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="设置" name="2">
        <!-- <el-button size="mini" style="width: 100%; margin-top: 0.5rem" plain @click="openCropper">替换图片</el-button> -->
        <el-button style="width: 100%; margin-bottom: 12px" plain @click="openPicBox">替换图片</el-button>
        <div class="options">
          <el-button v-if="state.innerElement.cropEdit" plain type="primary" @click="imgCrop(false)">完成</el-button>
          <el-button v-else plain type="primary" @click="imgCrop(true)"><i class="icon sd-caijian" /> 裁剪</el-button>
          <el-button plain @click="openImageCutout"><i class="icon sd-AIkoutu" /> 抠图</el-button>
          <!-- <uploader class="options__upload" @done="uploadImgDone">
            <el-button size="small" plain>替换图片</el-button>
          </uploader> -->
          <el-button size="small" disabled plain @click="openCropper">美化</el-button>
        </div>
        <!-- <container-wrap @change="changeContainer" />
        <br /> -->
        <div class="slide-wrap">
          <number-slider v-model="state.innerElement.opacity" style="font-size: 14px" label="不透明" :step="0.05" :maxValue="1" @finish="(value) => finish('opacity', value)" />
          <number-slider v-model="state.innerElement.radius" style="font-size: 14px" label="圆角" :maxValue="Math.min(Number(state.innerElement.record?.width), Number(state.innerElement.record?.height))" @finish="(value) => finish('radius', value)" />
          <!-- <number-slider v-model="innerElement.letterSpacing" style="font-size: 14px" label="字距" labelWidth="40px" :step="0.05" :minValue="-50" :maxValue="innerElement.fontSize" @finish="(value) => finish('letterSpacing', value)" />
        <number-slider v-model="innerElement.lineHeight" style="font-size: 14px" label="行距" labelWidth="40px" :step="0.05" :minValue="0" :maxValue="2.5" @finish="(value) => finish('lineHeight', value)" /> -->
        </div>
      </el-collapse-item>
      <el-collapse-item v-if="state.innerElement.isNinePatch" title="点九图设置" name="3">
        <number-slider
          v-model="state.innerElement.sliceData.ratio"
          :step="0.01" label="比率" :maxValue="10" 
          @finish="(value) => finishSliceData('ratio', value)"
        />
        <number-slider
          v-model="state.innerElement.sliceData.left"
          :step="0.5" label="大小"
          @finish="(value) => finishSliceData('left', value)"
        />
      </el-collapse-item>
      <br />
      <icon-item-select class="style-item" label="" :data="layerIconList" @finish="layerAction" />
      <icon-item-select :data="alignIconList" @finish="alignAction" />
      <br />
    </el-collapse>
    <!-- <CropImage ref="crop" @done="cropDone" /> -->
    <inner-tool-bar v-show="state.innerElement.cropEdit" :style="toolBarStyle">
      <number-slider
        v-model="state.innerElement.zoom"
        class="inner-bar" label="缩放" labelWidth="40px"
        :step="0.01" :minValue="1" :maxValue="3"
      />
      <i style="padding: 0 8px; cursor: pointer" class="icon sd-queren" @click="imgCrop(false)" />
    </inner-tool-bar>
    <picBox ref="picBoxRef" @select="selectDone" />
    <imageCutout ref="imageCutoutRef" @done="cutImageDone" />
  </div>
</template>

<script lang="ts" setup>
// 图片组件样式
// const NAME = 'w-image-style'
import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import numberInput from '../../settings/numberInput.vue'
import iconItemSelect, { TIconItemSelectData } from '../../settings/iconItemSelect.vue'
import numberSlider from '../../settings/numberSlider.vue'
// import textInput from '../../settings/textInput.vue'
// import CropImage from '@/components/business/cropper/CropImage.vue'
// import ContainerWrap from '../../settings/EffectSelect/ContainerWrap.vue'
// import uploader from '@/components/common/Uploader/index.vue'
import { getImage } from '@/common/methods/getImgDetail'
import api from '@/api'
import layerIconList from '@/assets/data/LayerIconList'
import alignIconList from '@/assets/data/AlignListData'
import picBox from '@/components/business/picture-selector'
import imageCutout from '@/components/business/image-cutout'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import wImageSetting, { TImageSetting } from './wImageSetting'
import { TGetImageListResult } from '@/api/material'

type TState = {
  picBoxShow: boolean
  activeNames: string[]
  innerElement: TImageSetting
  tag: boolean
  ingoreKeys: string[]
  layerIconList: TIconItemSelectData[]
  alignIconList: TIconItemSelectData[]
  toolBarStyle: Record<string, any>
}

const state = reactive<TState>({
  picBoxShow: false,
  activeNames: ['2', '3', '4'],
  innerElement: JSON.parse(JSON.stringify(wImageSetting)),
  tag: false,
  ingoreKeys: ['left', 'top', 'name', 'width', 'height', 'radiusTopLeft', 'radiusTopRight', 'radiusBottomLeft', 'radiusBottomRight'],
  layerIconList: layerIconList.concat([
    {
      key: 'flip',
      icon: 'sd-zuoyoufanzhuan',
      extraIcon: true,
      tip: '水平翻转',
      value: 'Y',
    },
    {
      key: 'flip',
      icon: 'sd-shangxiafanzhuan',
      extraIcon: true,
      tip: '垂直翻转',
      value: 'X',
    },
  ]),
  alignIconList,
  toolBarStyle: {},
})

const picBoxRef = ref<typeof picBox | null>(null)
const imageCutoutRef = ref<typeof imageCutout | null>(null)

const store = useStore()
const {
  dActiveElement, dMoving, dWidgets
} = useSetupMapGetters(['dActiveElement', 'dMoving', 'dWidgets'])
// computed: {
//   ...mapGetters(['dActiveElement', 'dMoving', 'dWidgets']),
// },

let lastUuid: string | undefined = undefined
let tag: boolean
let toolBarStyle: { left: string, top: string } | null = null

onBeforeUnmount(() => {
  imgCrop(false)
  cropHandle()
})

watch(
  () => dActiveElement.value,
  (newValue, oldValue) => {
    change()
    // 失焦取消编辑模式
    if (newValue.uuid != lastUuid && typeof lastUuid !== 'undefined') {
      imgCrop(false)
    }
    lastUuid = newValue.uuid
  },
  { deep: true }
)

watch(
  () => state.innerElement,
  (newValue, oldValue) => {
    changeValue()
    cropHandle()
  },
  { deep: true }
)

function created() {
  change()
}

created()

// ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex', 'addWidget']),

function change() {
  tag = true
  state.innerElement = JSON.parse(JSON.stringify({ ...state.innerElement, ...dActiveElement.value }))
}

function changeValue() {
  if (tag) {
    tag = false
    return
  }
  if (dMoving.value) {
    return
  }
  for (let key in state.innerElement) {
    if (state.ingoreKeys.indexOf(key) !== -1) {
      dActiveElement.value[key] = state.innerElement[(key as keyof TImageSetting)]
    } else if (key !== 'cropEdit' && key !== 'record' && state.innerElement[(key as keyof TImageSetting)] !== dActiveElement.value[key]) {
      store.dispatch('updateWidgetData', {
        uuid: dActiveElement.value.uuid,
        key: key,
        value: state.innerElement[(key as keyof TImageSetting)],
      })
      // updateWidgetData({
      //   uuid: this.dActiveElement.uuid,
      //   key: key,
      //   value: this.innerElement[key],
      // })
    }
  }
}

function finishSliceData(key: string, value: number | number[]) {
  const data = dActiveElement.value.sliceData
  if (data) {
    data[key] = value
    store.dispatch('updateWidgetData', {
      uuid: dActiveElement.value.uuid,
      key: 'sliceData',
      value: data,
      pushHistory: true,
    })
    // updateWidgetData({
    //   uuid: dActiveElement.uuid,
    //   key: 'sliceData',
    //   value: data,
    //   pushHistory: true,
    // })
  }
}

function finish(key: string = "", value: number | number[] | string | null = "") {
  store.dispatch('updateWidgetData', {
    uuid: dActiveElement.value.uuid,
    key: key,
    value: value,
    pushHistory: true,
  })
  // this.updateWidgetData({
  //   uuid: this.dActiveElement.uuid,
  //   key: key,
  //   value: value,
  //   pushHistory: true,
  // })
}

function layerAction(item: TIconItemSelectData) {
  if (item.key === 'zIndex') {
    store.dispatch("updateLayerIndex", {
      uuid: dActiveElement.value.uuid,
      value: item.value,
    })
    // this.updateLayerIndex({
    //   uuid: this.dActiveElement.uuid,
    //   value: item.value,
    // })
  } else {
    finish(item.key || "", item.value === dActiveElement.value.flip ? null : item.value)
  }
}

async function alignAction(item: TIconItemSelectData) {
  store.dispatch("updateAlign", {
    align: item.value,
    uuid: dActiveElement.value.uuid,
  })
  // this.updateAlign({
  //   align: item.value,
  //   uuid: this.dActiveElement.uuid,
  // })
  await nextTick()
  store.commit('updateRect')
}

function openCropper() {
  // this.$refs.crop.open(this.innerElement, this.innerElement.cropData)
}

// function cropDone({ newImg, data, width, height }) {
//   this.innerElement.imgUrl = newImg
//   this.innerElement.cropData = data
//   this.innerElement.width = width.toFixed(0)
//   this.innerElement.height = height.toFixed(0)
// }


// async function changeContainer(setting) {
//   const index = this.dWidgets.findIndex((x) => x.uuid == this.innerElement.uuid)
//   const img = await getImage(setting.svgUrl)
//   setting.width = this.innerElement.width
//   setting.height = img.height * (this.innerElement.width / img.width)
//   setting.left = this.innerElement.left
//   setting.top = this.innerElement.top
//   setting.imgUrl = this.innerElement.imgUrl
//   this.dWidgets.splice(index, 1)
//   this.addWidget(setting)
// }

// async function uploadImgDone(img) {
//   this.$store.commit('setShowMoveable', false)
//   await api.material.addMyPhoto(img)
//   // this.innerElement.width = img.width
//   this.innerElement.height = img.height * (this.innerElement.width / img.width)
//   this.innerElement.imgUrl = img.url
//   this.$store.commit('setShowMoveable', true)
// }


async function selectDone(img: TGetImageListResult) {
  state.innerElement.imgUrl = img.url
  const loadImg = await getImage(img.url)
  state.innerElement.width = loadImg.width * store.getters.dZoom / 100
  state.innerElement.height = loadImg.height * store.getters.dZoom / 100
  // this.imgCrop(true)
}

function imgCrop(val: boolean) {
  // TODO: 画布内图像裁剪
  const el = document.getElementById(state.innerElement.uuid || "")
  if (!el) return
  const { left, top } = el.getBoundingClientRect()
  toolBarStyle = { left: left + 'px', top: top + 'px' }
  state.innerElement.cropEdit = val
  store.commit('setShowRotatable', !val)
}


function cropHandle() {
  store.commit('setCropUuid', state.innerElement.cropEdit ? state.innerElement.uuid : -1)
}

// 图库选择器
function openPicBox() {
  if (picBoxRef.value) {
    picBoxRef.value.open()
  }
}

// 打开抠图
function openImageCutout() {
  fetch(state.innerElement.imgUrl || "")
    .then((response) => response.blob())
    .then((blob) => {
      const file = new File([blob], `image_${Math.random()}.jpg`, { type: 'image/jpeg' })
      if (imageCutoutRef.value) {
        imageCutoutRef.value.open(file)
      }
    })
    .catch((error) => {
      console.error('获取图片失败:', error)
    })
}

// 完成抠图
async function cutImageDone(url: string) {
  setTimeout(() => {
    state.innerElement.imgUrl = url
  }, 300)
}

</script>

<style lang="less" scoped>
#w-image-style {
  height: 100%;
  width: 100%;
}
.line-layout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.style-item {
  margin-bottom: 10px;
}
.setting-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.options {
  margin-bottom: 0.7rem;
  &__upload {
    width: auto;
    margin-left: 10px;
    display: inline-block;
  }
  .icon {
    margin-right: 0.3em;
  }
}

.slide-wrap {
  margin-top: 18px;
  width: 100%;
  padding: 16px;
  background: #f3f5f7;
  border-radius: 6px;
}

.inner-bar {
  margin: 0 10px;
  width: 240px;
}
</style>
