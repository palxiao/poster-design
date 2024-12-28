<!--
 * @Author: Jeremy Yu
 * @Date: 2024-12-27 00:02:46
 * @Description: 图片生成HTML页面
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-12-28 19:54:55
-->

<template>
  <div ref="pageDesignIndex">
    <div class="page-design-index-wrap" id="page-draw-html-wrap">
      <template v-for="x in pageGroup" :key="x.pageData.uuid">
        <design-board 
          class="page-design-wrap fixed-canvas"
          pageDesignCanvasId="page-design-canvas"
          :padding="0"
          :renderDWdigets="x.dWidgets"
          :renderDPage="x.pageData"
          :zoom="x.zoom * 100"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, ref, onUnmounted } from 'vue'
import api from '@/api'
import Preload from '@/utils/plugins/preload'
import FontFaceObserver from 'fontfaceobserver'
import { fontMinWithDraw, font2style } from '@/utils/widgets/loadFontRule'
import designBoard from '@/components/modules/layout/designBoard/index.vue'
import { useRoute } from 'vue-router'
import { TPageState } from '@/store/design/canvas/d'
import { TdWidgetData } from '@/store/design/widget'

const route = useRoute()

const pageGroup = ref<{pageData: TPageState, dWidgets: TdWidgetData[], zoom: number}[]>([])

onMounted(() => {
  nextTick(() => {
    load()
    window.addEventListener("resize", handleResize, false);
  })
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize, false);
})

async function load() {
  let backgroundImage = ''
  let loadFlag = false
  const { id, tempid  }: any = route.query 
  if (id || tempid) {
    const postData = {
      id: id || tempid
    }
    const { data } = await api.home[id ? 'getWorks' : 'getTempDetail'](postData)
    let contentGroup = JSON.parse(data)

    contentGroup = Array.isArray(contentGroup) ? contentGroup : [contentGroup]

    for (let i = 0; i < contentGroup.length; i++) {
      const { global, layers } = contentGroup[i]
      let content = {page: global, widgets: layers}

      const widgets = content.widgets
      const zoom = controlScale(content.page?.width)
 
      // 移除背景图，作为独立事件
      backgroundImage = content.page?.backgroundImage
      backgroundImage && delete content.page.backgroundImage

      await nextTick()

      pageGroup.value.push({
        pageData: content.page,
        dWidgets: widgets,
        zoom,
      })

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
      }
      try {
        fontMinWithDraw && (await font2style(fontContent, fontData))
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
      console.log('--> now u can start generate artboard to html!')
      setTimeout(() => {
        try {
          ;(window as any).loadFinishToInject('done')
        } catch (err) {}
      }, 100)
    }
  }
  // 超时
  setTimeout(() => {
    !loadFlag && (window as any).loadFinishToInject('done')
  }, 60000)
}

function controlScale(width: number) {
  const winWidth = document.documentElement.clientWidth
  let curZoom = (winWidth / width);
  curZoom = curZoom > 1 ? 1 : curZoom

  return curZoom
}

function handleResize() {
  pageGroup.value = pageGroup.value.map(val => {
    val.zoom = controlScale(val.pageData.width);
    return val
  })
}

</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');

#page-draw-html-wrap {
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  offset: 0px;
  
  scrollbar-width: none; /* Firefox 隐藏滚动条 */
  #main {
    overflow: hidden;
  }
}

#page-draw-html-wrap::-webkit-scrollbar {
    display: none; /* WebKit 浏览器隐藏滚动条 */
}

</style>

<style lang="less">
.layer-hover {
  outline: 0 !important;
}

</style>
