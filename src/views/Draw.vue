<template>
  <div id="page-design-index" ref="pageDesignIndex">
    <div class="page-design-index-wrap">
      <design-board class="page-design-wrap fixed-canvas" pageDesignCanvasId="page-design-canvas"></design-board>
    </div>
    <!-- 缩放控制 -->
    <zoom-control />
  </div>
</template>

<script lang="ts" setup>
import { StyleValue, onMounted, reactive, nextTick } from 'vue'
import api from '@/api'
import Preload from '@/utils/plugins/preload'
import FontFaceObserver from 'fontfaceobserver'
import { fontWithDraw, font2style } from '@/utils/widgets/loadFontRule'
import designBoard from '@/components/modules/layout/designBoard/index.vue'
import zoomControl from '@/components/modules/layout/zoomControl/index.vue'
import { useRoute } from 'vue-router'
// import { wGroupSetting } from '@/components/modules/widgets/wGroup/groupSetting'
import { storeToRefs } from 'pinia'
import { useGroupStore, useCanvasStore, useWidgetStore } from '@/store'

type TState = {
  style: StyleValue
}

const route = useRoute()
const state = reactive<TState>({
  style: {
    left: '0px',
  },
})
const pageStore = useCanvasStore()
// const groupStore = useGroupStore()
const widgetStore = useWidgetStore()
const { dPage } = storeToRefs(pageStore)

onMounted(() => {
  // groupStore.initGroupJson(JSON.stringify(wGroupSetting))
  // store.dispatch('initGroupJson', JSON.stringify(wGroupSetting))
  // initGroupJson(JSON.stringify(wGroup.setting))
  nextTick(() => {
    load()
  })
})

async function load() {
  let backgroundImage = ''
  let loadFlag = false
  const { id, tempid, tempType: type = 0, index = 0  }: any = route.query 
  if (id || tempid) {
    const postData = {
      id: Number(id || tempid),
      type: Number(type)
    }
    const { data, width, height } = await api.home[id ? 'getWorks' : 'getTempDetail'](postData)
    let content = JSON.parse(data)
    const isGroupTemplate = Number(type) == 1

    if (Array.isArray(content)) {
      const { global, layers } = content[index]
      content = {page: global, widgets: layers}
    }
    const widgets = isGroupTemplate ? content : content.widgets

    if (isGroupTemplate) {
      dPage.value.width = width
      dPage.value.height = height
      dPage.value.backgroundColor = '#ffffff00'
      widgetStore.addGroup(content)
    } else {
      pageStore.setDPage(content.page)
      // 移除背景图，作为独立事件
      backgroundImage = content.page?.backgroundImage
      backgroundImage && delete content.page.backgroundImage
      pageStore.setDPage(content.page)
      if (id) {
        widgetStore.setDWidgets(widgets)
      } else {
        widgetStore.setTemplate(widgets)
      }
    }

    await nextTick()

    const imgsData: HTMLImageElement[] = []
    const svgsData: HTMLImageElement[] = []
    const fontLoaders: Promise<void>[] = []
    const fontContent: Record<string, string> = {}
    let fontData: string[] = []
    widgets.forEach((item: any) => {
      if (item.fontClass && item.fontClass.value) {
        const loader = new FontFaceObserver(item.fontClass.value)
        fontData.push(item.fontClass)
        fontLoaders.push(loader.load(null, 30000)) // 延长超时让检测不会丢失字体
        // 按字体来收集所有文字
        if (fontContent[item.fontClass.value]) {
          fontContent[item.fontClass.value] += item.text
        } else {
          fontContent[item.fontClass.value] = item.text
        }
      }
      // 收集图片元素、svg元素
      try {
        if (item.svgUrl && item.type === 'w-svg') {
          const cNodes: any = (window as any).document.getElementById(item.uuid).childNodes
          svgsData.push(cNodes)
        } else if (item.imgUrl && !item.isNinePatch) {
          const cNodes: any = (window as any).document.getElementById(item.uuid).childNodes
          for (const el of cNodes) {
            if (el.className && el.className.includes('img__box')) {
              imgsData.push(el.firstChild)
            }
          }
        }
      } catch (e) {}
    })
    // 背景图无法检测是否加载完毕，所以单独做判断
    if (backgroundImage) {
      const preloadBg = new Preload([backgroundImage])
      await preloadBg.imgs()
      pageStore.setDPage({...content.page, ...{backgroundImage}})
      // store.commit('setDPage', {...content.page, ...{backgroundImage}})
    }
    try {
      fontWithDraw && (await font2style(fontContent, fontData))
      // console.log('1. base64 yes')
      const preload = new Preload(imgsData)
      await preload.doms()
      // console.log('2. image yes')
      const preload2 = new Preload(svgsData)
      await preload2.svgs()
      // console.log('3. svg yes')
    } catch (e) {
      console.log(e)
    }
    try {
      await Promise.all(fontLoaders)
      // console.log('4. font yes')
    } catch (e) {
      // console.log(e)
    }
    loadFlag = true
    console.log('--> now u can start screenshot!')
    setTimeout(() => {
      try {
        ;(window as any).loadFinishToInject('done')
      } catch (err) {}
    }, 100)
  }
  // 超时
  setTimeout(() => {
    !loadFlag && (window as any).loadFinishToInject('done')
  }, 60000)
}
</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');
.fixed-canvas {
  :deep(#page-design-canvas) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
  }
}
</style>

<style lang="less">
.layer-hover {
  outline: 0 !important;
}
</style>
