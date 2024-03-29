<!--
 * @Author: ShawnPhang
 * @Date: 2024-03-02 13:32:00
 * @Description: 裁剪组件
 * @LastEditors: ShawnPhang <site: book.palxp.com>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-02 13:32:00
-->
<template>
  <el-dialog v-model="dialogVisible" title="裁剪图片" width="80%" :before-close="handleClose" @close="cancel">
    <div id="wrap" v-loading="state.loading" style="height: 50vh">
      <img v-show="state.url" ref="imgBox" style="visibility: hidden" alt="imgBox" :src="state.url" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="state.loading" plain type="primary" @click="ok">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api from '@/api'
import { ElDialog } from 'element-plus'
import { ref, reactive, nextTick, toRefs } from 'vue'
// import { useStore } from 'vuex'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { useControlStore } from '@/pinia'

type TDoneParams = {
  newImg: string,
  data: Cropper.Data,
  width: string,
  height: string
}
type TDoneFunc = (event: "done", data: TDoneParams) => void

type TOpenItem = {
  rawImg?: string
  imgUrl: string
}

// const store = useStore()
const controlStore = useControlStore()
const state = reactive({
  loading: false,
  url: '',
})
const dialogVisible = ref(false)
const imgBox = ref<HTMLImageElement>()
let cropData: Cropper.Data | null
let cropper: Cropper

const emit = defineEmits<TDoneFunc>()

const handleClose = (done: () => void) => {
  done()
}

const open = async (item: TOpenItem, data: Cropper.Data) => {
  state.loading = true
  item.rawImg = item.rawImg ? item.rawImg : item.imgUrl
  cropData = data
  state.url = item.rawImg
  // store.commit('setShowMoveable', false)
  controlStore.setShowMoveable(false)
  dialogVisible.value = true
  await nextTick()
  setEdit()
}

const setEdit = () => {
  if (!imgBox || !imgBox.value) return
  cropper = new Cropper(imgBox.value, {
    // aspectRatio: imgBox.value.width / imgBox.value.height,
    dragMode: 'move',
    viewMode: 1,
    cropBoxMovable: false,
    // cropBoxResizable: false,
    highlight: false,
    background: true,
    // crop(event) {
    //   console.log(event);
    // },
  })
  imgBox.value.addEventListener('ready', function() {
    state.loading = false
    // if (this.cropper === cropper) {
    cropData && cropper.setData(cropData)
    // }
  })
}

const ok = () => {
  state.loading = true
  setTimeout(async () => {
    // const newImg = cropper.getCroppedCanvas({ maxWidth: 4096, minWidth: 4096 }).toDataURL('image/jpeg', 0.8)
    // const { width, height } = cropper.getCropBoxData()
    // const { preview_url } = await api.material.uploadBase64({ file: newImg })
    // context.emit('done', { newImg: preview_url, data: cropper.getData(), width, height })
    cancel()
  }, 100)
}

const cancel = () => {
  // store.commit('setShowMoveable', true)
  controlStore.setShowMoveable(true)
  dialogVisible.value = false
  state.url = ''
  cropData = null
  state.loading = false
  cropper.destroy()
}

toRefs(state),

</script>
