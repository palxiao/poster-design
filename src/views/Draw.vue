<template>
  <div id="page-design-index" ref="pageDesignIndex">
    <div class="page-design-index-wrap">
      <design-board class="page-design-wrap fixed-canvas" pageDesignCanvasId="page-design-canvas"></design-board>
    </div>
    <!-- 缩放控制 -->
    <zoom-control />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import api from '@/api'
import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'
import Preload from '@/utils/plugins/preload'
import FontFaceObserver from 'fontfaceobserver'
import { fontWithDraw, font2style } from '@/utils/widgets/loadFontRule'
import designBoard from '@/components/modules/layout/designBoard.vue'
import zoomControl from '@/components/modules/layout/zoomControl/index.vue'

export default defineComponent({
  components: { designBoard, zoomControl },
  // mixins: [shortcuts],
  setup() {
    const state = reactive({
      style: {
        left: '0px',
      },
    })

    return {
      ...toRefs(state),
    }
  },
  computed: {
    ...mapGetters(['dPage']),
  },
  mounted() {
    this.initGroupJson(JSON.stringify(wGroup.setting))
    this.$nextTick(() => {
      this.load()
    })
  },
  methods: {
    ...mapActions(['initGroupJson', 'setTemplate', 'addGroup']),
    async load() {
      let loadFlag = false
      const { id, tempid, tempType: type } = this.$route.query
      if (id || tempid) {
        const { data, width, height } = await api.home[id ? 'getWorks' : 'getTempDetail']({ id: id || tempid, type })
        const content = JSON.parse(data)
        const widgets = type == 1 ? content : content.widgets

        if (type == 1) {
          this.dPage.width = width
          this.dPage.height = height
          this.dPage.backgroundColor = '#ffffff00'
          this.addGroup(content)
        } else {
          this.$store.commit('setDPage', content.page)
          id ? this.$store.commit('setDWidgets', widgets) : this.setTemplate(widgets)
        }

        await this.$nextTick()

        const imgsData: any = []
        const svgsData: any = []
        const fontLoaders: any = []
        const fontContent: any = {}
        let fontData: any = []
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
        // TODO优化: 背景图无法检测是否加载完毕，考虑应该将设置背景作为独立事件
        if (content.page?.backgroundImage) {
          const preloadBg = new Preload([content.page.backgroundImage])
          await preloadBg.imgs()
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
    },
  },
})
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
