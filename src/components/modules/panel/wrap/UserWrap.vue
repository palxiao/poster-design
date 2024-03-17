<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-13 22:18:35
 * @Description: 我的
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-11 01:42:44
-->
<template>
  <div class="wrap">
    <el-tabs v-model="state.tabActiveName" :stretch="true" class="tabs" @tab-change="tabChange">
      <el-tab-pane label="资源管理" name="pics"> </el-tab-pane>
      <el-tab-pane label="我的作品" name="design"> </el-tab-pane>
    </el-tabs>
    <div v-show="state.tabActiveName === 'pics'">
      <uploader v-model="state.percent" class="upload" @done="uploadDone">
        <el-button class="upload-btn" plain>上传图片 <i class="iconfont icon-upload" /></el-button>
      </uploader>
      <el-button class="upload-btn upload-psd" plain type="primary" @click="openPSD">上传 PSD 模板</el-button>
      <div style="margin: 1rem; height: 100vh">
        <photo-list
          ref="imgListRef" 
          :edit="state.editOptions.photo" :isDone="state.isDone"
          :listData="state.imgList"
          @load="load" @drag="dragStart" @select="selectImg"
        />
      </div>
    </div>
    <div v-show="state.tabActiveName === 'design'" class="wrap">
      <ul ref="listRef" v-infinite-scroll="loadDesign" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
        <img-water-fall :edit="state.editOptions.works" :listData="state.designList" @select="selectDesign" />
        <!-- <div v-show="loading" class="loading"><i class="el-icon-loading"></i>拼命加载中..</div> -->
        <div v-show="state.isDone" class="loading">全部加载完毕</div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, watch, nextTick, ref, onMounted } from 'vue'
import { ElTabPane, ElTabs, TabPaneName } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import uploader from '@/components/common/Uploader'
import api from '@/api'
import wImage from '../../widgets/wImage/wImage.vue'
import setImageData, { TItem2DataParam } from '@/common/methods/DesignFeatures/setImage'
import useConfirm from '@/common/methods/confirm'
import { TGetImageListResult, TMyPhotoResult } from '@/api/material'
import photoList from './components/photoList.vue'
import imgWaterFall from './components/imgWaterFall.vue'
import { TUploadDoneData } from '@/components/common/Uploader/index.vue'
import { IGetTempListData } from '@/api/home'
import eventBus from '@/utils/plugins/eventBus'

type TProps = {
  active?: number
}

type TState = {
  prePath: string,
  percent: { num: number }, // 当前上传进度
  imgList: IGetTempListData[],
  designList: IGetTempListData[],
  isDone: boolean,
  editOptions: Record<string, any>,
  tabActiveName: string,
}

const props = defineProps<TProps>()

const router = useRouter()
const store = useStore()
const listRef = ref<HTMLElement | null>(null)
const imgListRef = ref<typeof photoList | null>(null)

const state = reactive<TState>({
  prePath: 'user',
  percent: { num: 0 }, // 当前上传进度
  imgList: [],
  designList: [],
  isDone: false,
  editOptions: [],
  tabActiveName: '',
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
  api.material.getMyPhoto({ page }).then(({ list }) => {
    
    if (list.length <= 0) {
      state.isDone = true
    } else {
      state.imgList = state.imgList.concat(list)
    }
    setTimeout(() => {
      loading = false
      if (!imgListRef.value) return
      checkHeight(imgListRef.value.getRef(), load)
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
  api.home.getMyDesign({ page: listPage, pageSize: 10 }).then(({ list }) => {
    list.length <= 0
      ? (state.isDone = true)
      : (state.designList = state.designList.concat(
          list.map((x) => {
            x.cover = x.cover + '?r=' + Math.random()
            return x
          }),
        ))
    setTimeout(() => {
      loading = false
      if (!listRef.value) return
      checkHeight(listRef.value, loadDesign)
    }, 100)
  })
}

function checkHeight(el: HTMLElement, loadFn: Function) {
  // 检查高度是否占满，否则继续请求下一页
  if (el.offsetHeight && el.firstElementChild) {
    const isLess = el.offsetHeight > (el.firstElementChild as HTMLElement).offsetHeight
    isLess && loadFn()
  }
}

onMounted(() => {
  load(true)
  nextTick(() => {
    state.tabActiveName = 'pics'
  })
})

const selectImg = async (index: number) => {
  const item = state.imgList[index]
  store.commit('setShowMoveable', false) // 清理掉上一次的选择
  let setting = JSON.parse(JSON.stringify(wImage.setting))
  const img = await setImageData(item)
  setting.width = img.width
  setting.height = img.height // parseInt(100 / item.value.ratio, 10)
  setting.imgUrl = item.url
  const { width: pW, height: pH } = store.getters.dPage
  setting.left = pW / 2 - img.width / 2
  setting.top = pH / 2 - img.height / 2
  store.dispatch('addWidget', setting)
}

type controlImgParam = {
  i: number
  item: Required<TItem2DataParam>
}

const deleteImg = async ({ i, item }: controlImgParam) => {
  store.commit('setShowMoveable', false) // 清理掉上一次的选择框
  const isPass = await useConfirm('警告', '删除后不可找回，已引用资源将会失效，请谨慎操作', 'warning')
  if (!isPass) {
    return false
  }
  const arr = item.url.split('/')
  let key = arr.splice(3, arr.length - 1).join('/')
  api.material.deleteMyPhoto({ id: item.id, key })
  if (!imgListRef.value) return
  imgListRef.value.delItem(i) // 通知标记
}
const deleteWorks = async ({ i, item }: controlImgParam) => {
  const isPass = await useConfirm('警告', '删除后不可找回，请确认操作', 'warning')
  if (isPass) {
    await api.material.deleteMyWorks({ id: item.id })
    setTimeout(() => {
      router.push({ path: '/home', query: {  }, replace: true })
      loadDesign(true)
    }, 300);
  }
}

state.editOptions = {
  photo: [
    {
      name: '删除',
      fn: deleteImg,
    },
  ],
  works: [
    {
      name: '删除',
      fn: deleteWorks,
    },
  ]
}

const dragStart = (index: number) => {
  const item = state.imgList[index]
  store.commit('selectItem', { data: { value: item }, type: 'image' })
}
const uploadDone = async (res: TUploadDoneData) => {
  await api.material.addMyPhoto(res)
  state.imgList = []
  load(true)
}

const tabChange = (tabName: TabPaneName) => {
  if (tabName === 'design') {
    loadDesign(true)
  }
}

const selectDesign = async (item: IGetTempListData) => {
  // const { id }: any = state.designList[index]
  const { id } = item
  window.open(`${window.location.protocol + '//' + window.location.host}/home?id=${id}`)
}

const openPSD = () => {
  window.open(router.resolve('/psd').href, '_blank')
}

eventBus.on('refreshUserImages', () => {
  state.imgList = []
  load(true)
})

defineExpose({
  selectDesign,
  loadDesign,
  load,
  uploadDone,
  selectImg,
  deleteImg,
  dragStart,
  tabChange,
  openPSD,
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
