<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-11 18:48:23
 * @Description: 照片图库 Form:Unsplash无版权图片
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-19 10:04:39
-->
<template>
  <div class="wrap">
    <search-header type="none" @change="searchChange" />
    <div style="height: 0.5rem" />
    <classHeader v-show="!state.currentCategory" :types="state.types" @select="selectTypes">
      <template v-slot="{ index }">
        <photo-list :isShort="true" :listData="state.showList[index]" @load="getDataList" @drag="dragStart($event, state.showList[index])" @select="selectImg($event, state.showList[index])" />
      </template>
    </classHeader>
    <div v-if="state.currentCategory">
      <classHeader :is-back="true" @back="back">{{ state.currentCategory.name }}</classHeader>
      <br /><br /><br />
      <div style="margin: 0 1rem; height: 100vh">
        <photo-list :isDone="state.loadDone" :listData="state.recommendImgList" @load="getDataList" @drag="dragStart" @select="selectImg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 图片列表
// const NAME = 'img-list-wrap'
import { toRefs, reactive, computed, onMounted } from 'vue'
// import wImage from '../../widgets/wImage/wImage.vue'
import wImageSetting from '../../widgets/wImage/wImageSetting'
import api from '@/api'
import { useStore } from 'vuex'
import setImageData from '@/common/methods/DesignFeatures/setImage'
import { storeToRefs } from 'pinia'
import { usePageStore } from '@/pinia'
import { TGetImageListResult } from '@/api/material'

type TProps = {
  active?: boolean
}

type TState = {
  recommendImgList: TGetImageListResult[],
  loadDone: boolean
  page: number
  currentCategory: TCurrentCategory | null,
  types: [],
  showList: TGetImageListResult[][],
}

type TCurrentCategory = {
  name: string
  id?: number
}

const selectImg = async (index, list) => {
  const item = list ? list[index] : state.recommendImgList[index]
  store.commit('setShowMoveable', false) // 清理掉上一次的选择
  let setting = JSON.parse(JSON.stringify(wImageSetting))
  const img = await setImageData(item) // await getImage(item.url)
  setting.width = img.width
  setting.height = img.height // parseInt(100 / item.value.ratio, 10)
  setting.imgUrl = item.url
  const { width: pW, height: pH } = dPage
  setting.left = pW / 2 - img.width / 2
  setting.top = pH / 2 - img.height / 2
  store.dispatch('addWidget', setting)
}

const props = defineProps<TProps>()
const store = useStore()
const { dPage } = storeToRefs(usePageStore())
const state = reactive<TState>({
  recommendImgList: [],
  loadDone: false,
  page: 0,
  currentCategory: null,
  types: [],
  showList: [],
})
let loading = false

onMounted(async () => {
  if (state.types.length <= 0) {
    const types = await api.material.getKinds({ type: 4 })
    state.types = types
    for (const iterator of types) {
      const { list } = await api.material.getImagesList({ cate: iterator.id, pageSize: 2 })
      state.showList.push(list)
    }
  }
})

const selectImg = async (index: number, list: TGetImageListResult[]) => {
  const item = list ? list[index] : state.recommendImgList[index]
  store.commit('setShowMoveable', false) // 清理掉上一次的选择
  let setting = JSON.parse(JSON.stringify(wImageSetting))
  const img = await setImageData(item) // await getImage(item.url)
  setting.width = img.width
  setting.height = img.height // parseInt(100 / item.value.ratio, 10)
  setting.imgUrl = item.url
  const { width: pW, height: pH } = dPage.value
  setting.left = pW / 2 - img.width / 2
  setting.top = pH / 2 - img.height / 2
  store.dispatch('addWidget', setting)
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
  store.commit('selectItem', { data: { value: item }, type: 'image' })
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
  selectImg,
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
}
</style>
