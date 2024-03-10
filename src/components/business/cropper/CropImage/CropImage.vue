<!--
 * @Author: ShawnPhang
 * @Date: 2021-09-28 20:06:25
 * @Description: 裁剪组件
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 17:58:00
-->
<template>
  <el-dialog v-model="dialogVisible" title="裁剪图片" width="80%" :before-close="handleClose" @close="cancel">
    <div id="wrap" v-loading="loading" style="height: 50vh">
      <img v-show="url" ref="imgBox" style="visibility: hidden" alt="imgBox" :src="url" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="loading" plain type="primary" @click="ok">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import api from '@/api'
import { ElDialog } from 'element-plus'
import { ref, defineComponent, toRefs, reactive, nextTick } from 'vue'
import { useStore } from 'vuex'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default defineComponent({
  components: { ElDialog },
  emits: ['done'],
  setup(props, context) {
    const store = useStore()
    const state = reactive({
      loading: false,
      url: '',
    })
    const dialogVisible = ref(false)
    const imgBox = ref<HTMLImageElement | any>()
    let cropData: any = null
    let cropper: any = null

    const handleClose = (done: any) => {
      done()
    }
    const open = async (item: any, data = {}) => {
      state.loading = true
      item.rawImg = item.rawImg ? item.rawImg : item.imgUrl
      cropData = data
      state.url = item.rawImg
      store.commit('setShowMoveable', false)
      dialogVisible.value = true
      await nextTick()
      setEdit()
    }
    const setEdit = () => {
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
        if (this.cropper === cropper) {
          cropData && cropper.setData(cropData)
        }
      })
    }
    const ok = () => {
      state.loading = true
      setTimeout(async () => {
        const newImg = cropper.getCroppedCanvas({ maxWidth: 4096, minWidth: 4096 }).toDataURL('image/jpeg', 0.8)
        const { width, height } = cropper.getCropBoxData()
        const { preview_url } = await api.material.uploadBase64({ file: newImg })
        context.emit('done', { newImg: preview_url, data: cropper.getData(), width, height })
        cancel()
      }, 100)
    }
    
    const cancel = () => {
      store.commit('setShowMoveable', true)
      dialogVisible.value = false
      state.url = ''
      cropData = null
      state.loading = false
      cropper.destroy()
    }
    return {
      ...toRefs(state),
      dialogVisible,
      handleClose,
      open,
      ok,
      cancel,
      imgBox,
    }
  },
})
</script>
