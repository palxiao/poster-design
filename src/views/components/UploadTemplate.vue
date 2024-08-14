<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-12 11:26:53
 * @Description: 上传用户模板
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 14:11:57
-->
<template>
  <el-button v-show="isDone" type="primary" plain @click="prepare"><b>上传模板</b></el-button>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
</template>

<script lang="ts" setup>
import api from '@/api'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import _config from '@/config'
import github from '@/api/github'
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
  stateBollean: false,
  title: '',
  loading: false,
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

// 生成封面
const draw = () => {
  return new Promise<string>((resolve) => {
    if (!canvasImage.value) {
      resolve('')
    } else {
      canvasImage.value.createCover(({ key }: { key: string }) => {
        resolve(_config.IMG_URL + key)
      })
    }
  })
}

let addition = 0 // 累加大小
let lenCount = 0 // 全部大小
let lens = 0 // 任务数
const queue: TdWidgetData[] = [] // 队列
let widgets: TdWidgetData[] = []
let page: Record<string, any> = {}

async function prepare() {
  // store.commit('setShowMoveable', false) // 清理掉上一次的选择框
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框

  addition = 0
  lenCount = 0
  widgets = dWidgets.value
  page = dPage.value

  if (page.backgroundImage) {
    emit('change', { downloadPercent: 1, downloadText: '正在准备上传', downloadMsg: '请等待..' })
    page.backgroundImage = await github.putPic(page.backgroundImage.split(',')[1])
  }

  for (const item of widgets) {
    if (item.type === 'w-image') {
      lenCount += (item.imgUrl?.length || 0)
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
    const url = await github.putPic((item?.imgUrl || '').split(',')[1])
    addition += (item.imgUrl?.length || 0)
    let downloadPercent: number | null = (addition / lenCount) * 100
    downloadPercent >= 100 && (downloadPercent = null)
    emit('change', { downloadPercent, downloadText: '上传资源中', downloadMsg: `已完成：${lens - queue.length} / ${lens}` })
    item.imgUrl = url
    uploadImgs()
  } else {
    uploadTemplate()
  }
}

    const uploadTemplate = async () => {
      emit('change', { downloadPercent: 95, downloadText: '正在处理封面', downloadMsg: '即将结束...' })
      // const cover = await draw()
      const { id, stat, msg } = await api.home.saveTemp({ title: '自设计模板', data: JSON.stringify({ page, widgets }), width: page.width, height: page.height })
      stat !== 0 ? useNotification('保存成功', '') : useNotification('保存失败', msg, { type: 'error' })
      router.push({ path: '/psd', query: { id }, replace: true })
      emit('change', { downloadPercent: 99.99, downloadText: '上传完成', cancelText: '' }) // 关闭弹窗
    }

defineExpose({
  prepare,
})
</script>

<!-- <style lang="less" scoped></style> -->
