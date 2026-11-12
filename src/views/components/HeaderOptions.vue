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
 * @Date: 2022-01-12 11:26:53
 * @Description: 顶部操作按钮组
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2026-08-31 21:36:33
-->
<template>
  <div class="top-title"><el-input v-model="state.title" :placeholder="$t('editor.header.untitledDesign')" class="input-wrap" /></div>
  <div class="top-icon-wrap">
    <template v-if="tempEditing">
      <el-button plain type="primary" :loading="state.loading" :disabled="state.loading" @click="saveTemp">{{ $t('editor.header.saveTemplate') }}</el-button>
      <el-button @click="userStore.managerEdit(false)">{{ $t('common.cancel') }}</el-button>
      <div class="divide__line">|</div>
    </template>
    <watermark-option style="margin-right: 0.5rem" />
    <slot />
  </div>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
</template>

<script lang="ts" setup>
import i18n from '@/languages'
import api from '@/api'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import _dl from '@/common/methods/download'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import downloadBlob from '@/common/methods/download/downloadBlob'
import { useControlStore, useCanvasStore, useUserStore, useWidgetStore } from '@/store/index'
import { storeToRefs } from 'pinia'
import watermarkOption from './Watermark.vue'

type TProps = {
  modelValue?: boolean
}

type TEmits = {
  (event: 'change', data: { downloadPercent: number; downloadText: string }): void
  (event: 'update:modelValue', data: boolean): void
}

type TState = {
  stateBollean: boolean
  wmBollean: boolean
  title: string
  loading: boolean
}

const props = defineProps<TProps>()
const emit = defineEmits<TEmits>()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const widgetStore = useWidgetStore()

const canvasImage = ref<typeof SaveImage | null>(null)

const pageStore = useCanvasStore()
const controlStore = useControlStore()

const { dPage } = storeToRefs(pageStore)
const { tempEditing } = storeToRefs(userStore)
const { dWidgets, dLayouts } = storeToRefs(widgetStore)

const state = reactive<TState>({
  stateBollean: false,
  wmBollean: false,
  title: '',
  loading: false,
})

// 保存作品，返回保存后的作品 id（新建作品时返回创建后的新 id；失败返回 undefined）
async function save(silent: boolean = false) {
  if (tempEditing.value) {
    await saveTemp()
    return
  }
  if (!localStorage.getItem('xp_token')) {
    useNotification(i18n.global.t('editor.header.saveFailed'), i18n.global.t('editor.header.needLoginSave'), { type: 'warning' })
    return
  }
  const { id, tempid } = route.query
  const designId = typeof id === 'string' ? id : undefined
  const templateId = typeof tempid === 'string' ? tempid : undefined
  const res: any = await api.home.saveWorks({
    id: designId,
    title: state.title || i18n.global.t('editor.header.untitledDesign'),
    data: JSON.stringify(dLayouts.value),
    temp_id: templateId,
    width: Number(dPage.value.width),
    height: Number(dPage.value.height),
  })
  if (res?.id) {
    if (!silent) useNotification(i18n.global.t('editor.header.saveSuccess'), i18n.global.t('editor.header.designSaved'))
    if (!designId) router.replace({ path: '/home', query: { ...route.query, id: String(res.id) } })
    return res.id
  } else {
    useNotification(i18n.global.t('editor.header.saveFailed'), res?.msg || i18n.global.t('editor.header.designSaveFailed'), { type: 'error' })
  }
}

// 保存模板
async function saveTemp() {
  if (state.loading) return
  const { tempid, tempType: type } = route.query
  if (!tempid) return
  state.loading = true
  try {
    let res: any = null
    const data = widgetStore.dLayouts
    if (Number(type) == 1) {
      // 保存组件，组合元素要保证在最后一位，才能默认选中
      if (dWidgets.value[0].type === 'w-group') {
        const group = dWidgets.value.shift()
        if (!group) return
        group.record.width = 0
        group.record.height = 0
        dWidgets.value.push(group)
      }
      // TODO：如果保存组件不存在组合，则添加组合。该功能待优化
      if (!dWidgets.value.some((x: Record<string, any>) => x.type === 'w-group')) {
        alert(i18n.global.t('editor.header.groupRequired'))
        return
      }
      res = await api.home.saveTemp({ id: tempid, type, title: state.title || i18n.global.t('editor.header.untitledComponent'), data: JSON.stringify(dWidgets.value), width: dPage.value.width, height: dPage.value.height })
    } else res = await api.home.saveTemp({ id: tempid, title: state.title || i18n.global.t('editor.header.untitledTemplate'), data: JSON.stringify(data), width: dPage.value.width, height: dPage.value.height })
    if (res?.id || res?.result?.id || res?.stat) {
      useNotification(i18n.global.t('editor.header.saveSuccess'), i18n.global.t('editor.header.templateUpdated'))
    } else {
      useNotification(i18n.global.t('editor.header.saveFailed'), res?.msg || i18n.global.t('editor.header.templateSaveFailed'), { type: 'error' })
    }
  } catch (error: any) {
    useNotification(i18n.global.t('editor.header.saveFailed'), error?.message || i18n.global.t('editor.header.templateSaveFailed'), { type: 'error' })
  } finally {
    state.loading = false
  }
}

// 停用启用
async function stateChange(e: string | number | boolean) {
  const { tempid, tempType: type } = route.query
  const { stat } = await api.home.saveTemp({ id: tempid, type, state: e ? 1 : 0 })
  stat != 0 && useNotification(i18n.global.t('editor.header.saveSuccess'), i18n.global.t('editor.header.templateUpdated'))
}
async function download() {
  if (state.loading === true) {
    useNotification(i18n.global.t('editor.header.exporting'), i18n.global.t('editor.header.exportingWait'))
    return
  }
  state.loading = true
  const currentRecord = pageStore.dCurrentPage
  const backEndCapture: boolean = checkDownloadPoster(dLayouts.value[currentRecord])
  const fileName = `${state.title || i18n.global.t('editor.header.untitledWork')}.png`
  if (!backEndCapture) {
    // 无特殊条件命中则直接从前端出图，无需登录保存
    const { blob } = await canvasImage.value?.createPoster()
    downloadBlob(blob, fileName)
    state.loading = false
    return
  }
  // 服务端出图依赖作品数据，需先保存；无 id 的新作品在此静默创建，并返回新 id 供出图使用
  const savedId = await save(true)
  const { id, tempid } = route.query
  // 从服务端生成图片
  const { width, height } = dPage.value
  // 后台模板编辑页可能保留之前作品的 id；模板编辑时必须只使用 tempid，
  // 否则截图服务会按 id 优先加载另一条用户作品。
  const screenshotId = route.query.edit === '1' && tempid ? undefined : (savedId || id)
  const screenshotToken = screenshotId ? localStorage.getItem('xp_token') || '' : ''
  emit('update:modelValue', true)
  emit('change', { downloadPercent: 1, downloadText: i18n.global.t('editor.header.processing') })
  let timerCount = 0
  const animation = setInterval(() => {
    if (props.modelValue && timerCount < 75) {
      timerCount += RandomNumber(1, 10)
      emit('change', { downloadPercent: 1 + timerCount, downloadText: i18n.global.t('editor.header.composing') })
    } else {
      clearInterval(animation)
    }
  }, 800)
  await _dl.downloadImg(
      api.home.download({ id: screenshotId, tempid, width, height, index: pageStore.dCurrentPage, token: screenshotToken }) + '&r=' + Math.random(),
    (progress: number, xhr: any) => {
      if (props.modelValue) {
        clearInterval(animation)
        progress >= timerCount && emit('change', { downloadPercent: Number(progress.toFixed(0)), downloadText: i18n.global.t('editor.header.generating') })
      } else {
        xhr.abort()
        state.loading = false
      }
    },
    fileName,
  )
  emit('change', { downloadPercent: 100, downloadText: i18n.global.t('editor.header.downloadDone'), downloadMsg: '' })
  state.loading = false
}
function RandomNumber(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min)) + min
}

async function load(cb: () => void) {
  const { id, tempid: tempId, tempType: type, w_h } = route.query
  if (route.name !== 'Draw') {
    await useFontStore.init() // 初始化加载字体
  }
  const apiName = tempId && !id ? 'getTempDetail' : 'getWorks'
  if (w_h && !id && !tempId) {
    // 用于初始化画布大小，创建空作品
    const wh: any = w_h.toString().split('*')
    wh[0] && (dPage.value.width = wh[0])
    wh[1] && (dPage.value.height = wh[1])
  }
  if (!id && !tempId) {
    initBoard()
    cb()
    return
  }
  const { data: content, title, state: _state, width, height } = await api.home[apiName]({ id: id || tempId, type })
  if (!content) return
  const data = JSON.parse(content)
  state.stateBollean = !!_state
  state.title = title
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  if (type == 1) {
    // 加载文字组合组件
    dPage.value.width = width
    dPage.value.height = height
    widgetStore.addGroup(data)
  } else {
    if (Array.isArray(data)) {
      widgetStore.dLayouts = data
      widgetStore.setDWidgets(widgetStore.getWidgets())
    } else {
      widgetStore.dLayouts = [{ global: data.page, layers: data.widgets }]
      id ? widgetStore.setDWidgets(widgetStore.getWidgets()) : widgetStore.setTemplate(widgetStore.getWidgets())
    }
    pageStore.setDPage(pageStore.getDPage())
  }
  cb()
}

function initBoard() {
  widgetStore.setDWidgets(widgetStore.getWidgets())
  pageStore.setDPage(pageStore.getDPage())
}

function checkDownloadPoster({ layers }: any) {
  let backEndCapture = false
  for (let i = 0; i < layers.length; i++) {
    const { type, mask, textEffects } = layers[i]
    if ((type === 'w-image' && mask) || type === 'w-svg' || type === 'w-qrcode' || (textEffects && textEffects.length > 0)) {
      backEndCapture = true
      break
    }
  }
  return backEndCapture
}

defineExpose({
  download,
  save,
  saveTemp,
  stateChange,
  load,
})
</script>

<style lang="less" scoped>
.top-icon-wrap {
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 54px;
  .top-icon {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: @radius-sm;
    color: #ffffff;
    cursor: pointer;
    font-weight: 600;
    margin: 8px;
    padding: 5px 8px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.top-title {
  color: @color-black;
  flex: 1;
  padding-left: 20px;
  // font-weight: bold;
  .input-wrap {
    // box-shadow: none;
    width: 15rem;
    :deep(input) {
      border-color: #ffffff;
      // border-color: #e8eaec;
    }
  }
  .input-wrap:hover {
    :deep(input) {
      // border-color: #e8eaec;
    }
  }
}
.primary-btn {
  font-weight: 600;
  transform: scale(0.95);
  margin-left: 10px;
}
.divide__line {
  margin: 0 1rem;
  color: #e8eaec;
  height: 20px;
}
</style>
