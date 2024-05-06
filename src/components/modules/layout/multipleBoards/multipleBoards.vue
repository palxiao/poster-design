<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-11 17:27:58
 * @Description: 多画板操作界面
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-18 17:12:34
-->
<template>
  <div :style="{ position, bottom: -1 * st + 'px', left: sl + 'px' }" :class="['artboards', isFold ? 'fold' : 'unfold']">
    <div ref="listRef" class="wrap">
      <div v-if="isFold" v-show="dLayouts.length > 0" class="btn" @click="isFold = !isFold">画板 {{ index + 1 }}/{{ dLayouts.length }} <i class="icon sd-zhankai" /></div>
      <div class="list" v-else>
        <span @click="isFold = !isFold" class="icon-btn"><i class="icon sd-zhankai" /></span>
        <div v-for="(l, li) in dLayouts" :key="'l' + li" :style="{ width: getPW(l.global) + 'px' }" @click="selectPoster(li)" :class="['item-box', index == li ? 'item-select' : 'item-default']">
          <div
            class="mini-poster"
            :style="{
              transform: getTransform(l.global),
              width: l.global.width + 'px',
              height: l.global.height + 'px',
              backgroundColor: l.global.backgroundGradient ? undefined : l.global.backgroundColor,
              backgroundImage: l.global.backgroundImage ? `url(${l.global?.backgroundImage})` : l.global.backgroundGradient || undefined,
              backgroundSize: l.global.backgroundTransform?.x ? 'auto' : 'cover',
              backgroundPositionX: (l.global.backgroundTransform?.x || 0) + 'px',
              backgroundPositionY: (l.global.backgroundTransform?.y || 0) + 'px',
            }"
          >
            <component :is="layer.type + '-static'" v-for="layer in getlayers(l.layers)" :key="layer.uuid" :params="layer" :parent="l.global">
              <template v-if="layer.isContainer">
                <component :is="widget.type + '-static'" v-for="widget in getChilds(l.layers, layer.uuid)" :key="widget.uuid" :params="widget" :parent="layer" />
              </template>
            </component>
          </div>
          <div class="item-idx">{{ li + 1 }}</div>
          <i @click.stop="removePoster(li)" class="icon sd-quxiao" />
        </div>
        <div v-show="dLayouts.length < 9" @click="addLayer" class="item-add"><i class="iconfont icon-add" /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, nextTick, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useWidgetStore, useForceStore, useControlStore } from '@/store'
import { ElMessage } from 'element-plus'
import { log } from 'console';
const forceStore = useForceStore()
const canvasStore = useCanvasStore()
const widgetStore = useWidgetStore()
const controlStore = useControlStore()
const position: Ref = ref('absolute') // sticky
const isFold = ref(true)
const st = ref(0)
const sl = ref(0)
const listRef: Ref<HTMLElement | null> = ref(null)
const index = computed(() => canvasStore.dCurrentPage)
const { dZoom, dPage } = storeToRefs(canvasStore)
const { dWidgets, dLayouts } = storeToRefs(widgetStore)

watch(
  () => dZoom.value,
  (val) => {
    // 在画布缩放时bottom复位
    if(mainEl) mainEl.scrollTop = 0
  },
)

watch(
  () => isFold.value,
  (isFold) => {
    canvasStore.setBottomHeight(isFold ? 0 : 90)
    setTimeout(() => {
      forceStore.setZoomScreenChange()
    }, 300)
  },
)

let mainEl: any = null

onMounted(async () => {
  console.log(dLayouts);
  
  await nextTick()
  mainEl = document.getElementById('main')
  console.log(mainEl);
  
  mainEl.addEventListener('scroll', function (e: any) {
    st.value = mainEl.scrollTop
    sl.value = mainEl.scrollLeft
  })

  listRef.value?.addEventListener('wheel', (event) => {
    event.preventDefault()
    // 使用滚轮横向滚动
    listRef.value.scrollLeft += event.deltaY
  })
})

/** 计算变换量 */
function getTransform(global: any) {
  const { width, height } = global
  const isVertical = height > width
  const edge = isVertical ? Math.max(width, height) : Math.min(width, height)
  const s = 72 / edge
  const left = isVertical ? ((72 - width * s) / 2 - 1) / s : 0
  return `scale(${s}) translateX(${left}px)`
}
/** 计算实际宽度 */
function getPW(global: any) {
  const { width, height } = global
  const isVertical = height > width
  const s = 72 / Math.min(width, height)
  return isVertical ? 72 : width * s
}

function getlayers(widgets: any) {
  return widgets.filter((item: any) => item.parent === dPage.value.uuid)
}

function getChilds(widgets: any, uuid: string) {
  return widgets.filter((item: any) => item.parent === uuid)
}

function getInitPage() {
  const clonePage = JSON.parse(JSON.stringify(dPage.value))
  clonePage.backgroundColor = '#ffffffff'
  clonePage.backgroundGradient = ''
  clonePage.backgroundImage = ''
  return clonePage
}

function addLayer() {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  widgetStore.dLayouts.push({ global: getInitPage(), layers: [] })
  canvasStore.dCurrentPage = dLayouts.value.length - 1
  widgetStore.setDWidgets(widgetStore.getWidgets())
  canvasStore.setDPage(getInitPage())
  canvasStore.updateDPage()
  widgetStore.selectWidget({ uuid: '-1' })
}

function selectPoster(i: number) {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  canvasStore.dCurrentPage = i
  widgetStore.setDWidgets(widgetStore.getWidgets())
  canvasStore.setDPage(dLayouts.value[i].global)
  widgetStore.selectWidget({ uuid: '-1' })
}
function removePoster(removeIndex: number) {
  if (index.value === removeIndex) {
    // 当前画布下，清空画布内容而非删除
    widgetStore.dLayouts[removeIndex].layers.length = 0
    ElMessage('画布已清空')
    widgetStore.setDWidgets([]) // 清除画布图层
    // widgetStore.updateDWidgets()
    // widgetStore.dLayouts[removeIndex].global = getInitPage()
    canvasStore.setDPage(getInitPage()) // 初始化背景
    // canvasStore.updateDPage()
    // widgetStore.setDWidgets([])
  } else widgetStore.dLayouts.splice(removeIndex, 1)
}
</script>

<style lang="less" scoped>
.artboards {
  left: 0;
  z-index: 99;
  padding: 0 12px;
  font-size: 14px;
  color: #666666;
  font-weight: 600;
  transition: all 0.5s;
  .icon {
    transition: all 0.3s;
    color: #babec2;
  }
  .list {
    display: flex;
    align-items: center;
  }
  .item-box,
  .item-add {
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 5px;
    margin: 5px 0 0 14px;
    background: #f1f2f4;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.07);
  }
  .item-box:hover {
    .sd-quxiao {
      opacity: 1;
    }
  }
  .sd-quxiao,
  .item-idx {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
  }
  .item-idx {
    font-size: 12px;
    bottom: 2px;
    left: 2px;
    width: 17px;
    height: 17px;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.6);
  }
  .sd-quxiao {
    opacity: 0;
    font-size: 12px;
    padding: 1px 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    background-color: #ffffff;
    color: #666666;
    right: 1px;
    top: 1px;
  }
  .sd-quxiao:hover {
    transform: scale(1.2);
  }
  .item-add {
    cursor: pointer;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-add {
      font-size: 24px;
    }
  }
  .item-add:hover {
    filter: brightness(95%);
  }
  .item-default:hover {
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.4), 0px 4px 12px 0px rgba(0, 0, 0, 0.07);
  }
  .item-select {
    box-shadow: 0px 0px 2px 3px @main-color;
  }
  .item-box:first-of-type {
    margin-left: 0;
  }
  .item-box:first-child {
    margin-left: 0;
  }
}
.unfold {
  width: calc(100% - 155px);
  height: 90px;
  .wrap {
    padding: 10px 10px 10px 0;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow-x: scroll;
    overflow-y: hidden;
    border-radius: 12px;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
    .icon-btn {
      display: inline-block;
      cursor: pointer;
      width: 47px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sd-zhankai {
      font-size: 18px;
    }
    .sd-zhankai:hover {
      transform: scale(1.4);
    }
  }
}
.fold {
  cursor: pointer;
  width: 150px;
  text-align: center;
  height: 38px;
  margin-bottom: 10px;
  .wrap {
    display: flex;
    align-items: center;
    height: 100%;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
  }
  .icon {
    margin-left: 4px;
  }
  .btn {
    padding: 0 20px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .btn:hover > .sd-zhankai {
    transform: rotate(180deg);
  }
}

.mini-poster {
  overflow: hidden;
  position: absolute;
  transform-origin: 0 0;
}
</style>
