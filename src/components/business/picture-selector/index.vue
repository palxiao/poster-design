<!--
 * @Author: ShawnPhang
 * @Date: 2022-10-08 10:07:19
 * @Description:  
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 17:57:46
-->
<template>
  <el-dialog v-model="dialogVisible" title="选择图片" @close="close">
    <el-tabs tab-position="left" style="height: 60vh" class="demo-tabs">
      <el-tab-pane label="个人素材">
        <div class="pic__box">
          <photo-list ref="imgListComp" :isDone="isDone" :listData="imgList" @load="load" @select="selectImg" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="照片库"></el-tab-pane>
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

<script lang="ts">
import { defineComponent, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElTabPane, ElTabs } from 'element-plus'
import api from '@/api'

export default defineComponent({
  components: { [ElTabPane.name]: ElTabPane, [ElTabs.name]: ElTabs },
  emits: ['select'],
  setup(props, context) {
    const store = useStore()
    const state: any = reactive({
      dialogVisible: false,
      imgList: [],
      isDone: false,
    })

    let loading = false
    let page = 0
    let listPage = 0
    const load = (init?: boolean) => {
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
      api.material.getMyPhoto({ page }).then(({ list }: any) => {
        list.length <= 0 ? (state.isDone = true) : (state.imgList = state.imgList.concat(list))
        setTimeout(() => {
          loading = false
        }, 100)
      })
    }

    const open = () => {
      state.dialogVisible = true
      load()
      store.commit('setShowMoveable', false)
    }

    const close = () => {
      store.commit('setShowMoveable', true)
    }

    const selectImg = (index: number) => {
      const item: any = state.imgList[index]
      context.emit('select', item)
      state.dialogVisible = false
    }

    return {
      ...toRefs(state),
      open,
      close,
      load,
      selectImg,
    }
  },
})
</script>

<style lang="less" scoped>
.pic__box {
  width: 100%;
  height: 70vh;
}
</style>
