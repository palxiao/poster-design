<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:44:29
 * @Description: 数值滑块组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-16 09:46:23
-->
<template>
  <div id="number-slider">
    <span :style="{ width: labelWidth }" class="label">{{ label }}</span>
    <el-slider
      v-model="innerValue"
      :min="minValue" :max="maxValue" :step="step"
      input-size="small" 
      :show-input="showInput" :show-tooltip="false" :show-input-controls="false"
      @change="changeValue"
    /> 
  </div>
</template>

<script lang="ts" setup>
// const NAME = 'number-slider'
import { watch, ref, onMounted } from 'vue';
import { mapActions } from 'vuex'

type TProps = {
  label?: string
  labelWidth?: string
  modelValue?: number
  minValue?: number
  maxValue?: number
  step?: number
  showInput?: boolean
}

type TEmits = {
  (event: 'update:modelValue', data: number): void
  (event: 'finish', data: number | number[]): void
}

const props = withDefaults(defineProps<TProps>(), {
  label: '',
  labelWidth: '71px',
  modelValue: 0,
  minValue: 0,
  maxValue: 500,
  step: 1,
  showInput: true
})
const emit = defineEmits<TEmits>()

const innerValue = ref<number>(1)

watch(
  () => innerValue.value,
  (value) => {
    if (props.modelValue !== value) {
      emit('update:modelValue', value)
    }
  }
)

watch(
  () => props.modelValue,
  () => {
    innerValue.value = props.modelValue
  }
)

onMounted(() => {
  innerValue.value = props.modelValue
})

function changeValue(value: number | number[]) {
  emit('finish', value)
}
</script>

<style lang="less">
// style fix
.el-slider {
  width: 100%;
  .show-input {
    margin-right: 15px !important;
  }
  .el-slider__input {
    width: 50px !important;
    // .el-input-number__decrease {
    //   width: 16px !important;
    // }
    // .el-input-number__increase {
    //   width: 16px !important;
    // }
    .el-input--small {
      .el-input__wrapper {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  }
}
</style>

<style lang="less" scoped>
#number-slider {
  align-items: center;
  display: flex;
  .label {
    user-select: none;
    margin-right: 4px;
  }
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
