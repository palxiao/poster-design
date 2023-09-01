<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-13 22:18:35
 * @Description: 我的
 * @LastEditors: rayadaschn 115447518+rayadaschn@users.noreply.github.com
 * @LastEditTime: 2023-09-01 14:17:23
-->
<template>
  <div class="wrap">
    <el-tabs v-model="tabActiveName" :stretch="true" class="tabs" @tab-change="tabChange">
      <el-tab-pane label="资源管理" name="pics"> </el-tab-pane>
      <el-tab-pane label="我的作品" name="design"> </el-tab-pane>
    </el-tabs>
    <div v-show="tabActiveName === 'pics'" class="wrap">
      <uploader v-model="percent" class="upload" @done="uploadDone">
        <el-button class="upload-btn" plain>上传图片 <i class="iconfont icon-upload" /></el-button>
      </uploader>
      <el-button class="upload-btn upload-psd" plain type="primary" @click="openPSD">上传 PSD 模板</el-button>
      <photo-list ref="imgListRef" :edit="editOptions" :isDone="isDone" :listData="imgList" @load="load" @drag="dragStart" @select="selectImg" />
    </div>
    <div v-show="tabActiveName === 'design'" class="wrap">
      <ul ref="listRef" v-infinite-scroll="loadDesign" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
        <img-water-fall :listData="designList" @select="selectDesign" />
        <!-- <div v-show="loading" class="loading"><i class="el-icon-loading"></i>拼命加载中..</div> -->
        <div v-show="isDone" class="loading">全部加载完毕</div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, nextTick, ref, onMounted } from 'vue'
import { ElTabPane, ElTabs } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import uploader from '@/components/common/Uploader'
import api from '@/api'
import wImage from '../../widgets/wImage/wImage.vue'
import setImageData from '@/common/methods/DesignFeatures/setImage'
import useConfirm from '@/common/methods/confirm'

export default defineComponent({
  components: { uploader, ElTabPane, ElTabs },
  props: ['active'],
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const state: any = reactive({
      prePath: 'user',
      percent: { num: 0 }, // 当前上传进度
      imgList: [],
      designList: [],
      isDone: false,
      editOptions: [],
      listRef: null,
      imgListRef: null,
      tabActiveName: '',
    })
    let loading = false
    let page = 0
    let listPage = 0

    const load = (init: boolean) => {
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
          checkHeight(state.imgListRef.getRef(), load)
        }, 100)
      })
    }
    const loadDesign = (init: boolean = false) => {
      if (init) {
        state.designList = []
        listPage = 0
        state.isDone = false
      }
      if (state.isDone || loading) {
        return
      }
      loading = true
      listPage += 1
      api.home.getMyDesign({ page: listPage, pageSize: 10 }).then(({ list }: any) => {
        list.length <= 0
          ? (state.isDone = true)
          : (state.designList = state.designList.concat(
              list.map((x: any) => {
                x.cover = x.cover + '?r=' + Math.random()
                return x
              }),
            ))
        setTimeout(() => {
          loading = false
          checkHeight(state.listRef, loadDesign)
        }, 100)
      })
    }

    function checkHeight(el: any, loadFn: Function) {
      // 检查高度是否占满，否则继续请求下一页
      const isLess = el.offsetHeight > el.firstElementChild.offsetHeight
      isLess && loadFn()
    }

    onMounted(() => {
      load(true)
      nextTick(() => {
        state.tabActiveName = 'pics'
      })
    })

    const selectImg = async (index: number) => {
      const item: any = state.imgList[index]
      store.commit('setShowMoveable', false) // 清理掉上一次的选择
      let setting = JSON.parse(JSON.stringify(wImage.setting))
      const img: any = await setImageData(item)
      setting.width = img.width
      setting.height = img.height // parseInt(100 / item.value.ratio, 10)
      setting.imgUrl = item.url
      const { width: pW, height: pH } = store.getters.dPage
      setting.left = pW / 2 - img.width / 2
      setting.top = pH / 2 - img.height / 2
      store.dispatch('addWidget', setting)
    }
    const deleteImg = async ({ i, item }: any) => {
      store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      const isPass = await useConfirm('警告', '删除后不可找回，已引用资源将会失效，请谨慎操作', 'warning')
      if (!isPass) {
        return false
      }
      const arr = item.url.split('/')
      let key = arr.splice(3, arr.length - 1).join('/')
      api.material.deleteMyPhoto({ id: item.id, key })
      state.imgListRef.delItem(i) // 通知标记
    }
    state.editOptions = [
      {
        name: '删除',
        fn: deleteImg,
      },
    ]
    const dragStart = (index: number) => {
      const item = state.imgList[index]
      store.commit('selectItem', { data: { value: item }, type: 'image' })
    }
    const uploadDone = async (res: any) => {
      await api.material.addMyPhoto(res)
      state.imgList = []
      load(true)
    }

    const tabChange = (tabName: string) => {
      if (tabName === 'design') {
        loadDesign(true)
      }
    }

    const selectDesign = async (item: any) => {
      // const { id }: any = state.designList[index]
      const { id }: any = item
      window.open(`${window.location.protocol + '//' + window.location.host}/home?id=${id}`)
    }

    const openPSD = () => {
      window.open(router.resolve('/psd').href, '_blank')
    }

    return {
      ...toRefs(state),
      selectDesign,
      loadDesign,
      load,
      uploadDone,
      selectImg,
      deleteImg,
      dragStart,
      tabChange,
      openPSD,
    }
  },
})
</script>

<style lang="less" scoped>
.infinite-list {
  height: 100%;
  padding-bottom: 150px;
}
.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.tabs {
  padding: 0.2rem 0;
}
.upload {
  width: auto;
  margin: 0 0 0 1rem;
  display: inline-block;
  &-btn {
    width: 160px;
    font-size: 14px;
  }
  &-psd {
    width: 124px;
    margin-left: 10px;
  }
}
.wrap {
  width: 100%;
  height: 100%;
}
</style>
