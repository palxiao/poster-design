<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-10 14:57:53
 * @Description: Psd文件解析
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-14 00:51:19
-->
<template>
  <div id="page-design-index" ref="pageDesignIndex">
    <div class="top-nav">
      <div class="top-nav-wrap">
        <div class="top-left">
          <div class="name" style="font-size: 15px">迅排在线PSD解析</div>
        </div>
        <div style="flex: 1"><el-button plain type="primary" @click="jump2word">查看模板规范文档</el-button></div>
        <el-button v-show="isDone" @click="clear">清空模板内容</el-button>
        <div class="v-tips">
          <HeaderOptions :isDone="isDone" @change="optionsChange" />
        </div>
      </div>
    </div>

    <div class="page-design-index-wrap">
      <!-- <widget-panel></widget-panel> -->
      <design-board class="page-design-wrap" pageDesignCanvasId="page-design-canvas">
        <div v-if="isDone" class="shelter" :style="{ width: (dPage.width * dZoom) / 100 + 'px', height: (dPage.height * dZoom) / 100 + 'px' }"></div>
        <uploader v-else accept=".psd" :hold="true" :drag="true" class="uploader" @load="selectFile">
          <div class="uploader__box"><img style="margin-right: 1rem" src="https://cdn.dancf.com/design/svg/icon_psdimport.37e6f23e.svg" /> 在此拖入或选择PSD文件</div>
        </uploader>
      </design-board>
      <style-panel v-show="isDone"></style-panel>
    </div>
    <!-- 缩放控制 -->
    <zoom-control v-if="isDone" ref="zoomControl" />
    <!-- 右键菜单 -->
    <right-click-menu />
    <!-- 旋转缩放组件 -->
    <Moveable />
    <!-- 遮罩百分比进度条 -->
    <ProgressLoading :percent="downloadPercent" :text="downloadText" :cancelText="cancelText" :msg="downloadMsg" @cancel="cancel" @done="downloadPercent = 0" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance, ComponentInternalInstance, onMounted, nextTick } from 'vue'
import { processPSD2Page } from '@/utils/plugins/psd'
import { useRoute } from 'vue-router'
import { mapActions, mapGetters, useStore } from 'vuex'
import RightClickMenu from '@/components/business/right-click-menu/rc-menu.vue'
import Moveable from '@/components/business/moveable/Moveable.vue'
import shortcuts from '@/mixins/shortcuts'
import wText from '@/components/modules/widgets/wText/wText.vue'
import wImage from '@/components/modules/widgets/wImage/wImage.vue'
import useLoading from '@/common/methods/loading'
import uploader from '@/components/common/Uploader/index.vue'
import designBoard from '@/components/modules/layout/designBoard.vue'
import zoomControl from '@/components/modules/layout/zoomControl.vue'
import HeaderOptions from './components/UploadTemplate.vue'
import ProgressLoading from '@/components/common/ProgressLoading/index.vue'

export default defineComponent({
  components: { RightClickMenu, Moveable, uploader, designBoard, zoomControl, HeaderOptions, ProgressLoading },
  mixins: [shortcuts],
  setup() {
    const state = reactive({
      isDone: true,
      downloadPercent: 0, // 下载进度
      downloadText: '',
      downloadMsg: '',
      cancelText: '',
    })
    const store = useStore()
    const route = useRoute()
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    let loading: any = null

    onMounted(async () => {
      await nextTick()
      state.isDone = false
    })

    function loadJS() {
      const link_element = document.createElement('script')
      link_element.setAttribute('src', '/psd.js') // 'https://design.palxp.com/psd.js.gz'
      document.head.appendChild(link_element)
    }
    async function selectFile(file: any) {
      loading = useLoading()
      await loadPSD(file)
      loading.close()
      state.isDone = true
    }
    async function loadPSD(file: any) {
      const data = await processPSD2Page(file)

      setTimeout(async () => {
        const types: any = {
          text: wText.setting,
          image: wImage.setting,
        }
        for (let i = 0; i < data.clouds.length; i++) {
          const x: any = data.clouds[i]
          const rawData = JSON.parse(JSON.stringify(types[x.type])) || {}
          delete x.type
          x.src && (x.imgUrl = x.src) && delete x.src
          store.dispatch('addWidget', Object.assign(rawData, x))
        }

        const { width, height, background: bg } = data
        store.commit('setDPage', Object.assign(store.getters.dPage, { width, height, backgroundColor: bg.color, backgroundImage: bg.image }))
        await proxy?.loadDone()
      }, 10)
    }

    async function clear() {
      store.commit('setDWidgets', [])
      store.commit('setDPage', Object.assign(store.getters.dPage, { width: 1920, height: 1080, backgroundColor: '#ffffff', backgroundImage: '' }))
      store.commit('setShowMoveable', false)
      await nextTick()
      state.isDone = false
    }

    const optionsChange = ({ downloadPercent, downloadText, downloadMsg = '', cancelText = '' }: any) => {
      typeof downloadPercent === 'number' && (state.downloadPercent = downloadPercent)
      state.downloadText = downloadText
      state.downloadMsg = downloadMsg
      state.cancelText = cancelText
    }
    const cancel = () => {
      state.downloadPercent = 100
      window.open(`${window.location.protocol + '//' + window.location.host}/home?id=${route.query.id}`)
    }

    return {
      ...toRefs(state),
      loadJS,
      selectFile,
      clear,
      cancel,
      optionsChange,
    }
  },
  computed: {
    ...mapGetters(['dPage', 'dZoom']),
  },
  async mounted() {
    document.addEventListener('keydown', this.handleKeydowm, false)
    document.addEventListener('keyup', this.handleKeyup, false)
    this.loadJS()
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydowm, false)
    document.removeEventListener('keyup', this.handleKeyup, false)
    document.oncontextmenu = null
  },
  methods: {
    ...mapActions(['selectWidget']),
    async loadDone() {
      await this.$nextTick()
      ;(this.$refs as any).zoomControl.screenChange()
      setTimeout(() => {
        this.selectWidget({
          uuid: '-1',
        })
        // this.$store.commit('setShowMoveable', false)
      }, 100)
    },
    jump2word() {
      window.open('https://kdocs.cn/l/clmBsIkhve8d')
    },
  },
})
</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');
.uploader {
  position: absolute;
  z-index: 999;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  &__box {
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
.v-tips {
  padding: 0 1rem;
  font-size: 15px;
  color: #666666;
}
</style>
