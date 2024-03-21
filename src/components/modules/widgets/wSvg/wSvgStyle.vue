<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:41:53
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-15 11:08:36
-->
<template>
  <div id="w-image-style">
    <el-collapse v-model="state.activeNames">
      <el-collapse-item title="位置尺寸" name="1">
        <div class="line-layout">
          <number-input v-model="state.innerElement.left" label="X" @finish="(value) => finish('left', value)" />
          <number-input v-model="state.innerElement.top" label="Y" @finish="(value) => finish('top', value)" />
          <number-input v-model="state.innerElement.width" style="margin-top: 0.5rem" label="宽" @finish="(value) => finish('width', value)" />
          <number-input v-model="state.innerElement.height" style="margin-top: 0.5rem" label="高" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="设置颜色" name="2">
        <div v-for="(c, ci) in state.innerElement.colors" :key="ci + 'c'">
          <color-select v-model="state.innerElement.colors[ci]" @finish="(value) => colorFinish('colors')" />
        </div>
        <br />
        <div class="slide-wrap">
          <number-slider v-model="state.innerElement.opacity" label="不透明" :step="0.01" :maxValue="1" @finish="(value) => finish('opacity', value)" />
        </div>
      </el-collapse-item>
      <br />
      <icon-item-select class="style-item" label="" :data="layerIconList" @finish="layerAction" />
      <icon-item-select :data="alignIconList" @finish="alignAction" />
      <br />
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
// 图片组件样式
// const NAME = 'w-image-style'
import { reactive, watch } from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
import numberInput from '../../settings/numberInput.vue'
import iconItemSelect, { TIconItemSelectData } from '../../settings/iconItemSelect.vue'
import numberSlider from '../../settings/numberSlider.vue'
import colorSelect from '../../settings/colorSelect.vue'
import layerIconList from '@/assets/data/LayerIconList'
import alignIconList from '@/assets/data/AlignListData'
import { TWSvgSetting, wSvgSetting } from './wSvgSetting'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'

type TState = {
  activeNames: string[]
  innerElement: TWSvgSetting
  tag: boolean
  ingoreKeys: string[]
  layerIconList: TIconItemSelectData[]
  alignIconList: TIconItemSelectData[]
}

const state = reactive<TState>({
  activeNames: ['2', '3', '4'],
  innerElement: JSON.parse(JSON.stringify(wSvgSetting)),
  tag: false,
  ingoreKeys: ['left', 'top', 'name', 'width', 'height', 'radiusTopLeft', 'radiusTopRight', 'radiusBottomLeft', 'radiusBottomRight'],
  layerIconList,
  alignIconList,
})
const store = useStore()
const {
  dActiveElement, dMoving
} = useSetupMapGetters(['dActiveElement', 'dMoving'])

// ...mapGetters(['dActiveElement', 'dMoving']),

watch(
  () => dActiveElement.value,
  () => {
    change()
  },
  { deep: true }
)

watch(
  () => state.innerElement,
  () => {
    changeValue()
  },
  { deep: true }
)

function created() {
  change()
}

created()

// ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex']),

function change() {
  state.tag = true
  state.innerElement = JSON.parse(JSON.stringify(dActiveElement.value))
}

function changeValue() {
  if (state.tag) {
    state.tag = false
    return
  }
  if (dMoving.value) {
    return
  }
  for (let key in state.innerElement) {
    const itemKey = key as keyof TWSvgSetting
    if (state.ingoreKeys.indexOf(itemKey) !== -1) {
      dActiveElement.value[key] = state.innerElement[itemKey]
    } else if (itemKey !== 'setting' && itemKey !== 'record' && state.innerElement[itemKey] !== dActiveElement.value[itemKey]) {
      store.dispatch("updateWidgetData", {
        uuid: dActiveElement.value.uuid,
        key: key,
        value: state.innerElement[itemKey],
      })
      // this.updateWidgetData({
      //   uuid: this.dActiveElement.uuid,
      //   key: key,
      //   value: this.innerElement[key],
      // })
    }
  }
}

function colorFinish(key: keyof TWSvgSetting) {
  finish(key, state.innerElement[key])
}

function finish(key: string, value: any) {
  store.dispatch("updateWidgetData", {
    uuid: dActiveElement.value.uuid,
    key: key,
    value: value,
    pushHistory: true,
  })
  // this.updateWidgetData({
  //   uuid: this.dActiveElement.uuid,
  //   key: key,
  //   value: value,
  //   pushHistory: true,
  // })
}

function layerAction(item: TIconItemSelectData) {
  store.dispatch("updateLayerIndex", {
    uuid: dActiveElement.value.uuid,
    value: item.value,
  })
  // this.updateLayerIndex({
  //   uuid: this.dActiveElement.uuid,
  //   value: item.value,
  // })
}

function alignAction(item: TIconItemSelectData) {
  store.dispatch("updateAlign", {
    align: item.value,
    uuid: dActiveElement.value.uuid,
  })
  // this.updateAlign({
  //   align: item.value,
  //   uuid: this.dActiveElement.uuid,
  // })
}
</script>

<style lang="less" scoped>
.slide-wrap {
  width: 100%;
  padding: 16px;
  background: #f3f5f7;
  border-radius: 6px;
}
#w-image-style {
  height: 100%;
  width: 100%;
}
.line-layout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.style-item {
  margin-bottom: 10px;
}
.setting-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.options {
  margin-bottom: 0.7rem;
}
</style>
