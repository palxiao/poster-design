<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-11 18:48:23
 * @Description:  
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-10 16:27:41
-->
<template>
  <div class="wrap">
    <search-header type="none" @change="searchChange" />
    <photo-list v-if="showList" :isDone="loadDone" :listData="recommendImgList" @load="getDataList" @drag="dragStart" @select="selectImg" />
  </div>
</template>

<script>
// 图片列表
const NAME = 'img-list-wrap'

import wImage from '../../widgets/wImage/wImage.vue'
import api from '@/api'
import { mapActions, mapGetters } from 'vuex'
import setImageData from '@/common/methods/DesignFeatures/setImage'
// import imgList from './components/imgList.vue'

export default {
  name: NAME,
  // components: { imgList },
  props: ['active'],
  data() {
    return {
      recommendImgList: [],
      // loading: false,
      loadDone: false,
      showList: false,
      page: 0,
    }
  },
  computed: {
    ...mapGetters(['dPage']),
  },
  watch: {
    active(val) {
      if (this.active) {
        this.showList = true
        this.getDataList()
      }
    },
  },
  mounted() {
    // this.getDataList()
  },
  methods: {
    ...mapActions(['addWidget']),
    async getDataList() {
      if (this.loadDone || this.loading) {
        return
      }
      this.loading = true
      this.page += 1
      let { list = [], total } = await api.material.getImagesList({ page: this.page, pageSize: 30 })
      list.length <= 0 ? (this.loadDone = true) : (this.recommendImgList = this.recommendImgList.concat(list))
      setTimeout(() => {
        this.loading = false
      }, 100)
    },
    async selectImg(index) {
      const item = this.recommendImgList[index]
      this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择
      let setting = JSON.parse(JSON.stringify(wImage.setting))
      const img = await setImageData(item) // await getImage(item.url)
      setting.width = img.width
      setting.height = img.height // parseInt(100 / item.value.ratio, 10)
      setting.imgUrl = item.url
      const { width: pW, height: pH } = this.dPage
      setting.left = pW / 2 - img.width / 2
      setting.top = pH / 2 - img.height / 2
      this.addWidget(setting)
    },
    dragStart(index) {
      const item = this.recommendImgList[index]
      this.$store.commit('selectItem', { data: { value: item }, type: 'image' })
    },
    searchChange(e) {
      console.log(e)
    },
  },
}
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
