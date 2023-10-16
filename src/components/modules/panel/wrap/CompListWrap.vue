<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 素材列表，主要用于文字组合列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-16 00:30:16
-->
<template>
  <div class="wrap">
    <!-- <div class="search__wrap">
      <el-input v-model="searchValue" placeholder="输入关键词搜索" class="input-with-select">
        <template #append>
          <el-button><i class="iconfont icon-search"></i></el-button>
        </template>
      </el-input>
    </div>
    <el-divider content-position="left">推荐组件</el-divider> -->
    <classHeader v-show="!currentCategory" :types="types" @select="selectTypes">
      <template v-slot="{ index }">
        <div class="list-wrap">
          <div v-for="(item, i) in showList[index]" :key="i + 'sl'" draggable="false" @mousedown="dragStart($event, item)" @mousemove="mousemove" @mouseup="mouseup" @click.stop="selectItem(item)" @dragstart="dragStart($event, item)">
            <el-image class="list__img-thumb" :src="item.cover" fit="contain" lazy loading="lazy"></el-image>
          </div>
        </div>
      </template>
    </classHeader>

    <ul v-if="currentCategory" v-infinite-scroll="load" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <classHeader :is-back="true" @back="back">{{ currentCategory.name }}</classHeader>
      <el-space fill wrap :fillRatio="30" direction="horizontal" class="list">
        <div v-for="(item, i) in list" :key="i + 'i'" class="list__item" draggable="false" @mousedown="dragStart($event, item)" @mousemove="mousemove" @mouseup="mouseup" @click.stop="selectItem(item)" @dragstart="dragStart($event, item)">
          <!-- <edit-model :isComp="true" @action="action($event, item, i)"> -->
          <el-image class="list__img" :src="item.cover" fit="contain" lazy loading="lazy" />
          <!-- </edit-model> -->
        </div>
      </el-space>
      <div v-show="loading" class="loading"><i class="el-icon-loading"></i> 拼命加载中</div>
      <div v-show="loadDone" class="loading">全部加载完毕</div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from 'vue'
// import { ElDivider } from 'element-plus'
import api from '@/api'
import { mapActions } from 'vuex'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import DragHelper from '@/common/hooks/dragHelper'
import setImageData from '@/common/methods/DesignFeatures/setImage'

const dragHelper = new DragHelper()
let isDrag = false
let startPoint = { x: 99999, y: 99999 }
let tempDetail: any = null

export default defineComponent({
  components: {},
  setup(props) {
    const state = reactive({
      loading: false,
      loadDone: false,
      list: [],
      searchValue: '',
      currentCategory: null,
      types: [],
      showList: [],
    })
    const pageOptions = { type: 1, page: 0, pageSize: 20 }

    onMounted(async () => {
      if (state.types.length <= 0) {
        const types = await api.material.getKinds({ type: 3 })
        state.types = types
        for (const iterator of types) {
          const { list } = await api.home.getCompList({
            cate: iterator.id,
            type: 1,
            pageSize: 3,
          })
          state.showList.push(list)
        }
      }
    })
    const mouseup = (e: any) => {
      e.preventDefault()
      setTimeout(() => {
        isDrag = false
        tempDetail = null
        startPoint = { x: 99999, y: 99999 }
      }, 10)
    }
    const mousemove = (e: any) => {
      e.preventDefault()
      if (e.x - startPoint.x > 2 || e.y - startPoint.y > 2) {
        isDrag = true
      }
    }

    const load = async (init: boolean = false) => {
      if (init) {
        state.list = []
        pageOptions.page = 0
        state.loadDone = false
      }

      if (state.loadDone || state.loading) {
        return
      }

      state.loading = true
      pageOptions.page += 1

      const res = await api.home.getCompList({
        ...Object.assign(pageOptions, { cate: state.currentCategory?.id }),
      })
      if (init) {
        state.list = res?.list
      } else {
        res?.list.length <= 0 && (state.loadDone = true)
        state.list = state.list.concat(res?.list)
      }
      setTimeout(() => {
        state.loading = false
      }, 100)
    }

    function action({ name, value }: any, item: any, index: number) {
      switch (name) {
        case 'del':
          delComp(item, index)
          break
      }
    }
    function delComp({ id }: any, index: number) {
      api.home.removeComp({ id })
      state.list.splice(index, 1)
    }

    const selectTypes = (item: any) => {
      state.currentCategory = item
      load(true)
    }
    const back = () => {
      state.currentCategory = null
    }

    return {
      ...toRefs(state),
      load,
      action,
      back,
      selectTypes,
      mouseup,
      mousemove,
    }
  },
  methods: {
    ...mapActions(['addGroup', 'addWidget']),
    async selectItem(item: any) {
      if (isDrag) {
        return
      }
      this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择
      tempDetail = tempDetail || (await api.home.getTempDetail({ id: item.id, type: 1 }))
      // let group = JSON.parse(tempDetail.data)
      const group: any = await getComponentsData(tempDetail.data)
      let parent: any = { x: 0, y: 0 }
      const { width: pW, height: pH } = this.$store.getters.dPage

      Array.isArray(group) &&
        group.forEach((element: any) => {
          element.type === 'w-group' && (parent = element)
        })
      if (parent.isContainer) {
        group.forEach((element: any) => {
          element.left += (pW - parent.width) / 2
          element.top += (pH - parent.height) / 2
        })
        this.addGroup(group)
      } else {
        group.text && (group.text = decodeURIComponent(group.text))
        group.left = pW / 2 - group.fontSize * (group.text.length / 2)
        group.top = pH / 2 - group.fontSize / 2
        this.addWidget(group)
      }
    },
    async dragStart(e: any, { id }: any) {
      startPoint = { x: e.x, y: e.y }
      tempDetail = await api.home.getTempDetail({ id, type: 1 })
      let finalWidth = tempDetail.width
      if (finalWidth) {
        const img = await setImageData(tempDetail)
        finalWidth = img.canvasWidth
      }
      dragHelper.start(e, finalWidth)
      if (Array.isArray(JSON.parse(tempDetail.data))) {
        this.$store.commit('selectItem', { data: JSON.parse(tempDetail.data), type: 'group' })
      } else {
        this.$store.commit('selectItem', { data: JSON.parse(tempDetail.data), type: 'text' })
      }
    },
  },
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}

.search__wrap {
  padding: 1.4rem 1rem 0.8rem 1rem;
}

.infinite-list {
  height: 100%;
  padding-bottom: 150px;
}
.list {
  width: 100%;
  // padding: 20px 0 0 10px;
  padding: 3.1rem 0 0 1rem;
  &__item {
    overflow: hidden;
    background: #f8fafc;
  }
  &__img {
    cursor: pointer;
    width: 142px;
    height: 142px;
    padding: 4px;
    border-radius: 4px;
  }
  &__img-thumb {
    cursor: pointer;
    width: 90px;
    height: 90px;
    background: #f8fafc;
    padding: 4px;
    border-radius: 4px;
  }
  &__img:hover,
  &__img-thumb:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.list-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.8rem;
}
</style>
