<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 素材列表，主要用于文字组合列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-02-29 16:54:28
-->
<template>
  <div class="wrap">
    <!-- <div class="search__wrap">
      <el-input v-model="searchValue" placeholder="输入关键词搜索" class="input-with-select">
        <template #append>
          <el-button><i class="iconfont icon-search"></i></el-button>
        </template>
      </el-input>
    </div>
    <el-divider content-position="left">推荐组件</el-divider> -->
    <classHeader v-show="!state.currentCategory" :types="state.types" @select="selectTypes">
      <template v-slot="{ index }">
        <div class="list-wrap">
          <div
            v-for="(item, i) in state.showList[index]" :key="i + 'sl'"
            draggable="false" 
            @mousedown="dragStart($event, item)" @mousemove="mousemove"
            @mouseup="mouseup" @click.stop="selectItem(item)"
            @dragstart="dragStart($event, item)"
          >
            <el-image class="list__img-thumb" :src="item.cover" fit="contain" lazy loading="lazy"></el-image>
          </div>
        </div>
      </template>
    </classHeader>

    <ul v-if="state.currentCategory" v-infinite-scroll="load" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <classHeader :is-back="true" @back="back">{{ state.currentCategory.name }}</classHeader>
      <el-space fill wrap :fillRatio="30" direction="horizontal" class="list">
        <div
          v-for="(item, i) in state.list" :key="i + 'i'"
          class="list__item" draggable="false"
          @mousedown="dragStart($event, item)" @mousemove="mousemove"
          @mouseup="mouseup" @click.stop="selectItem(item)"
          @dragstart="dragStart($event, item)"
        >
          <!-- <edit-model :isComp="true" @action="action($event, item, i)"> -->
          <el-image class="list__img" :src="item.cover" fit="contain" lazy loading="lazy" />
          <!-- </edit-model> -->
        </div>
      </el-space>
      <div v-show="state.loading" class="loading"><i class="el-icon-loading"></i> 拼命加载中</div>
      <div v-show="state.loadDone" class="loading">全部加载完毕</div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import api from '@/api'
import { useStore } from 'vuex'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import DragHelper from '@/common/hooks/dragHelper'
import setItem2Data from '@/common/methods/DesignFeatures/setImage'
import { TGetCompListResult, TGetTempDetail, TTempDetail } from '@/api/home'

type TState = {
  loading: boolean
  loadDone: boolean
  list: TGetCompListResult[]
  searchValue: string
  currentCategory: TGetCompListResult | null
  types: []
  showList: TGetCompListResult[][]
}

// 拖拽效果相关
const dragHelper = new DragHelper()
let isDrag = false
let startPoint = { x: 99999, y: 99999 }
let tempDetail: TTempDetail | null = null
// 缓存组件用以减少接口请求的次数
const compsCache: any = {}
const state = reactive<TState>({
  loading: false,
  loadDone: false,
  list: [],
  searchValue: '',
  currentCategory: null,
  types: [],
  showList: [],
})
const store = useStore()
const pageOptions = { type: 1, page: 0, pageSize: 20 }

onMounted(async () => {
  if (state.types.length <= 0) {
    const types = await api.material.getKinds({ type: 3 })
    state.types = types
    for (const iterator of types) {
      const { list } = await api.home.getCompList({
        cate: iterator.id,
        type: 1,
        pageSize: 3,
      })
      state.showList.push(list)
    }
  }
})
const mouseup = (e: MouseEvent) => {
  e.preventDefault()
  // setTimeout(() => {
  isDrag = false
  tempDetail = null
  startPoint = { x: 99999, y: 99999 }
  // }, 10)
}

const mousemove = (e: MouseEvent) => {
  e.preventDefault()
  if (e.x - startPoint.x > 2 || e.y - startPoint.y > 2) {
    isDrag = true
  }
}

const load = async (init: boolean = false) => {
  if (init) {
    state.list = []
    pageOptions.page = 0
    state.loadDone = false
  }

  if (state.loadDone || state.loading) {
    return
  }

  state.loading = true
  pageOptions.page += 1

  const res = await api.home.getCompList({
    ...pageOptions,
    cate: state.currentCategory?.id,
  })
  if (init) {
    state.list = res?.list
  } else {
    res?.list.length <= 0 && (state.loadDone = true)
    state.list = state.list.concat(res?.list)
  }
  setTimeout(() => {
    state.loading = false
  }, 100)
}

type TActionParam = {
  name: string
  value: string
}

function action({ name, value }: TActionParam, item: TGetCompListResult, index: number) {
  switch (name) {
    case 'del':
      delComp(item, index)
      break
  }
}

function delComp({ id }: TGetCompListResult, index: number) {
  api.home.removeComp({ id })
  state.list.splice(index, 1)
}

const selectTypes = (item: TGetCompListResult) => {
  state.currentCategory = item
  load(true)
}

const back = () => {
  state.currentCategory = null
}

const dragStart = async (e: MouseEvent, { id, width, height, cover }: TGetCompListResult) => {
  startPoint = { x: e.x, y: e.y }
  // tempDetail = await api.home.getTempDetail({ id, type: 1 })
  // let finalWidth = tempDetail.width
  // 计算出拖拽到画布数值
  const img = await setItem2Data({ width, height, url: cover })
  dragHelper.start(e, img.canvasWidth)
  tempDetail = await getCompDetail({ id, type: 1 })
  if (Array.isArray(JSON.parse(tempDetail.data))) {
    store.commit('selectItem', { data: JSON.parse(tempDetail.data), type: 'group' })
  } else {
    store.commit('selectItem', { data: JSON.parse(tempDetail.data), type: 'text' })
  }
}

const selectItem = async (item: TGetCompListResult) => {
  if (isDrag) {
    return
  }
  store.commit('setShowMoveable', false) // 清理掉上一次的选择
  tempDetail = tempDetail || (await getCompDetail({ id: item.id, type: 1 }))
  // let group = JSON.parse(tempDetail.data)
  const group: any = await getComponentsData(tempDetail.data)
  let parent: Record<string, any> = { x: 0, y: 0 }
  const { width: pW, height: pH } = store.getters.dPage

  Array.isArray(group) &&
    group.forEach((element) => {
      element.type === 'w-group' && (parent = element)
    })
  if (parent.isContainer) {
    group.forEach((element: any) => {
      element.left += (pW - parent.width) / 2
      element.top += (pH - parent.height) / 2
    })
    store.dispatch('addGroup', group)
  } else {
    group.text && (group.text = decodeURIComponent(group.text))
    group.left = pW / 2 - group.fontSize * (group.text.length / 2)
    group.top = pH / 2 - group.fontSize / 2
    store.dispatch('addWidget', group)
  }
}

    function getCompDetail(params: TGetTempDetail): Promise<TTempDetail> {
      // 有缓存则直接返回组件数据，否则请求获取数据
      return new Promise((resolve) => {
        if (compsCache[params.id]) {
          resolve(compsCache[params.id])
        } else api.home.getTempDetail(params).then((res: any) => {
          resolve(res)
          compsCache[params.id] = res // 缓存请求的组件数据
        })
      })
    }

defineExpose({
  load,
  action,
  back,
  selectTypes,
  mouseup,
  mousemove,
  dragStart,
  selectItem,
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}

.search__wrap {
  padding: 1.4rem 1rem 0.8rem 1rem;
}

.infinite-list {
  height: 100%;
  padding-bottom: 150px;
}
.list {
  width: 100%;
  // padding: 20px 0 0 10px;
  padding: 3.1rem 0 0 1rem;
  gap: 0 !important;
  &__item {
    overflow: hidden;
    background: #f8fafc;
    margin-bottom: 8px;
    margin-right: 8px;
  }
  &__img {
    cursor: grab;
    width: 142px;
    height: 142px;
    padding: 4px;
    border-radius: 4px;
  }
  &__img-thumb {
    cursor: grab;
    width: 90px;
    height: 90px;
    background: #f8fafc;
    padding: 4px;
    border-radius: 4px;
  }
  &__img:hover,
  &__img-thumb:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.list-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.8rem;
}
</style>
