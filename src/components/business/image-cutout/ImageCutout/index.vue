<!--
 * @Author: ShawnPhang
 * @Date: 2024-03-03 19:00:00
 * @Description: 裁剪组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-03 19:00:00
-->
<template>
  <el-dialog v-model="state.show" title="AI 抠图（模拟演示）" align-center width="650" @close="handleClose">
    <uploader v-if="!state.rawImage" :hold="true" :drag="true" :multiple="true" class="uploader" @load="handleUploaderLoad">
      <div class="uploader__box">
        <upload-filled style="width: 64px; height: 64px" />
        <!-- <div class="el-upload__text">在此拖入或选择<em>上传图片</em></div> -->
        <div class="el-upload__text">自动抠图目前依赖后端服务，需自行部署</div>
      </div>
      <div class="el-upload__tip el-upload__text"><em>体验前端效果演示以及修补编辑器，随便上传一张图片即可触发</em></div>
    </uploader>
    <el-progress v-if="!state.cutImage && state.progressText" :percentage="state.progress">
      <el-button text>
        {{ state.progressText }} <span v-show="state.progress">{{ state.progress }}%</span>
      </el-button>
    </el-progress>
    <div class="content">
      <div v-show="state.rawImage" v-loading="!state.cutImage" :style="{ width: state.offsetWidth ? state.offsetWidth + 'px' : '100%' }" class="scan-effect transparent-bg">
        <img ref="raw" :style="{ 'clip-path': 'inset(0 0 0 ' + state.percent + '%)' }" :src="state.rawImage" alt="" />
        <img v-show="state.cutImage" :src="state.cutImage" alt="结果图像" @mousemove="mousemove" />
        <div v-show="state.cutImage" :style="{ left: state.percent + '%' }" class="scan-line"></div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button v-show="state.cutImage && state.toolModel" @click="clear">清除重选</el-button>
        <el-button v-show="state.cutImage" type="primary" plain @click="edit">进入编辑模式</el-button>
        <el-button v-show="state.cutImage && state.toolModel" type="primary" @click="download"> 下载 </el-button>
        <el-button v-show="state.cutImage && !state.toolModel" v-loading="state.loading" type="primary" @click="cutDone"> {{ state.loading ? '上传中..' : '完成抠图' }} </el-button>
      </span>
    </template>
    <ImageExtraction ref="matting" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, nextTick, ref } from 'vue'
import { ElProgress } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import uploader from '@/components/common/Uploader/index.vue'
import _dl from '@/common/methods/download'
import ImageExtraction from '../ImageExtraction/index.vue'
import { selectImageFile, uploadCutPhotoToCloud } from './method'
import { useControlStore } from '@/store'

export type TImageCutoutState = {
    show: boolean;
    rawImage: string;
    cutImage: string;
    offsetWidth: number;
    percent: number;
    progress: number;
    progressText: string;
    toolModel: boolean;
    loading: boolean;
}

const controlStore = useControlStore()
const state = reactive<TImageCutoutState>({
  show: false,
  rawImage: '',
  cutImage: '',
  offsetWidth: 0,
  percent: 0,
  progress: 0,
  progressText: '',
  toolModel: true,
  loading: false,
})

let fileName: string = 'unknow'
let isRuning: boolean = false

const emits = defineEmits<{
  (event: "done", data: string): void
}>()

const raw = ref(null)
const matting = ref<typeof ImageExtraction | null>(null)

const open = (file: File) => {
  clear()
  state.loading = false
  state.show = true
  controlStore.setShowMoveable(false)
  nextTick(() => {
    if (file) {
      state.toolModel = false // 在编辑模式打开则不展示工具模式下的下载和清除按钮
      handleUploaderLoad(file)
    }
  })
}

defineExpose({
  open
})

const handleUploaderLoad = (file: File) => {
  selectImageFile(state as TImageCutoutState, raw, file, (result, name) => {
    fileName = name
    // TODO: 模拟演示
    const resultImage = 'https://pic.imgdb.cn/item/6522253ec458853aefb0b013.webp' // URL.createObjectURL(result)
    state.rawImage && (state.cutImage = resultImage)
    requestAnimationFrame(run)
  })
}

const handleClose = () => {
  controlStore.setShowMoveable(true)
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
  const url = await uploadCutPhotoToCloud(state.cutImage)
  emits('done', url)
  state.show = false
  handleClose()
}

const edit = () => {
  if (!matting.value) return
  matting.value.open(state.rawImage, state.cutImage, (base64: string) => {
    state.cutImage = base64
    state.percent = 0
    requestAnimationFrame(run)
  })
}

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


