<template>
  <div id="page-design-index" ref="pageDesignIndex" class="page-design-bg-color">
    <div :style="style" class="top-nav">
      <div class="top-nav-wrap">
        <div class="top-left">
          <div class="name" @click="jump2home">{{ APP_NAME }}</div>
          <div class="operation">
            <div :class="['operation-item', { disable: !undoable }]" @click="undoable ? handleHistory('undo') : ''"><i class="iconfont icon-undo" /></div>
            <div :class="['operation-item', { disable: !redoable }]" @click="redoable ? handleHistory('redo') : ''"><i class="iconfont icon-redo" /></div>
          </div>
          <el-tooltip effect="dark" content="标尺" placement="bottom">
            <i style="font-size: 20px" class="icon sd-biaochi extra-operation" @click="changeLineGuides" />
          </el-tooltip>
        </div>
        <HeaderOptions ref="options" v-model="isContinue" @change="optionsChange" />
      </div>
    </div>
    <div class="page-design-index-wrap">
      <widget-panel></widget-panel>
      <design-board class="page-design-wrap" pageDesignCanvasId="page-design-canvas">
        <!-- 用于挡住画布溢出部分，因为使用overflow有bug -->
        <div class="shelter" :style="{ width: Math.floor((dPage.width * dZoom) / 100) + 'px', height: Math.floor((dPage.height * dZoom) / 100) + 'px' }"></div>
        <!-- 提供一个背景图层 -->
        <div class="shelter-bg transparent-bg" :style="{ width: Math.floor((dPage.width * dZoom) / 100) + 'px', height: Math.floor((dPage.height * dZoom) / 100) + 'px' }"></div>
      </design-board>
      <style-panel></style-panel>
    </div>
    <!-- 标尺 -->
    <line-guides :show="showLineGuides" />
    <!-- 缩放控制 -->
    <zoom-control ref="zoomControl" />
    <!-- 右键菜单 -->
    <right-click-menu />
    <!-- 旋转缩放组件 -->
    <Moveable />
    <!-- 遮罩百分比进度条 -->
    <ProgressLoading :percent="downloadPercent" :text="downloadText" cancelText="取消" @cancel="downloadCancel" @done="downloadPercent = 0" />
  </div>
</template>

<script lang="ts">
import _config from '../config'
import { defineComponent, reactive, toRefs } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import RightClickMenu from '@/components/business/right-click-menu/RcMenu.vue'
import Moveable from '@/components/business/moveable/Moveable.vue'
import designBoard from '@/components/modules/layout/designBoard.vue'
import zoomControl from '@/components/modules/layout/zoomControl.vue'
import lineGuides from '@/components/modules/layout/lineGuides.vue'

import shortcuts from '@/mixins/shortcuts'
import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'
import HeaderOptions from './components/HeaderOptions.vue'
import ProgressLoading from '@/components/common/ProgressLoading/index.vue'

const beforeUnload = function (e: any) {
  const confirmationMessage = '系统不会自动保存您未修改的内容'
  ;(e || window.event).returnValue = confirmationMessage // Gecko and Trident
  return confirmationMessage // Gecko and WebKit
}

export default defineComponent({
  components: {
    RightClickMenu,
    Moveable,
    HeaderOptions,
    ProgressLoading,
    designBoard,
    zoomControl,
    lineGuides,
  },
  mixins: [shortcuts],
  setup() {
    !_config.isDev && window.addEventListener('beforeunload', beforeUnload)

    const state = reactive({
      style: {
        left: '0px',
      },
      // openDraw: false,
      downloadPercent: 0, // 下载进度
      downloadText: '',
      isContinue: true,
      APP_NAME: _config.APP_NAME,
      showLineGuides: false,
    })
    // const draw = () => {
    //   state.openDraw = true
    // }
    function jump2home() {
      // const fullPath = window.location.href.split('/')
      // window.open(fullPath[0] + '//' + fullPath[2])
      window.open('https://xp.palxp.cn/')
    }
    return {
      ...toRefs(state),
      jump2home,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dHistoryParams', 'dCopyElement', 'dPage', 'dZoom']),
    undoable() {
      return !(this.dHistoryParams.index === -1 || (this.dHistoryParams === 0 && this.dHistoryParams.length === this.dHistoryParams.maxLength))
    },
    redoable() {
      return !(this.dHistoryParams.index === this.dHistoryParams.length - 1)
    },
  },
  // watch: {
  //   $route() {
  //     console.log('change route', this.$route.query)
  //     this.loadData()
  //   },
  // },
  mounted() {
    this.initGroupJson(JSON.stringify(wGroup.setting))
    window.addEventListener('scroll', this.fixTopBarScroll)
    // window.addEventListener('click', this.clickListener)
    document.addEventListener('keydown', this.handleKeydowm, false)
    document.addEventListener('keyup', this.handleKeyup, false)
    this.loadData()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.fixTopBarScroll)
    // window.removeEventListener('click', this.clickListener)
    document.removeEventListener('keydown', this.handleKeydowm, false)
    document.removeEventListener('keyup', this.handleKeyup, false)
    document.oncontextmenu = null
  },
  methods: {
    ...mapActions(['selectWidget', 'initGroupJson', 'handleHistory']),
    changeLineGuides() {
      this.showLineGuides = !this.showLineGuides
    },
    downloadCancel() {
      this.downloadPercent = 0
      this.isContinue = false
    },
    loadData() {
      // 初始化加载页面
      const { id, tempid, tempType } = this.$route.query
      ;(this.$refs as any).options.load(id, tempid, tempType, async () => {
        ;(this.$refs as any).zoomControl.screenChange()
        await this.$nextTick()
        // 初始化激活的控件为page
        this.selectWidget({
          uuid: '-1',
        })
      })
    },
    zoomSub() {
      ;(this.$refs as any).zoomControl.sub()
    },
    zoomAdd() {
      ;(this.$refs as any).zoomControl.add()
    },
    save() {
      ;(this.$refs as any).options.save()
    },
    fixTopBarScroll() {
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
      this.style.left = `-${scrollLeft}px`
    },
    clickListener(e) {
      console.log('click listener', e)
    },
    optionsChange({ downloadPercent, downloadText }: any) {
      this.downloadPercent = downloadPercent
      this.downloadText = downloadText
    },
  },
})
</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');
</style>
