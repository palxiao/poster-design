<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-12 11:26:53
 * @Description: 上传用户模板
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-14 09:17:56
-->
<template>
  <el-button v-show="isDone" type="primary" plain @click="prepare"><b>上传模板</b></el-button>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
</template>

<script lang="ts">
import api from '@/api'
import { defineComponent, reactive, toRefs, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { mapGetters, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import _config from '@/config'
import github from '@/api/github'

export default defineComponent({
  components: { SaveImage },
  props: ['modelValue', 'isDone'],
  emits: ['change', 'update:modelValue'],
  setup(props, context) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state: any = reactive({
      stateBollean: false,
      title: '',
      loading: false,
      canvasImage: null,
    })

    useFontStore.init() // 初始化加载字体

    // 生成封面
    const draw = () => {
      return new Promise((resolve) => {
        state.canvasImage.createCover(({ key }: any) => {
          resolve(_config.IMG_URL + key)
        })
      })
    }

    let addition = 0 // 累加大小
    let lenCount = 0 // 全部大小
    let lens = 0 // 任务数
    const queue: any[] = [] // 队列
    let widgets: any = []
    let page: any = {}

    async function prepare() {
      store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      addition = 0
      lenCount = 0
      widgets = proxy.dWidgets
      page = proxy.dPage

      if (page.backgroundImage) {
        context.emit('change', { downloadPercent: 1, downloadText: '正在准备上传', downloadMsg: '请等待..' })
        page.backgroundImage = await github.putPic(page.backgroundImage.split(',')[1])
      }

      for (const item of widgets) {
        if (item.type === 'w-image') {
          lenCount += item.imgUrl.length
          queue.push(item)
        }
      }
      lens = queue.length
      uploadImgs()
    }

    async function uploadImgs() {
      if (queue.length > 0) {
        const item = queue.pop()
        const url = await github.putPic(item.imgUrl.split(',')[1])
        addition += item.imgUrl.length
        let downloadPercent: any = (addition / lenCount) * 100
        downloadPercent >= 100 && (downloadPercent = null)
        context.emit('change', { downloadPercent, downloadText: '上传资源中', downloadMsg: `已完成：${lens - queue.length} / ${lens}` })
        item.imgUrl = url
        uploadImgs()
      } else {
        uploadTemplate()
      }
    }

    const uploadTemplate = async () => {
      context.emit('change', { downloadPercent: 95, downloadText: '正在处理封面', downloadMsg: '即将结束...' })
      const cover = await draw()
      const { id, stat, msg } = await api.home.saveWorks({ cover, title: '自设计模板', data: JSON.stringify({ page, widgets }), width: page.width, height: page.height })
      stat !== 0 ? useNotification('保存成功', '可在"我的模板"中查看') : useNotification('保存失败', msg, { type: 'error' })
      router.push({ path: '/psd', query: { id }, replace: true })
      context.emit('change', { downloadPercent: 99.99, downloadText: '上传完成', cancelText: '查看我的作品' }) // 关闭弹窗
    }

    return {
      ...toRefs(state),
      prepare,
    }
  },
  computed: {
    ...mapGetters(['dPage', 'dWidgets']),
  },
})
</script>

<!-- <style lang="less" scoped></style> -->
