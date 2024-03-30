<!--
 * @Author: ShawnPhang
 * @Date: 2022-10-08 10:07:19
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @Date: 2024-03-04 18:10:00
-->
<template>
  <el-dialog v-model="state.dialogVisible" title="选择图片" @close="close">
    <el-tabs tab-position="left" style="height: 60vh" class="demo-tabs" @tab-change="tabChange">
      <el-tab-pane label="我的素材">
        <div class="pic__box">
          <photo-list :canDrag="false" :isDone="state.isDone" :listData="state.imgList" @load="load" @select="selectImg" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="照片图库">
        <div class="pic__box">
          <photo-list :canDrag="false" :isDone="state.isPicsDone" :listData="state.recommendImgList" @load="loadPic" @select="selectImg($event, state.recommendImgList)" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button plain type="primary" @click="dialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
// import { useStore } from 'vuex'
import { ElTabPane, ElTabs, TabPaneName } from 'element-plus'
import api from '@/api'
import { TGetImageListResult } from '@/api/material'
import { useControlStore } from '@/store'

type TEmits = (event: 'select', data: TGetImageListResult) => void

type TState = {
  dialogVisible: boolean;
  imgList: TGetImageListResult[];
  recommendImgList: TGetImageListResult[];
  isDone: boolean;
  isPicsDone: boolean;
}

const emits = defineEmits<TEmits>()

// const store = useStore()
const controlStore = useControlStore()

const state = reactive<TState>({
  dialogVisible: false,
  imgList: [],
  recommendImgList: [],
  isDone: false,
  isPicsDone: false,
})

let loading = false
let page = 0
let picPage = 0

const load = async (init?: boolean) => {
  if (init) {
    state.imgList = []
    page = 0
    state.isDone = false
  }
  if (state.isDone || loading) {
    return
  }
  loading = true
  page += 1
  api.material.getMyPhoto({ page }).then(({ list }) => {
    list.length <= 0 ? (state.isDone = true) : (state.imgList = state.imgList.concat(list as TGetImageListResult[]))
    setTimeout(() => {
      loading = false
    }, 100)
  })
}

const loadPic = (init?: boolean) => {
  if (state.isPicsDone || loading) {
    return
  }
  if (init && state.recommendImgList.length > 0) {
    return
  }
  loading = true
  picPage += 1
  api.material.getImagesList({ page: picPage }).then(({ list }) => {
    list.length <= 0 ? (state.isPicsDone = true) : (state.recommendImgList = state.recommendImgList.concat(list))
    setTimeout(() => {
      loading = false
    }, 100)
  })
}

const open = () => {
  state.dialogVisible = true
  load()
  // store.commit('setShowMoveable', false)
  controlStore.setShowMoveable(false)
}

const close = () => {
  // store.commit('setShowMoveable', true)
  controlStore.setShowMoveable(true)
}

const selectImg = (index: number, list: TGetImageListResult[]) => {
  const item: TGetImageListResult = list ? list[index] : state.imgList[index]
  // context.emit('select', item)
  emits('select', item)
  state.dialogVisible = false
}

const tabChange = (index: TabPaneName) => {
  if (index == 1) {
    loadPic(true)
  }
}

defineExpose({
  open
})

</script>

<style lang="less" scoped>
.pic__box {
  width: 100%;
  height: 70vh;
}
</style>
