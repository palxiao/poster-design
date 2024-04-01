<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 背景图
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-11 01:42:36
-->
<template>
  <div class="wrap">
    <div class="color__box" :style="modelStyle.color">
      <div v-for="c in state.colors" :key="c" :style="{ background: c }" class="color__item" @click="setBGcolor(c)"></div>
    </div>
    <ul v-if="state.showList" v-infinite-scroll="loadData" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <div class="list" :style="modelStyle.list">
        <imageTip v-for="(item, i) in state.bgList" :key="i + 'i'" :detail="item">
          <el-image class="list__img" :src="item.thumb" fit="cover" lazy loading="lazy" @click.stop="selectItem(item)" @dragstart="dragStart($event, item)"></el-image>
        </imageTip>
      </div>
      <div v-show="state.loading" class="loading"><i class="el-icon-loading"></i> 拼命加载中</div>
      <div v-show="state.loadDone" class="loading">全部加载完毕</div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import api from '@/api'

import { ElImage } from 'element-plus'
import { TGetImageListResult } from '@/api/material';
import { usePageStore, useWidgetStore } from '@/store';

type TCommonPanelData = {
  color: string
  list: string
}

type TTmpModalData = {
  widgetPanel: TCommonPanelData
  stylePanel: TCommonPanelData
}

type TProps = {
  model: 'widgetPanel'
}

type TState = {
  loading: boolean
  loadDone: boolean
  bgList: TGetImageListResult[]
  showList: boolean
  colors: string[]

}

const { model } = defineProps<TProps>()



const pageStore = usePageStore()
const widgetStore = useWidgetStore()

const state = reactive<TState>({
  loading: false,
  loadDone: false,
  bgList: [],
  showList: true,
  colors: ['#000000ff', '#999999ff', '#CCCCCCff', '#FFFFFFff', '#E65353ff', '#FFD835ff', '#70BC59ff', '#607AF4ff', '#976BEEff'],
})

// 临时用于改变样式
const models: TTmpModalData = {
  widgetPanel: {
    color: 'padding: 1.2rem 1rem',
    list: 'grid-template-columns: auto auto auto;padding: 0 1rem;',
  },
  stylePanel: {
    color: 'padding: 1.2rem 0;',
    list: 'grid-template-columns: repeat(3, 76px);',
  }
}

const modelStyle = computed(() => models[model])

const pageOptions = { page: 0, pageSize: 20 }

const loadData = () => {
  if (state.loading) {
    return
  }
  load()
}

const load = async (init: boolean = false) => {
  if (state.loadDone) {
    return
  }
  state.loading = true
  pageOptions.page += 1

  if (init) {
    state.bgList = []
    pageOptions.page = 1
  }

  await api.material.getImagesList({ cate: 16, page: pageOptions.page }).then(({ list }) => {
    if (list.length > 0) {
      state.bgList.push(...list)
    } else {
      state.loadDone = true
    }
  })

  setTimeout(() => {
    state.loading = false
  }, 100)
}

function setBGcolor(color: string) {
  pageStore.updatePageData({
    key: "backgroundImage",
    value: ''
  })
  pageStore.updatePageData({
    key: 'backgroundColor',
    value: color,
    pushHistory: true
  })
  widgetStore.selectWidget({
    uuid: '-1'
  })
  // store.dispatch('selectWidget', {
  //   uuid: '-1',
  // })
}

async function selectItem(item: TGetImageListResult) {
  // this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择
  pageStore.updatePageData({
    key: 'backgroundTransform',
    value: {},
  })
  pageStore.updatePageData({
    key: 'backgroundImage',
    value: item.url,
    pushHistory: true,
  })
  widgetStore.selectWidget({
    uuid: '-1'
  })
  // store.dispatch('selectWidget', {
  //   uuid: '-1',
  // })
}

function dragStart(_: MouseEvent, _item: TGetImageListResult) {
  widgetStore.setSelectItem({ data: {}, type: 'bg' })
  // store.commit('selectItem', { data: {}, type: 'bg' })
}


defineExpose({
  load,
  setBGcolor,
  loadData,
  modelStyle
})

</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}

.infinite-list {
  // margin-right: 0.4rem;
  height: 100%;
  padding-bottom: 150px;
  // scrollbar-width: none; /* Firefox */
  // -ms-overflow-style: none; /* IE 10+ */
}
// .infinite-list::-webkit-scrollbar {
//   display: none; /* Chrome Safari */
// }
.list {
  width: 100%;
  display: grid;
  grid-gap: 5px;
  &__img {
    cursor: pointer;
    width: 100%;
    height: 92px;
    border-radius: 4px;
  }
  &__img:hover::before {
    content: ' ';
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
}

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.color {
  &__box {
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    border: 1px solid rgba(0, 0, 0, 0.08);
    margin: 2.8px;
    width: 43px;
    height: 36px;
    border-radius: 2px;
    cursor: pointer;
  }
}
</style>
