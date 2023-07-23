<!--
 * @Author: ShawnPhang
 * @Date: 2023-07-11 23:50:22
 * @Description: 抠图组件
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-14 09:10:31
-->
<template>
  <el-dialog v-model="show" title="AI抠图（测试版）" width="650" @close="handleClose">
    <uploader v-if="!rawImage" :hold="true" :drag="true" :multiple="true" class="uploader" @load="selectFile">
      <div class="uploader__box">
        <upload-filled style="width: 64px; height: 64px" />
        <div class="el-upload__text">在此拖入或选择<em>上传图片</em></div>
      </div>
      <div class="el-upload__tip">支持 jpg 或 png 格式的文件，大小不超过 2M</div>
    </uploader>
    <div class="content">
      <div v-show="rawImage" v-loading="!cutImage" :style="{ width: offsetWidth ? offsetWidth + 'px' : '100%' }" class="scan-effect">
        <img ref="raw" :src="rawImage" alt="" />
        <div :style="{ right: 100 - percent + '%' }" class="bg"></div>
        <img v-show="cutImage" :src="cutImage" alt="结果图像" @mousemove="mousemove" />
        <div v-show="cutImage" :style="{ left: percent + '%' }" class="scan-line"></div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button v-show="rawImage" @click="clear">重新选择图片</el-button>
        <el-button v-show="cutImage" type="primary" plain @click="download"> 下载 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { UploadFilled } from '@element-plus/icons-vue'
import uploader from '@/components/common/Uploader/index.vue'
import _dl from '@/common/methods/download'

export default defineComponent({
  components: { uploader, UploadFilled },
  setup() {
    const store = useStore()
    const state: any = reactive({
      show: false,
      rawImage: '',
      cutImage: '',
      raw: null,
      offsetWidth: 0,
      percent: 0,
    })

    let app: any = null
    let fileName: string = 'unknow'
    let isRuning: boolean = false
    onMounted(async () => {
      app = await store.getters.app
    })

    const selectFile = async (file: File) => {
      if (file.size > 1024 * 1024 * 2) {
        alert('上传的文件大小超过了限制！')
        return false
      }
      // 显示选择的图片
      state.raw.addEventListener('load', () => {
        state.offsetWidth = state.raw.offsetWidth
      })
      state.rawImage = URL.createObjectURL(file)
      fileName = file.name
      // 返回抠图
      const result = await app.predict('/predict', [file, 'u2netp', ''])
      state.rawImage && (state.cutImage = result?.data[0])
      requestAnimationFrame(run)
    }

    const open = () => {
      state.show = true
      store.commit('setShowMoveable', false)
    }

    const handleClose = () => {
      store.commit('setShowMoveable', true)
    }

    const mousemove = (e: MouseEvent) => {
      !isRuning && (state.percent = (e.offsetX / (e.target as any).width) * 100)
    }

    const download = () => {
      _dl.downloadBase64File(state.cutImage, fileName)
    }

    const clear = () => {
      URL.revokeObjectURL(state.rawImage)
      state.rawImage = ''
      // URL.revokeObjectURL(state.cutImage)
      state.cutImage = ''
      state.percent = 0
      state.offsetWidth = 0
    }

    const run = () => {
      state.percent += 1
      isRuning = true
      state.percent < 100 ? requestAnimationFrame(run) : (isRuning = false)
    }

    return {
      clear,
      download,
      mousemove,
      selectFile,
      open,
      handleClose,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="less" scoped>
.uploader {
  &__box {
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
.content {
  position: relative;
  display: flex;
  justify-content: center;
}
.scan-effect {
  position: relative;
  height: 50vh;
  overflow: hidden;
  img {
    // width: 100%;
    height: 100%;
    object-fit: contain;
    position: absolute;
  }
  .bg {
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: absolute;
  }
}

.scan-line {
  position: absolute;
  top: 0;
  width: 1.5px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  // background-image: linear-gradient(to top, transparent, rgba(255, 255, 255, 0.7), transparent);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}
</style>
