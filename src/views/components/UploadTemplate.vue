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
 * @Date: 2022-07-12 11:26:53
 * @Description: 上传用户模板
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2026-09-01 20:18:48
-->
<template>
  <el-button v-show="isDone" type="primary" plain @click="prepare"><b>{{ $t('editor.upload.uploadTemplate') }}</b></el-button>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
</template>

<script lang="ts" setup>
import i18n from '@/languages'
import api from '@/api'
import * as adminApi from '@/api/admin'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { useControlStore, useCanvasStore, useWidgetStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TdWidgetData } from '@/store/design/widget'

type TProps = {
  modelValue?: string
  isDone?: boolean
}

export type TEmitChangeData = {
  downloadPercent: number | null
  downloadText: string
  downloadMsg?: string
  cancelText?: string
}

type TEmits = {
  (event: 'change', data: TEmitChangeData): void
  (event: 'update:modelValue', data: string): void
}

type TState = {
  stateBollean: false
  title: ''
  loading: false
}

// const { dWidgets } = useSetupMapGetters(['dWidgets'])
const { dPage } = storeToRefs(useCanvasStore())

const props = defineProps<TProps>()
const emit = defineEmits<TEmits>()

const route = useRoute()
const router = useRouter()

const widgetStore = useWidgetStore()
const controlStore = useControlStore()
const { dWidgets } = storeToRefs(widgetStore)

const canvasImage = ref<typeof SaveImage | null>(null)
const state = reactive<TState>({
  stateBollean: false,
  title: '',
  loading: false,
})

useFontStore.init() // 初始化加载字体

let addition = 0 // 累加大小
let lenCount = 0 // 全部大小
let lens = 0 // 任务数
const queue: TdWidgetData[] = [] // 队列
let widgets: TdWidgetData[] = []
let page: Record<string, any> = {}

const { type } = route.query

async function prepare() {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框

  if (Number(type) == 1) {
    // 保存组件，组合元素要保证在最后一位
    if (dWidgets.value[0].type === 'w-group') {
      const group: any = dWidgets.value.shift()
      if (!group) return
      group.record.width = 0
      group.record.height = 0
      dWidgets.value.push(group)
    }
    // TIP：上传组件必须将所有图层组合成组
    if (!dWidgets.value.some((x: Record<string, any>) => x.type === 'w-group')) {
      alert(i18n.global.t('editor.upload.groupAllLayers'))
      return
    }
  }

  addition = 0
  lenCount = 0
  widgets = dWidgets.value
  page = dPage.value

  if (page.backgroundImage) {
    emit('change', { downloadPercent: 1, downloadText: i18n.global.t('editor.upload.preparing'), downloadMsg: i18n.global.t('editor.upload.pleaseWait') })
    page.backgroundImage = await uploadTemplateImage(page.backgroundImage)
  }

  for (const item of widgets) {
    if (item.type === 'w-image') {
      lenCount += item.imgUrl?.length || 0
      queue.push(item)
    }
  }
  lens = queue.length
  uploadImgs()
}

async function uploadImgs() {
  if (queue.length > 0) {
    const item = queue.pop()
    if (!item) return
    const url = await uploadTemplateImage(item?.imgUrl || '')
    addition += item.imgUrl?.length || 0
    let downloadPercent: number | null = (addition / lenCount) * 100
    downloadPercent >= 100 && (downloadPercent = null)
    emit('change', { downloadPercent, downloadText: i18n.global.t('editor.upload.uploadingAssets'), downloadMsg: `${i18n.global.t('editor.upload.completed')}: ${lens - queue.length} / ${lens}` })
    item.imgUrl = url
    uploadImgs()
  } else {
    uploadTemplate()
  }
}

/** 将模板中的 base64 图片上传到当前服务，避免新模板依赖旧版 GitHub 图床。 */
async function uploadTemplateImage(source: string): Promise<string> {
  if (!source || !source.startsWith('data:')) return source
  const response = await fetch(source)
  const blob = await response.blob()
  const extension = blob.type.split('/')[1] || 'png'
  const file = new File([blob], `template-${Date.now()}.${extension}`, { type: blob.type || 'image/png' })
  const result: any = await api.material.upload({ file, folder: 'template' }, () => {})
  const url = result?.url || result?.result?.url
  if (!url) throw new Error(i18n.global.t('editor.upload.localUploadFailed'))
  return url
}

const uploadTemplate = async () => {
  emit('change', { downloadPercent: 95, downloadText: i18n.global.t('editor.upload.processingCover'), downloadMsg: i18n.global.t('editor.upload.almostDone') })
  // const cover = await draw()
  const data = Number(type) == 1 ? JSON.stringify(widgets) : JSON.stringify({ page, widgets })
  try {
    const { id } = await adminApi.saveTemplate({ title: i18n.global.t('editor.upload.ownTemplate'), type, data, width: page.width, height: page.height })
    useNotification(i18n.global.t('editor.header.saveSuccess'), '')
    router.push({ path: '/psd', query: { id }, replace: true })
  } catch (err: any) {
    useNotification(i18n.global.t('editor.header.saveFailed'), err?.msg || err?.message || i18n.global.t('editor.upload.tryLater'), { type: 'error' })
  }
  emit('change', { downloadPercent: 99.99, downloadText: i18n.global.t('editor.upload.uploadDone'), cancelText: '' }) // 关闭弹窗
}

defineExpose({
  prepare,
})
</script>

<!-- <style lang="less" scoped></style> -->
