<!--
 * @Author: ShawnPhang
 * @Date: 2021-12-16 16:20:16
 * @Description: 瀑布流组件
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-06 17:58:49
-->
<template>
  <div ref="imgWaterFall" :style="{ height: countHeight + 'px' }" class="img-water-fall">
    <!-- backgroundImage: `url(${item.cover})` -->
    <div v-for="(item, index) in list" :key="index + 'iwf'" :style="{ top: item.top + 'px', left: item.left + 'px', width: width + 'px', height: item.height + 'px' }" class="img-box" @click.stop="selectItem(item, index)">
      <v-lazy-image v-if="!item.fail" class="img" @error="loadError(item)" :src="item.cover" />
      <div class="fail_img" v-else>{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import vLazyImage from 'v-lazy-image'
const NAME = 'img-water-fall'
// import api from '@/api/album'
const columnHeights = [] // 列的高度
const columnNums = 2 // 总共有多少列
const gap = 7 // 图片之间的间隔

export default {
  name: NAME,
  components: { vLazyImage },
  props: {
    listData: {
      type: Array,
      required: true,
    },
    // scroll: {
    //   default: true,
    // },
  },
  emits: ['select', 'load'],
  data() {
    return {
      width: 146, // 图片的宽度
      list: [],
      countHeight: 0,
    }
  },
  // async mounted() {

  // },
  watch: {
    listData() {
      columnHeights.length = 0
      const widthLimit = this.width * columnNums //  + gap * (columnNums - 1) // 每行宽度
      const cloneList = JSON.parse(JSON.stringify(this.listData))
      let lineWidth = 0
      let index = 0
      for (let i = 0; i < cloneList.length; i++) {
        const item = cloneList[i]
        const r = item.width / this.width
        item.height = item.height / r
        lineWidth += this.width
        if (lineWidth >= widthLimit) {
          index++
          item.left = this.width + gap
          item.top = columnHeights[index] + gap || 0
          columnHeights[index] = typeof columnHeights[index] === 'number' ? item.height + columnHeights[index] + gap : item.height
          // init
          lineWidth = 0
          index = 0
        } else {
          item.top = columnHeights[index] + gap || 0
          item.left = 0
          columnHeights[index] = typeof columnHeights[index] === 'number' ? item.height + columnHeights[index] + gap : item.height
        }
      }
      this.countHeight = Math.max(...columnHeights)
      this.list = cloneList
    },
  },
  methods: {
    load() {
      this.$emit('load')
    },
    selectItem(value, index) {
      this.$emit('select', value)
    },
    loadError(item) {
      item.fail = true
    },
  },
}
</script>

<style lang="less" scoped>
.fail_img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
}
.img-water-fall {
  position: relative;
  margin-left: 14px;
  .img-box {
    position: absolute !important;
    cursor: pointer;
    position: relative;
    background-size: cover;
    border-radius: 5px;
    border: 1px solid #e0e5ea;
    overflow: hidden;
    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .img-box:hover::before {
    content: ' ';
    background: rgba(0, 0, 0, 0.15);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
}
</style>
