<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 素材列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-02-29 16:49:59
-->
<template>
  <div class="wrap">
    <search-header v-model="searchKeyword" type="none" @change="searchChange" />
    <div style="height: 0.5rem" />
    <!-- <div class="types">
      <div v-for="(t, ti) in types" :key="ti + 't'" :style="{ backgroundColor: colors[ti] }" :class="['types__item', { 'types--select': currentType === t.id }]" @click="selectType(t)"></div>
    </div> -->
    <!-- <div class="tags">
      <el-check-tag v-for="(t2, t2i) in sub" :key="t2i + 't2'" :checked="t2.id === currentCheck" class="tags__item" @click="tagsChange(t2.id)">{{ t2.name }}</el-check-tag>
    </div> -->
    <classHeader v-show="!currentCategory" :types="types" @select="selectTypes">
      <template v-slot="{ index }">
        <div class="list-wrap">
          <div v-for="(item, i) in showList[index]" :key="i + 'sl'" draggable="false" @mousedown="dragStart($event, item)" @mousemove="mousemove" @mouseup="mouseup" @click.stop="selectItem(item)" @dragstart="dragStart($event, item)">
            <el-image class="list__img-thumb" :src="item.thumb" fit="contain" lazy loading="lazy" />
          </div>
        </div>
      </template>
    </classHeader>

    <ul v-if="currentCategory" v-infinite-scroll="load" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <classHeader :is-back="true" @back="back">{{ currentCategory.name }}</classHeader>
      <el-space fill wrap :fillRatio="30" direction="horizontal" class="list">
        <div v-for="(item, i) in list" :key="i + 'i'" class="list__item" draggable="false" @mousedown="dragStart($event, item)" @mousemove="mousemove" @mouseup="mouseup" @click.stop="selectItem(item)" @dragstart="dragStart($event, item)">
          <el-image class="list__img" :src="item.thumb" fit="contain" lazy loading="lazy" />
        </div>
      </el-space>
      <div v-show="loading" class="loading"><i class="el-icon-loading" /> 拼命加载中</div>
      <div v-show="loadDone" :style="list.length <= 0 ? 'padding-top: 4rem' : ''" class="loading">全部加载完毕</div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from 'vue'
import api from '@/api'
// import wImage from '../../widgets/wImage/wImage.vue'
import wImageSetting from '../../widgets/wImage/wImageSetting'
import wSvg from '../../widgets/wSvg/wSvg.vue'
import { mapActions, mapGetters } from 'vuex'
import setImageData from '@/common/methods/DesignFeatures/setImage'
import DragHelper from '@/common/hooks/dragHelper'

let isDrag = false
let startPoint = { x: 99999, y: 99999 }
const dragHelper = new DragHelper()

export default defineComponent({
  components: {},
  props: ['active'],
  setup(props) {
    const colors = ['#f8704b', '#5b89ff', '#2cc4cc', '#a8ba73', '#f8704b']
    const state: any = reactive({
      loading: false,
      loadDone: false,
      sub: [],
      list: [],
      currentType: 2, // 2
      currentCheck: 0,
      colors,
      currentCategory: null,
      types: [],
      showList: [],
      searchKeyword: '',
    })
    const pageOptions = { page: 0, pageSize: 20 }

    onMounted(async () => {
      if (state.types.length <= 0) {
        const types = await api.material.getKinds({ type: 2 })
        state.types = types
        for (const iterator of types) {
          const { list } = await api.material.getList({
            cate: iterator.id,
            pageSize: 3,
          })
          state.showList.push(list)
        }
      }
    })
    // const dragHelper = new DragHelper()
    // let isDrag = false
    // let startPoint = { x: 99999, y: 99999 }
    const mouseup = (e: any) => {
      e.preventDefault()
      setTimeout(() => {
        isDrag = false
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
      const list = await api.material.getList({
        ...{ cate: state.currentCategory?.id, search: state.searchKeyword, ...pageOptions },
      })
      if (init) {
        state.list = list?.list
      } else {
        state.list = state.list.concat(list?.list)
      }
      list?.list.length <= 0 && (state.loadDone = true)
      setTimeout(() => {
        state.loading = false
      }, 100)
    }

    const searchChange = (e: any) => {
      state.currentCategory = { name: '搜索结果' }
      load(true)
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
      searchChange,
      selectTypes,
      back,
      mouseup,
      mousemove,
    }
  },
  computed: {
    ...mapGetters(['dPage']),
  },
  methods: {
    ...mapActions(['addWidget']),
    async selectItem(item: any) {
      if (isDrag) {
        return
      }
      this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择
      let setting = item.type === 'svg' ? JSON.parse(JSON.stringify(wSvg.setting)) : JSON.parse(JSON.stringify(wImageSetting))
      const img: any = await setImageData(item)

      setting.width = img.width
      setting.height = img.height // parseInt(100 / item.value.ratio, 10)
      const { width: pW, height: pH } = this.dPage
      setting.left = pW / 2 - img.width / 2
      setting.top = pH / 2 - img.height / 2
      setting.imgUrl = item.url
      if (item.type === 'svg') {
        setting.svgUrl = item.url
        const models = JSON.parse(item.model)
        for (const key in models) {
          if (Object.hasOwnProperty.call(models, key)) {
            setting[key] = models[key]
          }
        }
      }
      if (item.type === 'mask') {
        setting.mask = item.url
      }
      this.addWidget(setting)
    },
    async dragStart(e: any, item: any) {
      startPoint = { x: e.x, y: e.y }
      const { width, height, thumb, url } = item
      const img = await setImageData({ width, height, url: thumb || url })
      dragHelper.start(e, img.canvasWidth)
      this.$store.commit('selectItem', { data: { value: item }, type: item.type })
    },
  },
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.tags {
  padding: 20px 0 0 10px;
  &__item {
    margin: 0 8px 8px 0;
  }
}

.infinite-list {
  height: 100%;
  padding-bottom: 150px;
}
.list {
  width: 100%;
  padding: 3.1rem 0 0 1rem;
  gap: 0px !important;
  &__item {
    overflow: hidden;
    background: #f8fafc;
    margin-bottom: 8px;
    margin-right: 8px;
  }
  &__img {
    cursor: grab;
    width: 142px;
    height: 142px;
    padding: 4px;
    border-radius: 4px;
  }
  &__img-thumb {
    cursor: grab;
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
.list-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.8rem;
}

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
