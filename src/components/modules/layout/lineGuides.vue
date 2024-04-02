<!--
 * @Author: ShawnPhang
 * @Date: 2022-04-08 10:31:34
 * @Description: 标尺
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-11 01:42:25
-->
<template>
  <div></div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'

import Guides, { GuideOptions } from '@scena/guides'
import { useCanvasStore } from '@/store';

type TProps = {
  show: boolean
}

type TSameParams = {
  backgroundColor: string,
  lineColor: string
  textColor: string
  // direction: 'start',
  // height: 30,
  displayDragPos: boolean,
  dragPosFormat: (v: string | number) => string,
}

type TGuidesData = Guides & GuideOptions

const props = withDefaults(defineProps<TProps>(), {
  show: false
})


const canvasStore = useCanvasStore()
const container = 'page-design' // page-design out-page
let guidesTop: TGuidesData | null = null
let guidesLeft: TGuidesData | null = null

watch(
  () => props.show,
  (open) => {
    open ? render() : destroy()
  },
)

watch(
  () => canvasStore.dZoom,
  () => {
    changeScroll()
  },
)

// onMounted(() => {
//   // let scrollX = 0
//   // let scrollY = 0
//   // window.addEventListener('resize', () => {
//   //   guides.resize()
//   // })
//   // window.addEventListener('wheel', (e) => {
//   //   scrollX += e.deltaX
//   //   scrollY += e.deltaY
//   //   guides.scrollGuides(scrollY)
//   //   guides.scroll(scrollX)
//   // })
// })

function destroy() {
  guidesTop?.destroy()
  guidesLeft?.destroy()
  guidesTop = null
  guidesLeft = null
}

function render() {
  const sameParams: TSameParams = {
    backgroundColor: '#f9f9fa',
    lineColor: '#bec2c7',
    textColor: '#999999',
    // direction: 'start',
    // height: 30,
    displayDragPos: true,
    dragPosFormat: (v) => v + 'px',
  }

  const containerEl = document.getElementById(container)
  if (!containerEl) return

  guidesTop = new Guides(containerEl, {
    ...sameParams,
    type: 'horizontal',
    className: 'my-horizontal',
  }).on('changeGuides', (e) => {
    console.log(e, e.guides)
    // const el = document.getElementById('out-page')
    // const top = 20 + (el?.offsetTop || 0)
    // store.commit('updateGuidelines', { horizontalGuidelines: e.guides.map((x) => x + top) })
  })

  guidesLeft = new Guides(containerEl, {
    ...sameParams,
    type: 'vertical',
    className: 'my-vertical',
  }).on('changeGuides', (e) => {
    console.log(e, e.guides)
    // store.commit('updateGuidelines', { verticalGuidelines: e.guides })
  })

  changeScroll()
}

function changeScroll() {
  if (guidesTop && guidesLeft) {
    const zoom = canvasStore.dZoom / 100
    guidesTop.zoom = zoom
    guidesLeft.zoom = zoom
    if (zoom < 0.9) {
      guidesTop.unit = Math.floor(1 / zoom) * 50
      guidesLeft.unit = Math.floor(1 / zoom) * 50
    }
    setTimeout(() => {
      if (guidesTop && guidesLeft) {
        const el = document.getElementById('out-page')
        const left = 60 + (el?.offsetLeft ?? 0)
        const top = 30 + (el?.offsetTop ?? 0)
        guidesTop.scroll(-left / zoom)
        guidesTop.scrollGuides(-top / zoom)
        guidesLeft.scroll(-top / zoom)
        guidesLeft.scrollGuides(-(left - 30) / zoom)
      }
    }, 300)
  }
}
</script>

<style lang="less">
// :deep(.shortLineSize) {
//   height: 1px !important;
// }
.my-horizontal,
.my-vertical {
  position: absolute !important;
  z-index: 99;
}
.my-horizontal {
  left: 0px;
  top: 0;
  width: calc(100% - 30px);
  height: 30px !important;
}
.my-vertical {
  top: 30px;
  left: 0px;
  height: calc(100% - 60px);
  width: 30px !important;
}
</style>
