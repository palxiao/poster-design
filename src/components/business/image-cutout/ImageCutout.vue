<!--
 * @Author: ShawnPhang
 * @Date: 2023-07-11 23:50:22
 * @Description: 抠图组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-09 00:42:48
-->
<template>
  <el-dialog v-model="show" title="AI 智能抠图" align-center width="650" @close="handleClose">
    <uploader v-if="!rawImage" :hold="true" :drag="true" :multiple="true" class="uploader" @load="selectFile">
      <div class="uploader__box">
        <upload-filled style="width: 64px; height: 64px" />
        <div class="el-upload__text">在此拖入或选择<em>上传图片</em></div>
      </div>
      <div class="el-upload__tip">服务器带宽过低，为了更好的体验，请上传 2M 内的图片</div>
    </uploader>
    <el-progress v-if="!cutImage && progressText" :percentage="progress">
      <el-button text>
        {{ progressText }} <span v-show="progress">{{ progress }}%</span>
      </el-button>
    </el-progress>
    <div class="content">
      <div v-show="rawImage" v-loading="!cutImage" :style="{ width: offsetWidth ? offsetWidth + 'px' : '100%' }" class="scan-effect transparent-bg">
        <img ref="raw" :style="{ 'clip-path': 'inset(0 0 0 ' + percent + '%)' }" :src="rawImage" alt="" />
        <img v-show="cutImage" :src="cutImage" alt="结果图像" @mousemove="mousemove" />
        <div v-show="cutImage" :style="{ left: percent + '%' }" class="scan-line"></div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button v-show="rawImage && toolModel" @click="clear">清空重选</el-button>
        <el-button v-show="cutImage" type="primary" plain @click="edit">进入编辑模式</el-button>
        <el-button v-show="cutImage && toolModel" type="primary" plain @click="download"> 下载 </el-button>
        <el-button v-show="cutImage && !toolModel" v-loading="loading" type="primary" plain @click="cutDone"> {{ loading ? '上传中..' : '完成抠图' }} </el-button>
      </span>
    </template>
    <ImageExtraction ref="matting" />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElProgress } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import uploader from '@/components/common/Uploader/index.vue'
import _dl from '@/common/methods/download'
import api from '@/api'
import Qiniu from '@/common/methods/QiNiu'
import _config from '@/config'
import { getImage } from '@/common/methods/getImgDetail'
import ImageExtraction from './ImageExtraction.vue'

export default defineComponent({
  components: { uploader, UploadFilled, ElProgress, ImageExtraction },
  emits: ['done'],
  setup(props, { emit }) {
    const store = useStore()
    const state: any = reactive({
      show: false,
      rawImage: '',
      cutImage: '',
      raw: null,
      offsetWidth: 0,
      percent: 0,
      progress: 0,
      progressText: '',
      toolModel: true,
      loading: false,
      matting: null,
    })
    let fileName: string = 'unknow'
    let isRuning: boolean = false

    const selectFile = async (file: File) => {
      if (file.size > 1024 * 1024 * 2) {
        alert('上传图片超出限制')
        return false
      }
      // 显示选择的图片
      state.raw.addEventListener('load', () => {
        state.offsetWidth = state.raw.offsetWidth
      })
      state.rawImage = URL.createObjectURL(file)
      fileName = file.name
      // 返回抠图结果
      const result: any = await api.ai.upload(file, (up: number, dp: number) => {
        if (dp) {
          state.progressText = dp === 100 ? '' : '导入中..'
          state.progress = dp
        } else {
          state.progressText = up < 100 ? '上传中..' : '正在处理，请稍候..'
          state.progress = up < 100 ? up : 0
        }
      })
      if (result.type !== 'application/json') {
        const resultImage = URL.createObjectURL(result)
        state.rawImage && (state.cutImage = resultImage)
        requestAnimationFrame(run)
      } else alert('服务器繁忙，请稍等下重新尝试~')
    }

    const open = (file: File) => {
      state.loading = false
      state.show = true
      store.commit('setShowMoveable', false)
      nextTick(() => {
        if (file) {
          selectFile(file)
          state.toolModel = false
        }
      })
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

    const cutDone = async () => {
      state.loading = true
      const response = await fetch(state.cutImage)
      const buffer = await response.arrayBuffer()
      const file = new File([buffer], `cut_image_${Math.random()}.png`)
      // upload
      const qnOptions = { bucket: 'xp-design', prePath: 'user' }
      const result = await Qiniu.upload(file, qnOptions)
      const { width, height } = await getImage(file)
      const url = _config.IMG_URL + result.key
      await api.material.addMyPhoto({ width, height, url })
      emit('done', url)
      state.show = false
      handleClose()
    }

    const edit = () => {
      state.matting.open(state.rawImage, state.cutImage, (base64: any) => {
        state.cutImage = base64
        state.percent = 0
        requestAnimationFrame(run)
      })
    }

    return {
      clear,
      download,
      mousemove,
      selectFile,
      open,
      handleClose,
      ...toRefs(state),
      cutDone,
      edit,
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

.progress {
  width: 100%;
}
</style>
