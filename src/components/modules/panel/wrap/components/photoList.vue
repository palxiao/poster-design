<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-23 15:48:52
 * @Description: 图片列表组件 Bookshelf Layout 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-06 21:16:00
-->
<template>
  <ul ref="listRef" class="img-list-wrap" :style="{ paddingBottom: props.isShort ? '15px' : '200px' }" @scroll="scrollEvent($event)">
    <div class="list">
      <div
        v-for="(item, i) in state.list" :key="i + 'i'"
        :style="{ width: item.listWidth + 'px', marginRight: item.gap + 'px', cursor: canDrag ? 'grab' : 'pointer' }"
        class="list__img" draggable="false"
        @mousedown="dragStart($event, i)"
        @mousemove="mousemove"
        @mouseup="mouseup"
        @click.stop="select(i)"
      >
        <edit-model v-if="props.edit" :options="props.edit" :data="{ item, i }">
          <div v-if="item.isDelect" class="list__mask">已删除</div>
          <el-image class="img transparent-bg" :src="item.thumb || item.url" :style="{ height: getInnerHeight(item) + 'px' }" lazy loading="lazy" />
        </edit-model>
        <template v-else>
          <imageTip :detail="item">
            <el-image class="img" :src="item.thumb || item.url" :style="{ height: getInnerHeight(item) + 'px' }" lazy loading="lazy">
              <template #placeholder>
                <div :style="{ backgroundColor: item.color }" class="image-color" />
              </template>
            </el-image>
          </imageTip>
        </template>
      </div>
    </div>
    <div v-if="!props.isDone" v-show="state.loading" class="loading"><i class="el-icon-loading" /> 拼命加载中</div>
    <div v-else class="loading">全部加载完毕</div>
  </ul>
</template>

<script lang="ts" setup>
import { reactive, watch, nextTick, ref } from 'vue'
import DragHelper from '@/common/hooks/dragHelper'
import setImageData, { TItem2DataParam } from '@/common/methods/DesignFeatures/setImage'
import { IGetTempListData } from '@/api/home';

type TProps = {
  listData: IGetTempListData[]
  edit?: Record<string, any>
  isDone?: boolean
  isShort?: boolean
  canDrag?: boolean
}

type TEmits = {
  (event: 'load'): void
  (event: 'select', data: number): void
  (event: 'drag', data: number): void
}

type TState = {
  loading: boolean
  list: IGetTempListData[]
}

const props = withDefaults(defineProps<TProps>(), {
  isShort: false,
  canDrag: true,
  listData: () => ([])
})
const emit = defineEmits<TEmits>()
const listRef = ref<HTMLElement | null>(null)
const state = reactive<TState>({
  loading: true,
  list: [],
})

const dragHelper = new DragHelper()
let isDrag = false
let startPoint = { x: 99999, y: 99999 }

const mouseup = (e: MouseEvent) => {
  e.preventDefault()
  setTimeout(() => {
    isDrag = false
    startPoint = { x: 99999, y: 99999 }
  }, 10)
}

const mousemove = (e: MouseEvent) => {
  e.preventDefault()
  if (e.x - startPoint.x > 2 || e.y - startPoint.y > 2) {
    isDrag = true
  }
}

watch(
  () => props.listData,
  async (newList: IGetTempListData[], oldList: IGetTempListData[]) => {
    !oldList && (oldList = [])
    if (newList.length <= 0) {
      state.list.length = 0
      return
    }
    let list = newList.filter((v: IGetTempListData) => !newList.includes(v) || !oldList.includes(v)) // difference
    list = JSON.parse(JSON.stringify(list))
    const marginRight = 6 // 间距
    const limitWidth = (await getFatherWidth()) - marginRight
    const standardHeight = 280 // 高度阈值
    const neatArr: IGetTempListData[][] = [] // 整理后的数组
    function factory(cutArr: IGetTempListData[]) {
      return new Promise<{ height: number, list: IGetTempListData[] }>((resolve) => {
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
    function calculate(cutArr: IGetTempListData[]) {
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
      const { list: newList, height } = await factory([(list.shift() as IGetTempListData)])
      neatArr.push(
        newList.map((x: IGetTempListData, index: number) => {
          x.listWidth = (x.width / x.height) * height
          x.gap = index !== newList.length - 1 ? marginRight : 0
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
  if (!listRef.value) return 0
  const father = listRef.value.parentElement ?? listRef.value.parentNode
  if (!father) return 0
  return (father as HTMLElement).offsetWidth
}

function getRef() {
  // 用于在组件外调用内部ref
  return listRef
}

const load = () => {
  state.loading = true
  emit('load')
}
const select = (i: number) => {
  !isDrag && !state.list[i].isDelect && emit('select', i)
}

const dragStart = async (e: Event | any, i: number) => {
  e.preventDefault()
  if (!props.canDrag) {
    return
  }
  startPoint = { x: e.x, y: e.y }
  if (!state.list[i].isDelect) {
    const setImageParams: TItem2DataParam = {
      width: state.list[i].width,
      height: state.list[i].height,
      url: state.list[i].url || '',
      model: state.list[i].model
    }
    const img = await setImageData(setImageParams)
    dragHelper.start(e, img.canvasWidth)
    emit('drag', i)
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

const getInnerHeight = ({ height, listWidth, width }: any) => (height * listWidth) / width

defineExpose({
  load,
  dragStart,
  select,
  delItem,
  scrollEvent,
  getRef,
  mouseup,
  mousemove,
  getInnerHeight,
})
</script>

<style lang="less" scoped>
.img-list-wrap {
  height: 100%;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.img-list-wrap::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.img {
  transform-origin: center;
  display: block;
  width: 100%;
  height: 100%;
}
.image-color {
  width: 100%;
  height: 100%;
  animation: breathe 600ms ease-out infinite alternate;
}
.list {
  position: relative;
  // padding: 4px 0 0 14px;
  padding: 4px 0 0 0;
  &__img {
    // background: #f1f2f4;
    display: inline-block;
    // margin: 0 6px 2px 0;
    margin-bottom: 3px;
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
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
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
/* 呼吸效果 */
@keyframes breathe {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
