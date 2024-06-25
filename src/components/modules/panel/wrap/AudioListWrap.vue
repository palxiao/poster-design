<template>
  <div class="wrap">
    <menu-show left="音频:韩文歌">
      <template v-slot:right>
        <el-switch v-model="setting.isSet" />
      </template>
    </menu-show>
    <menu-show left="颜色">
      <template v-slot:right>
        <el-switch v-model="setting.isSet" />
      </template>
    </menu-show>
    <menu-show left="循环">
      <template v-slot:right>
        <el-switch v-model="setting.loop" />
      </template>
    </menu-show>
  </div>
</template>

<script setup lang="ts">
// 图片列表
// const NAME = 'img-list-wrap'
import { toRefs, reactive, computed, onMounted } from 'vue'
import {wAudioSetting} from '../../widgets/wAudio/wAudioSetting'
import api from '@/api'

import setImageData from '@/common/methods/DesignFeatures/setImage'
import { storeToRefs } from 'pinia'
import { useControlStore, useCanvasStore, useWidgetStore } from '@/store'

type TProps = {
  active?: boolean
}

type TState = {
  loadDone: boolean
  page: number
  currentCategory: TCurrentCategory | null,
  types: [],
  showList: [],
}

type TCurrentCategory = {
  name: string
  id?: number
}
let setting = JSON.parse(JSON.stringify(wAudioSetting))
const props = defineProps<TProps>()


const controlStore = useControlStore()
const widgetStore = useWidgetStore()

const { dPage } = storeToRefs(useCanvasStore())
const state = reactive<TState>({
  loadDone: false,
  page: 0,
  currentCategory: null,
  // types: [],
  showList: [],
})
let loading = false

onMounted(async () => {
  // if (state.types.length <= 0) {
  //   const types = await api.material.getKinds({ type: 4 })
  //   state.types = types
  //   for (const iterator of types) {
  //     const { list } = await api.material.getImagesList({ cate: iterator.id, pageSize: 2 })
  //     state.showList.push(list)
  //   }
  // }
  state.showList.push({url: 'https://hxdata.huanxiinv.com/system_assets_music/Tg2kxGdaCR2pfEiO.mp3?v=1705919546', name: '韩文歌', type: '欢快'})
})

const selectAudio = async (item) => {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择

  let setting = JSON.parse(JSON.stringify(wAudioSetting))
  // const img = await setImageData(item) // await getImage(item.url)
  setting.imgUrl = item.url
  const { width: pW, height: pH } = dPage.value
  setting.left = pW / 2 - img.width / 2
  setting.top = pH / 2 - img.height / 2

  widgetStore.addWidget(setting)
  // store.dispatch('addWidget', setting)
}

const getDataList = async () => {
  if (state.loadDone || loading) {
    return
  }
  loading = true
  state.page += 1
  let { list = [], total } = await api.material.getImagesList({ cate: state.currentCategory?.id, page: state.page, pageSize: 30 })
  list.length <= 0 ? (state.loadDone = true) : (state.recommendImgList = state.recommendImgList.concat(list))
  setTimeout(() => {
    loading = false
  }, 100)
}

const dragStart = (index: number, list: TGetImageListResult[]) => {
  const item = list ? list[index] : state.recommendImgList[index]

  widgetStore.setSelectItem({ data: { value: item }, type: 'image' })
  // store.commit('selectItem', { data: { value: item }, type: 'image' })
}

const searchChange = (e: Event) => {
  console.log(e)
}

const selectTypes = (item: TCurrentCategory) => {
  state.currentCategory = item
  getDataList()
}

const back = () => {
  state.currentCategory = null
  state.page = 0
  state.loadDone = false
  state.recommendImgList = []
}

defineExpose({
  selectAudio,
  getDataList,
  dragStart,
  searchChange,
  selectTypes,
  back,
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
