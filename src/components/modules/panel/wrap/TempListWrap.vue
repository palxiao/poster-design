<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-27 15:16:07
 * @Description: 模板列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-22 09:55:59
-->
<template>
  <div class="wrap">
    <search-header v-model="searchKeyword" @change="cateChange" />
    <el-divider v-show="title" style="margin-top: 1.7rem" content-position="left">
      <span style="font-weight: bold">{{ title }}</span>
    </el-divider>

    <ul ref="listRef" v-infinite-scroll="load" class="infinite-list" :infinite-scroll-distance="150" style="overflow: auto">
      <img-water-fall :listData="list" @select="selectItem" />
      <div v-show="loading" class="loading"><i class="el-icon-loading"></i> 拼命加载中</div>
      <div v-show="loadDone" class="loading">全部加载完毕</div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue'
import api from '@/api'
import { mapActions, mapGetters, useStore } from 'vuex'
import { useRoute } from 'vue-router'
// import chooseType from './components/chooseType.vue'
// import editModel from './components/editModel.vue'
import searchHeader from './components/searchHeader.vue'
import useConfirm from '@/common/methods/confirm'

export default defineComponent({
  components: { searchHeader },
  setup() {
    const listRef = ref(null)
    const route = useRoute()
    const store = useStore()
    const state: any = reactive({
      loading: false,
      loadDone: false,
      list: [],
      title: '推荐模板',
      searchKeyword: '',
    })
    const pageOptions: any = { page: 0, pageSize: 20, cate: 1 }
    const { cate, edit } = route.query
    cate && (pageOptions.cate = cate)
    edit && store.commit('managerEdit', true)

    // onMounted(async () => {})

    const load = async (init: boolean = false, stat?: string) => {
      stat && (pageOptions.state = stat)

      if (init) {
        listRef.value.scrollTop = 0
        state.list = []
        pageOptions.page = 0
        state.loadDone = false
      }
      if (state.loadDone || state.loading) {
        return
      }

      state.loading = true
      pageOptions.page += 1

      const res = await api.home.getTempList({ search: state.searchKeyword, ...pageOptions })
      res.list.length <= 0 && (state.loadDone = true)
      state.list = state.list.concat(res.list)

      setTimeout(() => {
        state.loading = false
        checkHeight()
      }, 100)
    }

    function cateChange(type: any) {
      state.title = type.name
      const init = pageOptions.cate != type.id
      pageOptions.cate = type.id
      load(init, pageOptions.stat)
    }

    function checkHeight() {
      // 检查高度是否占满，否则继续请求下一页
      const isLess = listRef.value.offsetHeight > listRef.value.firstElementChild.offsetHeight
      isLess && load()
    }

    return {
      ...toRefs(state),
      load,
      cateChange,
      listRef,
    }
  },
  computed: {
    ...mapGetters(['tempEditing', 'dHistoryParams']),
  },
  methods: {
    ...mapActions(['selectWidget', 'updatePageData', 'setTemplate', 'pushHistory']),
    async selectItem(item: any) {
      this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      if (this.dHistoryParams.length > 0) {
        const isPass = await useConfirm('提示', '使用模板后，当前页面将会被替换，是否继续', 'warning')
        if (!isPass) {
          return false
        }
      }
      this.$store.commit('managerEdit', false)
      this.$store.commit('setDWidgets', [])

      this.setTempId(item.id)

      let result = null
      if (!item.data) {
        const res = await api.home.getTempDetail({ id: item.id })
        result = JSON.parse(res.data)
      } else {
        result = JSON.parse(item.data)
      }
      const { page, widgets } = result
      console.log(widgets)

      this.$store.commit('setDPage', page)
      this.setTemplate(widgets)
      setTimeout(() => {
        this.$store.commit('zoomScreenChange')
      }, 300)
      this.selectWidget({
        uuid: '-1',
      })
    },
    // action({ name, value }: any, item: any, index: number) {
    //   switch (name) {
    //     case 'edit':
    //       this.editTemp(item)
    //       break
    //     case 'del':
    //       this.delTemp(item, index)
    //       break
    //     case 'stat':
    //       this.setTempStat(item, value)
    //       break
    //   }
    // },
    // editTemp(item: any) {
    // this.$router.push({ path: '/home', query: { tempid: item.id }, replace: true })
    // this.$store.commit('managerEdit', true)
    // },
    // delTemp({ id }: any, index: number) {
    //   api.home.removeComp({ id })
    //   this.list.splice(index, 1)
    //   this.$store.commit('managerEdit', false)
    // },
    // setTempStat({ id }: any, stat: string) {
    //   api.home.setTempStat({ id, stat })
    // },
    setTempId(tempId: number | string) {
      const { id } = this.$route.query
      this.$router.push({ path: '/home', query: { tempid: tempId, id }, replace: true })
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
  height: 100%;
  margin-top: 1rem;
  padding-bottom: 150px;
}
// .list {
//   width: 100%;
//   padding: 4px 0 0 10px;
//   &__img {
//     cursor: pointer;
//     width: 128px;
//     height: auto;
//     position: relative;
//     &-mask {
//       opacity: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0, 0, 0, 0.12);
//       position: absolute;
//       z-index: 1;
//       top: 0;
//       left: 0;
//     }
//   }
//   &__img:hover {
//     background: rgba(0, 0, 0, 0.04);
//   }
//   &__img:hover > &__img-mask {
//     opacity: 1;
//   }
// }

.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
