<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-23 15:48:52
 * @Description: 图片列表组件 Bookshelf Layout 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-04 00:20:31
-->
<template>
  <ul ref="listRef" class="img-list-wrap" style="overflow: auto" @scroll="scrollEvent($event)">
    <div class="list">
      <div v-for="(item, i) in list" :key="i + 'i'" :style="{ width: item.listWidth + 'px' }" class="list__img transparent-bg" draggable="false" @mousedown="dragStart($event, i)" @mousemove="mousemove" @mouseup="mouseup" @click.stop="select(i)" @dragstart="dragStart($event, i)">
        <edit-model v-if="edit" :options="edit" :data="{ item, i }">
          <div v-if="item.isDelect" class="list__mask">已删除</div>
          <!-- <img class="img" :src="item.thumb || item.cover || item.url" /> -->
          <el-image class="img" :src="item.thumb || item.url" lazy loading="lazy" />
        </edit-model>
        <template v-else>
          <el-image class="img" :src="item.thumb || item.url" lazy loading="lazy" />
        </template>
      </div>
    </div>
    <div v-if="!isDone" v-show="loading" class="loading"><i class="el-icon-loading" /> 拼命加载中</div>
    <div v-else class="loading">全部加载完毕</div>
  </ul>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch, nextTick } from 'vue'
import DragHelper from '@/common/hooks/dragHelper'
import setImageData from '@/common/methods/DesignFeatures/setImage'

export default defineComponent({
  props: {
    listData: {},
    edit: {},
    isDone: {},
  },
  emits: ['load', 'drag', 'select'],
  setup(props, context) {
    const state: any = reactive({
      loading: true,
      list: [],
      listRef: null,
    })

    const dragHelper = new DragHelper()
    let isDrag = false
    let startPoint = { x: 99999, y: 99999 }
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

    watch(
      () => props.listData,
      async (newList: any, oldList: any) => {
        if (newList.length <= 0) {
          state.list.length = 0
          return
        }
        let list = newList.filter((v: any) => !newList.includes(v) || !oldList.includes(v)) // difference
        list = JSON.parse(JSON.stringify(list))
        const limitWidth = (await getFatherWidth()) - 32 //  296 // 256
        const marginRight = 6 // 间距
        const standardHeight = 280 // 高度阈值
        const neatArr: any = [] // 整理后的数组
        function factory(cutArr: any) {
          return new Promise((resolve) => {
            const lineup = list.shift()
            if (!lineup) {
              resolve({ height: calculate(cutArr), list: cutArr })
              return
            }
            cutArr.push(lineup)
            const finalHeight = calculate(cutArr)
            if (finalHeight > standardHeight) {
              resolve(factory(cutArr))
            } else {
              resolve({ height: finalHeight, list: cutArr })
            }
          })
        }
        function calculate(cutArr: any) {
          let cumulate = 0
          for (const iterator of cutArr) {
            const { width, height } = iterator
            cumulate += width / height
          }
          return (limitWidth - marginRight * (cutArr.length - 1)) / cumulate
        }
        async function handleList() {
          if (list.length <= 0) {
            return
          }
          const { list: newList, height }: any = await factory([list.shift()])
          neatArr.push(
            newList.map((x: any) => {
              x.listWidth = (x.width / x.height) * height
              return x
            }),
          )
          if (list.length > 0) {
            await handleList()
          }
        }
        await handleList()
        state.list = state.list.concat(neatArr.flat(1))
        state.loading = false
      },
    )

    async function getFatherWidth() {
      await nextTick()
      const dom = state.listRef
      const father = dom.parentElement || dom.parentNode
      return father.offsetWidth
    }

    function getRef() {
      return state.listRef
    }

    const load = () => {
      state.loading = true
      context.emit('load')
    }
    const select = (i: number) => {
      !isDrag && !state.list[i].isDelect && context.emit('select', i)
    }
    const dragStart = async (e: Event | any, i: number) => {
      e.preventDefault()
      startPoint = { x: e.x, y: e.y }
      if (!state.list[i].isDelect) {
        const img = await setImageData(state.list[i])
        dragHelper.start(e, img.canvasWidth)
        context.emit('drag', i)
      }
    }
    function delItem(i: number) {
      state.list[i].isDelect = true
    }

    const scrollEvent = (e: any) => {
      if (e.target.scrollTop + e.target.offsetHeight + 200 >= e.target.scrollHeight) {
        load()
      }
    }
    return {
      load,
      dragStart,
      select,
      ...toRefs(state),
      delItem,
      scrollEvent,
      getRef,
      mouseup,
      mousemove,
    }
  },
})
</script>

<style lang="less" scoped>
.img-list-wrap {
  height: 100%;
  margin-top: 14px;
  // overflow-y: scroll;
  padding-bottom: 200px;
}
.img {
  transform-origin: center;
  display: block;
  width: 100%;
  height: 100%;
}
.list {
  position: relative;
  padding: 4px 0 0 14px;
  &__img {
    // background: #f1f2f4;
    display: inline-block;
    cursor: pointer;
    margin: 0 6px 2px 0;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  &__img:active {
    cursor: grabbing;
  }
  &__img:hover {
    filter: brightness(90%);
  }
  &__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
