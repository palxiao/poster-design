<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:21:37
 * @Description: 组合设置
 * @LastEditors: xi_zi
 * @LastEditTime: 2024-04-03 15:44:34
-->
<template>
  <div id="w-group-style">
    <el-collapse v-model="state.activeNames">
      <el-collapse-item title="位置尺寸" name="1">
        <div class="line-layout">
          <number-input v-model="state.innerElement.left" label="X" @finish="(value) => finish('left', value)" />
          <number-input v-model="state.innerElement.top" label="Y" @finish="(value) => finish('top', value)" />
          <number-input v-model="state.innerElement.width" style="margin-top: 0.5rem" label="宽" @finish="(value) => finish('width', value)" />
          <number-input v-model="state.innerElement.height" style="margin-top: 0.5rem" label="高" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <!-- <el-button plain type="primary" class="block-btn" @click="store.dispatch('ungroup', state.innerElement.uuid)">取消组合</el-button> -->
        <div class="ungroup style-item" @click="widgetStore.ungroup(String(state.innerElement.uuid))">取消组合</div>
        <number-slider v-model="state.innerElement.opacity" class="style-item" label="不透明" :step="0.05" :maxValue="1" @finish="(value) => finish('opacity', value)" />
        <br />
        <icon-item-select class="style-item" label="" :data="layerIconList" @finish="layerAction" />
        <icon-item-select label="" :data="alignIconList" @finish="alignAction" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
// 组合组件样式
// const NAME = 'w-group-style'
import { reactive, watch } from 'vue'

import numberInput from '../../settings/numberInput.vue'
import iconItemSelect, { TIconItemSelectData } from '../../settings/iconItemSelect.vue'
import numberSlider from '../../settings/numberSlider.vue'
import layerIconList from '@/assets/data/LayerIconList'
import alignIconList from '@/assets/data/AlignListData'
import { wGroupSetting } from './groupSetting'
import { useWidgetStore } from '@/store'
import { storeToRefs } from 'pinia'
import { TUpdateWidgetPayload } from '@/store/design/widget/actions/widget'
import { TupdateLayerIndexData } from '@/store/design/widget/actions/layer'
import { TUpdateAlignData } from '@/store/design/widget/actions/align'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'

type TState = {
  activeNames: string[]
  // defaultValue: 0,
  innerElement: typeof wGroupSetting
  tag: boolean
  ingoreKeys: string[]
  layerIconList: TIconItemSelectData[]
  alignIconList: TIconItemSelectData[]
}

const state = reactive<TState>({
  activeNames: ['1', '2', '3', '4'],
  // defaultValue: 0,
  innerElement: JSON.parse(JSON.stringify(wGroupSetting)),
  tag: false,
  ingoreKeys: ['name', 'width', 'height'],
  layerIconList,
  alignIconList,
})

const widgetStore = useWidgetStore()
// const { dActiveElement } = useSetupMapGetters(['dActiveElement'])
const { dActiveElement } = storeToRefs(widgetStore)

let dMoving = false

// computed: {
//   ...mapGetters(['dActiveElement']),
// },

watch(
  () => dActiveElement.value,
  (newValue, oldValue) => {
    change()
  },
  { deep: true },
)

watch(
  () => state.innerElement,
  (newValue, oldValue) => {
    changeValue()
  },
  { deep: true },
)

function created() {
  change()
}

created()

// ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex', 'ungroup']),

function change() {
  state.tag = true
  state.innerElement = JSON.parse(JSON.stringify(dActiveElement.value))
}

function changeValue() {
  if (state.tag) {
    state.tag = false
    return
  }
  if (dMoving) {
    return
  }
  for (let key in state.innerElement) {
    const itemKey = key as keyof typeof wGroupSetting
    if (state.ingoreKeys.indexOf(itemKey) !== -1) {
      ;(dActiveElement.value as Record<string, any>)[itemKey] = state.innerElement[itemKey]
    } else if (key !== 'setting' && key !== 'record' && state.innerElement[itemKey] !== (dActiveElement.value as Record<string, any>)[itemKey]) {
      widgetStore.updateWidgetData({
        uuid: dActiveElement.value?.uuid || '',
        key: key as TUpdateWidgetPayload['key'],
        value: state.innerElement[itemKey] as TUpdateWidgetPayload['value'],
      })
      // store.dispatch("updateWidgetData", {
      //   uuid: dActiveElement.value?.uuid,
      //   key: key,
      //   value: state.innerElement[itemKey],
      // })
    }
  }
}

function finish(key: string, value: string | number | number[]) {
  widgetStore.updateWidgetData({
    uuid: dActiveElement.value?.uuid || '',
    key: key as TUpdateWidgetPayload['key'],
    value: value as TUpdateWidgetPayload['value'],
    pushHistory: true,
  })
  // store.dispatch("updateWidgetData", {
  //   uuid: dActiveElement.value.uuid,
  //   key: key,
  //   value: value,
  //   pushHistory: true,
  // })
}

function layerAction(item: TIconItemSelectData) {
  widgetStore.updateLayerIndex({
    uuid: dActiveElement.value?.uuid || '',
    value: item.value as TupdateLayerIndexData['value'],
    isGroup: true,
  })
  // store.dispatch("updateLayerIndex", {
  //   uuid: dActiveElement.value.uuid,
  //   value: item.value,
  //   isGroup: true,
  // })
}

function alignAction(item: TIconItemSelectData) {
  widgetStore.updateAlign({
    align: item.value as TUpdateAlignData['align'],
    uuid: dActiveElement.value?.uuid || '',
  })
  // store.dispatch("updateAlign", {
  //   align: item.value,
  //   uuid: dActiveElement.value.uuid,
  // })
}
</script>

<style lang="less" scoped>
#w-group-style {
  height: 100%;
  width: 100%;
}
// .position-size {
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
// }
.line-layout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.select {
  margin-bottom: 10px;
}
.ungroup {
  background-color: #3b74f1;
  color: #ffffff;
  cursor: pointer;
  margin: 10px;
  padding: 5px;
  text-align: center;
  &:hover {
    background-color: #4f82f2;
  }
}
.block-btn {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
