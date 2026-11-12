<!--
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 模板列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-06 21:16:00
-->
<template>
  <div class="wrap">
    <search-header v-model="state.searchKeyword" @change="cateChange" />

    <el-divider v-show="state.title" style="margin-top: 1.7rem" content-position="left">
      <span style="font-weight: 600">{{ state.title }}</span>
    </el-divider>

    <ul ref="listRef" v-infinite-scroll="load" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <img-water-fall :listData="state.list" @select="selectItem" />
      <div v-show="state.loading" class="loading"><i class="el-icon-loading"></i> {{ $t('common.loadingMore') }}</div>
      <div v-show="state.loadDone" class="loading">{{ $t('common.allLoaded') }}</div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import i18n from '@/languages'
import { reactive, ref } from 'vue'
import api from '@/api'

import { LocationQueryValue, useRoute, useRouter } from 'vue-router'
// import chooseType from './components/chooseType.vue'
// import editModel from './components/editModel.vue'
import searchHeader from './components/searchHeader.vue'
import useConfirm from '@/common/methods/confirm'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import imgWaterFall from './components/imgWaterFall.vue'
import { IGetTempListData } from '@/api/home'
import { useControlStore, useCanvasStore, useUserStore, useHistoryStore, useWidgetStore, useForceStore } from '@/store'
import { storeToRefs } from 'pinia'

type TState = {
  loading: boolean
  loadDone: boolean
  list: IGetTempListData[]
  title: string
  searchKeyword: string
}

type TPageOptions = {
  page: number
  pageSize: number
  cate: number | string
  state?: string
}

const listRef = ref<HTMLElement | null>(null)
const route = useRoute()
const router = useRouter()

const controlStore = useControlStore()

const userStore = useUserStore()
const pageStore = useCanvasStore()
const widgetStore = useWidgetStore()
const forceStore = useForceStore()
const state = reactive<TState>({
  loading: false,
  loadDone: false,
  list: [],
  title: i18n.global.t('editor.panel.sampleTemplates'),
  searchKeyword: '',
})

// const { tempEditing } = useSetupMapGetters(['tempEditing'])
const { dHistoryParams } = storeToRefs(useHistoryStore())

const pageOptions: TPageOptions = { page: 0, pageSize: 20, cate: '' }
const { cate, edit } = route.query
cate && (pageOptions.cate = (cate as LocationQueryValue) ?? 1)
// 模板编辑为管理员能力，仅管理员角色可进入编辑态（数据侧由后端 requireAdmin 兜底）
const isAdmin = (() => {
  try {
    return JSON.parse(localStorage.getItem('xp_user') || 'null')?.role === 1
  } catch {
    return false
  }
})()
edit && isAdmin && userStore.managerEdit(true)

// onMounted(async () => {})

const load = async (init: boolean = false, stat?: string) => {
  stat && (pageOptions.state = stat)

  if (init && listRef.value) {
    listRef.value.scrollTop = 0
    state.list = []
    pageOptions.page = 0
    state.loadDone = false
  }
  if (state.loadDone || state.loading) {
    return
  }

  state.loading = true
  pageOptions.page += 1

  const res = await api.home.getTempList({ search: state.searchKeyword, ...pageOptions })
  res.list.length <= 0 && (state.loadDone = true)
  state.list = state.list.concat(res.list)
  setTimeout(() => {
    state.loading = false
    checkHeight()
  }, 100)
}

// 当首屏内容不足以填满容器时，继续加载下一页，避免出现空白区域
function checkHeight() {
  if (!listRef.value || state.loadDone) return
  const content = listRef.value.firstElementChild as HTMLElement | null
  if (content && listRef.value.offsetHeight > content.offsetHeight) load()
}

function cateChange(type: any) {
  state.title = type.name
  const init = pageOptions.cate != type.id
  pageOptions.cate = type.id
  load(init, pageOptions.state)
}

let hideReplacePrompt: any = localStorage.getItem('hide_replace_prompt')
async function selectItem(item: IGetTempListData) {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  if (!hideReplacePrompt && dHistoryParams.value.length > 0) {
    const doNotPrompt = await useConfirm(i18n.global.t('editor.panel.addToDesign'), i18n.global.t('editor.panel.templateReplaces'), 'warning', { confirmButtonText: i18n.global.t('editor.panel.gotIt'), cancelButtonText: i18n.global.t('editor.panel.dontRemind') })
    if (!doNotPrompt) {
      localStorage.setItem('hide_replace_prompt', '1')
      hideReplacePrompt = true
    }
  }
  userStore.managerEdit(false)
  widgetStore.setDWidgets([])
  setTempId(item.id)

  let result = null
  if (!item.data) {
    const res = await api.home.getTempDetail({ id: item.id })
    result = JSON.parse(res.data)
  } else {
    result = JSON.parse(item.data)
  }
  if (Array.isArray(result)) {
    const { global, layers } = result[0]
    pageStore.setDPage(global)
    widgetStore.setTemplate(layers)
  } else {
    const { page, widgets } = result
    pageStore.setDPage(page)
    widgetStore.setTemplate(widgets)
  }
  setTimeout(() => {
    forceStore.setZoomScreenChange()
  }, 300)
  widgetStore.selectWidget({
    uuid: '-1',
  })
}

function setTempId(tempId: number | string) {
  // 选择新模板时清除旧作品 id，避免下载/截图接口按 id 优先加载旧作品。
  router.push({ path: '/home', query: { tempid: tempId }, replace: true })
}

defineExpose({
  load,
  cateChange,
  listRef,
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}

.infinite-list {
  height: 100%;
  margin-top: 1rem;
  padding-bottom: 150px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.infinite-list::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
// .list {
//   width: 100%;
//   padding: 4px 0 0 10px;
//   &__img {
//     cursor: pointer;
//     width: 128px;
//     height: auto;
//     position: relative;
//     &-mask {
//       opacity: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0, 0, 0, 0.12);
//       position: absolute;
//       z-index: 1;
//       top: 0;
//       left: 0;
//     }
//   }
//   &__img:hover {
//     background: rgba(0, 0, 0, 0.04);
//   }
//   &__img:hover > &__img-mask {
//     opacity: 1;
//   }
// }

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
