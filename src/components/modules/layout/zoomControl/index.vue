<!--
 * @Author: ShawnPhang
 * @Date: 2024-06-20 15:01:39
 * @Description: 缩放画板
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2025-03-24 14:47:12
-->
<template>
  <div id="zoom-control">
    <ul v-show="show" class="zoom-selecter">
      <li v-for="(item, index) in zoomList" :key="index" :class="['zoom-item', { 'zoom-item-active': activezoomIndex === index }]" @click.stop="selectItem(index)">
        <!-- <i v-if="item.icon" :class="['iconfont', item.icon]"></i> -->
        <span>{{ item.text }}</span>
        <i v-if="activezoomIndex === index" class="iconfont icon-selected"></i>
      </li>
    </ul>
    <div v-if="!hideControl" class="zoom-control-wrap">
      <div :class="['zoom-icon radius-left', { disable: activezoomIndex === 0 }]" @click.stop="activezoomIndex > 0 ? sub() : ''">
        <i class="iconfont icon-sub"></i>
      </div>
      <div :class="['zoom-text', { 'zoom-text-active': show }]" @click.stop="show = !show">{{ zoom.text }}</div>
      <div :class="['zoom-icon radius-right', { disable: otherIndex === otherList.length - 1 }]" @click.stop="otherIndex < otherList.length - 1 ? add() : ''">
        <i class="iconfont icon-add"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import addMouseWheel from '@/common/methods/addMouseWheel'
import { OtherList, TZoomData, ZoomList } from './data';
// import { useSetupMapGetters } from '@/common/hooks/mapGetters';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCanvasStore, useForceStore } from '@/store';
import { findClosestNumber } from '@/utils/utils';

const route = useRoute()

// 组件大小控制器
let holder: number | undefined

const hideControl = ref(false)
const activezoomIndex = ref(0)
const zoomList = ref<TZoomData[]>(ZoomList)
const show = ref(false)
const zoom = ref<TZoomData>({
  value: 0,
  text: '',
})
const otherList = ref<TZoomData[]>(OtherList)
const otherIndex = ref(-1)
const bestZoom = ref(0)
const curAction = ref('')

// const { zoomScreenChange } = useSetupMapGetters(['zoomScreenChange'])
const canvasStore = useCanvasStore()
const { dPage } = storeToRefs(useCanvasStore())
const { zoomScreenChange } = storeToRefs(useForceStore())
const { dZoom, dScreen } = storeToRefs(canvasStore)
const presetPadding = canvasStore.dPresetPadding

watch(
  activezoomIndex,
  (data) => {
    if (data < 0 || data > zoomList.value.length - 1) {
      return
    }
    zoom.value = JSON.parse(JSON.stringify(zoomList.value[data]))
  }
)

watch(
  otherIndex,
  (data) => {
    if (data < 0 || data > otherList.value.length - 1) {
      return
    }
    zoom.value = JSON.parse(JSON.stringify(otherList.value[data]))
  }
)

watch(
  zoom,
  (data) => {
    let realValue = data.value
    if (realValue === -1) {
      realValue = calcZoom()
    }
    canvasStore.updateZoom(realValue)
    autoFixTop()
  }
)

watch(
  dScreen,
  () => {
    screenChange()
  },
  { deep: true, }
)

watch(
  zoomScreenChange,
  () => {
    activezoomIndex.value = zoomList.value.length - 1
    screenChange()
  }
)

watch(
  dPage,
  () => {
    screenChange()
  },
  { deep: true }
)

onMounted(async () => {
  await nextTick()
  window.addEventListener('click', close)
  if (route.path === '/draw') {
    activezoomIndex.value = 3
    hideControl.value = true
  } else {
    activezoomIndex.value = zoomList.value.length - 1
  }
  // 添加滚轮监听
  addMouseWheel('page-design', (isDown: boolean) => {
    mousewheelZoom(isDown)
  })
  // 添加窗口大小监听
  window.addEventListener('resize', (event) => {
    changeScreen()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('click', close)
})

    // ...mapActions(['updateZoom', 'updateScreen']),
function changeScreen() {
  clearTimeout(holder)
  holder = setTimeout(() => {
    const screen = document.getElementById('page-design')
    if (!screen) return
    canvasStore.updateScreen({
      width: screen.offsetWidth,
      height: screen.offsetHeight,
    })
  }, 300)
}

function screenChange() {
  // 弹性尺寸即时修改
  if (activezoomIndex.value === zoomList.value.length - 1) {
    canvasStore.updateZoom(calcZoom())
    autoFixTop()
  }
}

function selectItem(index: number) {
  activezoomIndex.value = index
  otherIndex.value = -1
  show.value = false
}

function close(_: MouseEvent) {
  show.value = false
}

function add() {
  curAction.value = 'add'
  show.value = false
  if (
    activezoomIndex.value === zoomList.value.length - 2 ||
    activezoomIndex.value === zoomList.value.length - 1
  ) {
    activezoomIndex.value = zoomList.value.length
    // this.otherIndex += 1
    if (bestZoom.value) {
      nearZoom(true)
    } else {
      otherIndex.value += 1
    }
    return
  }
  if (activezoomIndex.value != zoomList.value.length) {
    activezoomIndex.value++
    return
  }
  if (otherIndex.value < otherList.value.length - 1) {
    otherIndex.value++
  }
}

function sub() {
  curAction.value = ''
  show.value = false
  if (otherIndex.value === 0) {
    otherIndex.value = -1
    activezoomIndex.value = zoomList.value.length - 2
    return
  }
  if (otherIndex.value != -1) {
    otherIndex.value--
    return
  }
  if (activezoomIndex.value === zoomList.value.length - 1) {
    if (bestZoom) {
      nearZoom()
    } else {
      activezoomIndex.value = zoomList.value.length - 2
    }
    return
  }
  if (activezoomIndex.value != 0) {
    activezoomIndex.value--
  }
}

function mousewheelZoom(down: boolean) {
  const value = Number(dZoom.value.toFixed(0))
  if (down && value <= 1) return
  canvasStore.updateZoom(down ? value - 2 : value + 2)
  zoom.value.text = (value + '%') as any
  zoom.value.value = value
  autoFixTop()
  const closest = findClosestNumber(value, zoomList.value.map(x => x.value))
  activezoomIndex.value = zoomList.value.findIndex(x => x.value === closest)
}

function nearZoom(add?: boolean) {
  for (let i = 0; i < zoomList.value.length; i++) {
    activezoomIndex.value = i
    if (zoomList.value[i].value > bestZoom.value) {
      if (add) break
    } else if (zoomList.value[i].value < bestZoom.value) {
      if (!add) break
    }
  }
  bestZoom.value = 0
}

function calcZoom() {
  // let widthZoom = ((dScreen.value.width - 142) * 100) / dPage.value.width
  // let heightZoom = ((dScreen.value.height - 122) * 100) / dPage.value.height
  const diffHeight = presetPadding * 2 + 2 + canvasStore.dBottomHeight
  const diffWidth = presetPadding * 2 + 22
  let widthZoom = ((dScreen.value.width - diffWidth) * 100) / dPage.value.width
  let heightZoom = ((dScreen.value.height - diffHeight) * 100) / dPage.value.height
  bestZoom.value = Math.min(widthZoom, heightZoom)
  return bestZoom.value
}

async function autoFixTop() {
  await nextTick()
  const el = document.getElementById('out-page')
  if (!el) return
  const headerBarHeight = 54
  const clientHeight = window.innerHeight - headerBarHeight - canvasStore.dBottomHeight
  // const parentHeight = (el.offsetParent as HTMLElement).offsetHeight - 54
  let padding = (clientHeight - el.offsetHeight) / 2
  if (typeof curAction.value === 'undefined') {
    padding += presetPadding / 2
  }
  curAction.value === 'add' && (padding -= presetPadding)
  canvasStore.updatePaddingTop(padding > 0 ? padding : 0)
}

defineExpose({
  screenChange,
  add,
  sub
})

</script>

<style lang="less" scoped>
@color-select: #1b1634;
@color1: #ffffff; // 选项板背景
@color2: #ffffff;
@color3: #666666; // 文字主颜色
@color4: #c2c2c2; // 禁用
@color5: rgba(0, 0, 0, 0.12); // 高亮选项背景
@z-border-color: #e6e6e6;

#zoom-control {
  bottom: 10px;
  position: absolute;
  right: 292px;
  z-index: 1000;
  .zoom-control-wrap {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    height: 38px;
    .radius-left {
      border-bottom-left-radius: 6px;
      border-top-left-radius: 6px;
      border-block-end: 1px solid @z-border-color;
      border-block-start: 1px solid @z-border-color;
      border-left: 1px solid @z-border-color;
    }
    .radius-right {
      border-bottom-right-radius: 6px;
      border-top-right-radius: 6px;
      border-block-end: 1px solid @z-border-color;
      border-block-start: 1px solid @z-border-color;
      border-right: 1px solid @z-border-color;
    }
    .zoom-icon {
      align-items: center;
      background-color: @color2;
      color: @color3;
      cursor: pointer;
      display: flex;
      justify-content: center;
      width: 40px;
      &:hover {
        background-color: @color1;
        color: @color-select;
      }
    }
    .disable {
      color: @color4;
      &:hover {
        background-color: @color2;
        color: @color4;
        cursor: not-allowed;
      }
    }
    .zoom-text {
      user-select: none;
      align-items: center;
      background-color: @color2;
      color: @color3;
      cursor: pointer;
      display: flex;
      justify-content: center;
      width: 60px;
      border-block-end: 1px solid @z-border-color;
      border-block-start: 1px solid @z-border-color;
      &:hover {
        background-color: @color1;
        color: @color-select;
      }
    }
  }
  .zoom-selecter {
    background-color: @color1;
    color: @color3;
    position: absolute;
    top: -8px;
    transform: translateY(-100%);
    width: 100%;
    z-index: 1000;
    &:after {
      bottom: -8px;
      content: '';
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }
    .zoom-item {
      align-items: center;
      cursor: pointer;
      display: flex;
      font-size: 14px;
      height: 34px;
      padding: 10px;
      width: 100%;
      i {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
      span {
        flex: 1;
      }
      &:hover {
        background-color: @color5;
        color: @color-select;
      }
    }
  }
}
</style>
