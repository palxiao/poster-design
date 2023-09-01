<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 背景图
 * @LastEditors: rayadaschn 115447518+rayadaschn@users.noreply.github.com
 * @LastEditTime: 2023-09-01 14:18:54
-->
<template>
  <div class="wrap">
    <div class="color__box">
      <div v-for="c in colors" :key="c" :style="{ background: c }" class="color__item" @click="setBGcolor(c)"></div>
    </div>
    <ul v-if="showList" v-infinite-scroll="loadData" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <el-space fill wrap :fillRatio="30" direction="horizontal" class="list">
        <div v-for="(item, i) in bgList" :key="i + 'i'" draggable="false" @click.stop="selectItem(item)" @dragstart="dragStart($event, item)">
          <el-image class="list__img" :src="item.thumb" fit="cover"></el-image>
        </div>
      </el-space>
      <div v-show="loading" class="loading"><i class="el-icon-loading"></i> 拼命加载中</div>
      <div v-show="loadDone" class="loading">全部加载完毕</div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
// import { ElDivider } from 'element-plus'
import api from '@/api'
import { mapActions, useStore } from 'vuex'

export default defineComponent({
  // components: { ElDivider },
  setup(props) {
    const store = useStore()
    const state = reactive({
      loading: false,
      loadDone: false,
      bgList: [],
      showList: true,
      colors: ['#000000ff', '#999999ff', '#CCCCCCff', '#FFFFFFff', '#E65353ff', '#FFD835ff', '#70BC59ff', '#607AF4ff', '#976BEEff'],
    })
    const pageOptions = { page: 0, pageSize: 20 }

    const loadData = () => {
      if (state.loading) {
        return
      }
      load()
    }

    const load = async (init: boolean = false) => {
      if (state.loadDone) {
        return
      }
      state.loading = true
      pageOptions.page += 1

      if (init) {
        state.bgList = []
        pageOptions.page = 1
      }

      await api.material.getImagesList({ cate: 16, page: pageOptions.page }).then(({ list }: any) => {
        if (list.length > 0) {
          state.bgList.push(...list)
        } else {
          state.loadDone = true
        }
      })

      setTimeout(() => {
        state.loading = false
      }, 100)
    }

    function setBGcolor(color: string) {
      store.dispatch('updatePageData', {
        key: 'backgroundImage',
        value: '',
      })
      store.dispatch('updatePageData', {
        key: 'backgroundColor',
        value: color,
        pushHistory: true,
      })
      store.dispatch('selectWidget', {
        uuid: '-1',
      })
    }

    return {
      ...toRefs(state),
      load,
      setBGcolor,
      loadData,
    }
  },
  methods: {
    ...mapActions(['selectWidget', 'updatePageData']),
    async selectItem(item: any) {
      // this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择
      this.updatePageData({
        key: 'backgroundTransform',
        value: {},
      })
      this.updatePageData({
        key: 'backgroundImage',
        value: item.url,
        pushHistory: true,
      })
      this.selectWidget({
        uuid: '-1',
      })
    },
    dragStart(e: any, item: any) {
      this.$store.commit('selectItem', { data: {}, type: 'bg' })
    },
  },
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}

.infinite-list {
  // margin-right: 0.4rem;
  height: 100%;
  padding-bottom: 150px;
  // scrollbar-width: none; /* Firefox */
  // -ms-overflow-style: none; /* IE 10+ */
}
// .infinite-list::-webkit-scrollbar {
//   display: none; /* Chrome Safari */
// }
.list {
  width: 100%;
  padding: 0 0 0 1rem;
  &__img {
    cursor: pointer;
    width: 92px;
    height: 92px;
  }
  &__img:hover::before {
    content: ' ';
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
}

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.color {
  &__box {
    padding: 1.2rem 1rem;
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    border: 1px solid rgba(0, 0, 0, 0.08);
    margin: 2.8px;
    width: 43px;
    height: 36px;
    border-radius: 2px;
    cursor: pointer;
  }
}
</style>
