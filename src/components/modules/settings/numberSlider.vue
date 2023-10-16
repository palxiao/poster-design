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
    <el-slider v-model="innerValue" :min="minValue" :max="maxValue" :step="step" input-size="small" :show-input="showInput" :show-tooltip="false" :show-input-controls="false" @change="changeValue"> </el-slider>
  </div>
</template>

<script>
const NAME = 'number-slider'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  props: {
    label: {
      default: '',
    },
    labelWidth: {
      default: '71px',
    },
    modelValue: {
      default: 0,
    },
    minValue: {
      default: 0,
    },
    maxValue: {
      default: 500,
    },
    step: {
      default: 1,
    },
    showInput: {
      default: true,
    },
  },
  emits: ['update:modelValue', 'finish'],
  data() {
    return {
      innerValue: 0,
      // first: true,
    }
  },
  computed: {
    ...mapGetters([]),
  },
  watch: {
    innerValue(value) {
      if (this.modelValue !== value) {
        this.$emit('update:modelValue', value)
      }
    },
    modelValue(val) {
      this.innerValue = this.modelValue
    },
  },
  created() {
    this.innerValue = this.modelValue
  },
  methods: {
    ...mapActions([]),
    changeValue(value) {
      this.$emit('finish', value)
    },
  },
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
