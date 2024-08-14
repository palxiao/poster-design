<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-01 11:12:17
 * @Description: 前端出图 - 用于封面
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-04 18:50:00
-->
<template>
  <div id="cover-wrap"></div>
</template>

<script lang="ts" setup>
import html2canvas from 'html2canvas'
import Qiniu from '@/common/methods/QiNiu'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useWidgetStore } from '@/store'
import FontFaceObserver from 'fontfaceobserver'

// const { dZoom } = useSetupMapGetters(['dZoom'])

const canvasStore = useCanvasStore()
const widgetStore = useWidgetStore()
const { dZoom } = storeToRefs(canvasStore)

// props: ['modelValue'],
// emits: ['update:modelValue'],

async function createCover(cb: any) {
  const nowZoom = dZoom.value
  // 取消选中元素
  widgetStore.selectWidget({
    uuid: '-1',
  })
  // store.dispatch('selectWidget', {
  //   uuid: '-1',
  // })

  canvasStore.updateZoom(100)
  // store.dispatch('updateZoom', 100)

  const opts = {
    useCORS: true, // 跨域图片
    scale: 0.2,
  }
  setTimeout(async () => {
    const clonePage = document.getElementById('page-design-canvas')?.cloneNode(true) as HTMLElement
    if (!clonePage) return
    clonePage.setAttribute('id', 'clone-page')
    document.body.appendChild(clonePage)
    html2canvas(clonePage, opts).then((canvas) => {
      canvas.toBlob(
        async (blobObj) => {
          if (blobObj) {
            const result = await Qiniu.upload(blobObj, { bucket: 'xp-design', prePath: 'cover/user' })
            cb(result)
          }
        },
        'image/jpeg',
        0.15,
      )
      canvasStore.updateZoom(nowZoom)
      // store.dispatch('updateZoom', nowZoom)
      clonePage.remove()
    })
  }, 10)
}

async function createPoster() {
  await checkFonts() // 等待字体加载完成
  const fonts = document.fonts
  const opts = {
    backgroundColor: null, // 关闭背景以支持透明图片生成
    useCORS: true,
    scale: 100 / dZoom.value, // * window.devicePixelRatio
    onclone: (document: any) => fonts.forEach((font) => document.fonts.add(font)),
  }
  // const style = document.createElement('style')
  // document.head.appendChild(style)
  // style.sheet?.insertRule('body > img { display: initial; }')
  return new Promise((resolve) => {
    const clonePage = document.getElementById('page-design-canvas')?.cloneNode(true) as HTMLElement
    if (!clonePage) return
    clonePage.setAttribute('id', 'clone-page')
    document.body.appendChild(clonePage)
    html2canvas(clonePage, opts).then((canvas) => {
      canvas.toBlob(async (blob) => resolve({ blob }), `image/png`)
      clonePage.remove()
    })
  })
}

// 检查字体是否加载完成
async function checkFonts() {
  const widgets = widgetStore.getWidgets()
  const fontLoaders: Promise<void>[] = []
  widgets.forEach((item: any) => {
    if (item.fontClass && item.fontClass.value) {
      const loader = new FontFaceObserver(item.fontClass.value)
      fontLoaders.push(loader.load(null, 120000)) // 延长超时让检测不会丢失字体
    }
  })
  await Promise.all(fontLoaders)
}

defineExpose({
  createCover,
  createPoster,
})
</script>

<style lang="less">
#clone-page {
  position: absolute;
  z-index: 99999;
  left: -99999px;
}
</style>
