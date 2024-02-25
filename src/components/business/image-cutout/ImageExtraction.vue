<!--
 * @Author: ShawnPhang
 * @Date: 2023-10-08 14:15:17
 * @Description: 手动抠图 - 修补擦除
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-09 01:28:11
-->
<template>
  <div>
    <el-dialog v-model="show" align-center width="90%" @close="showMatting = false">
      <template #header>
        <div class="tool-wrap">
          <el-button type="primary" plain @click="done">确认应用</el-button>
          <el-radio-group v-model="isErasing" style="margin-left: 35px">
            <el-radio :label="false" size="large"> <b>修补画笔</b> <i class="icon sd-xiubu" /></el-radio>
            <el-radio :label="true" size="large"> <b>擦除画笔</b> <i class="icon sd-cachu" /></el-radio>
          </el-radio-group>
          <number-slider v-model="radius" class="slider-wrap" label="画笔尺寸" :showInput="false" labelWidth="90px" :maxValue="constants.RADIUS_SLIDER_MAX" :minValue="constants.RADIUS_SLIDER_MIN" :step="constants.RADIUS_SLIDER_STEP" />
          <number-slider v-model="hardness" class="slider-wrap" label="画笔硬度" :showInput="false" labelWidth="90px" :maxValue="constants.HARDNESS_SLIDER_MAX" :minValue="constants.HARDNESS_SLIDER_MIN" :step="constants.HARDNESS_SLIDER_STEP" />
        </div>
      </template>
      <matting v-if="showMatting" :hasHeader="false" @register="mattingStart" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, nextTick } from 'vue'
import matting, { MattingType } from '@palxp/image-extraction'
import { ElRadioGroup, ElRadio } from 'element-plus'
import numberSlider from '@/components/modules/settings/numberSlider.vue'

export default defineComponent({
  components: { matting, ElRadioGroup, ElRadio, numberSlider },
  setup() {
    const state: any = reactive({
      show: false,
      showMatting: false,
      isErasing: false,
      radius: 0, // 画笔尺寸
      brushSize: '', // 画笔尺寸：计算属性，显示值
      hardness: 0, // 画笔硬度
      hardnessText: '', // 画笔硬度：计算属性，显示值
      constants: {},
    })

    const params: any = { raw: '', result: '' }
    let matting: MattingType | any = {}
    let callback: any = null // 传回自动抠图的回调

    const mattingStart: any = (mattingOptions: MattingType) => {
      mattingOptions.initLoadImages(params.raw, params.result)
      state.isErasing = mattingOptions.isErasing
      state.radius = mattingOptions.radius
      state.hardness = mattingOptions.hardness
      state.constants = mattingOptions.constants
      matting = mattingOptions
    }

    const open = async (raw: any, result: any, cb: any) => {
      state.show = true
      params.raw = raw
      params.result = result
      await nextTick()
      setTimeout(() => {
        state.showMatting = true
      }, 300)
      callback = cb
    }

    const done = () => {
      state.show = false
      callback(matting.getResult())
    }

    return {
      ...toRefs(state),
      open,
      done,
      mattingStart,
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding: 0 !important;
}
:deep(.el-dialog__header) {
  padding: 10px 35px;
  // var(--el-dialog-padding-primary)
}
.tool-wrap {
  display: flex;
  align-items: center;
}
// .tool-left {
//   display: inline-flex;
//   flex: 1;
// }
.slider-wrap {
  margin-left: 35px;
  width: 240px;
}
</style>
