<!--
 * @Author: ShawnPhang
 * @Date: 2023-10-08 14:15:17
 * @Description: 手动抠图 - 修补擦除
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @Date: 2024-03-04 09:50:00
-->
<template>
  <div>
    <el-dialog v-model="state.show" align-center width="90%" @close="state.showMatting = false">
      <template #header>
        <div class="tool-wrap">
          <el-button type="primary" plain @click="done">确认应用</el-button>
          <el-radio-group v-model="state.isErasing" style="margin-left: 35px">
            <el-radio :value="false" size="large"> <b>修补画笔</b> <i class="icon sd-xiubu" /></el-radio>
            <el-radio :value="true" size="large"> <b>擦除画笔</b> <i class="icon sd-cachu" /></el-radio>
          </el-radio-group>
          <number-slider
            v-model="state.radius" class="slider-wrap"
            label="画笔尺寸" :showInput="false"
            labelWidth="90px" 
            :maxValue="state.constants?.RADIUS_SLIDER_MAX" :minValue="state.constants?.RADIUS_SLIDER_MIN" 
            :step="state.constants?.RADIUS_SLIDER_STEP"
          />
          <number-slider
            v-model="state.hardness" class="slider-wrap"
            label="画笔硬度" :showInput="false"
            labelWidth="90px" 
            :maxValue="state.constants?.HARDNESS_SLIDER_MAX" :minValue="state.constants?.HARDNESS_SLIDER_MIN"
            :step="state.constants?.HARDNESS_SLIDER_STEP"
          />
        </div>
      </template>
      <matting v-if="state.showMatting" :hasHeader="false" @register="mattingStart" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, nextTick, DefineComponent } from 'vue'
import matting, { MattingType } from '@palxp/image-extraction'
import { ElRadioGroup, ElRadio } from 'element-plus'
import numberSlider from '@/components/modules/settings/numberSlider.vue'

type TState = {
  show: boolean;
  showMatting: boolean;
  isErasing: boolean;
  radius: number | string;
  brushSize: string;
  hardness: number | string;
  hardnessText: string;
  constants: MattingType['constants'] | null;
}

type TParams = {
  raw: string
  result: string
}

type TCallback = ((base64: string) => void) | null

const props: TParams = {
  raw: '',
  result: ''
}

let callback: TCallback = null // 传回自动抠图的回调

const state = reactive<TState>({
  show: false,
  showMatting: false,
  isErasing: false,
  radius: 0, // 画笔尺寸
  brushSize: '', // 画笔尺寸：计算属性，显示值
  hardness: 0, // 画笔硬度
  hardnessText: '', // 画笔硬度：计算属性，显示值
  constants: null,
})

let mattingParam: MattingType | null

const mattingStart = (mattingOptions: MattingType) => {
  mattingOptions.initLoadImages(props.raw, props.result)
  state.isErasing = mattingOptions.isErasing
  state.radius = mattingOptions.radius
  state.hardness = mattingOptions.hardness
  state.constants = mattingOptions.constants
  mattingParam = mattingOptions
}

const open = async (raw: string, result: string, cb: TCallback) => {
  state.show = true
  props.raw = raw
  props.result = result
  await nextTick()
  setTimeout(() => {
    state.showMatting = true
  }, 300)
  callback = cb
}

defineExpose({
  open
})

const done = () => {
  state.show = false
  callback && callback(mattingParam?.getResult())
}

</script>
