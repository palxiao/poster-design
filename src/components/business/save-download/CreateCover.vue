<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-01 11:12:17
 * @Description: 前端出图 - 用于封面
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @Date: 2024-03-04 18:50:00
-->
<template>
  <div id="cover-wrap"></div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import html2canvas from 'html2canvas'
import Qiniu from '@/common/methods/QiNiu'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'

const store = useStore();

const { dZoom } = useSetupMapGetters(['dZoom'])


// props: ['modelValue'], 
// emits: ['update:modelValue'],

async function createCover(cb: any) {
  const nowZoom = dZoom.value
  // 取消选中元素
  store.dispatch('selectWidget', {
    uuid: '-1',
  })
  store.dispatch('updateZoom', 100)

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
      store.dispatch('updateZoom', nowZoom)
      clonePage.remove()
    })
  }, 10)
}

defineExpose({
  createCover
})
</script>

<style lang="less">
#clone-page {
  position: absolute;
  z-index: 99999;
  left: -99999px;
}
</style>
