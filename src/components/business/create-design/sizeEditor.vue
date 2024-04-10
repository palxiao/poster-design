<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-08 21:33:59
 * @Description: 尺寸编辑
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-09 15:55:33
-->
<template>
  <div class="position-size">
    <number-input v-model="params.width" label="宽" :maxValue="5000" />
    <el-tooltip :show-after="300" :hide-after="0" effect="dark" :content="lockRatio ? '锁定宽高比' : '自由改变'" placement="top">
      <i @click="changeRatio" :class="['icon', lockRatio ? 'sd-db' : 'sd-fdb']" />
    </el-tooltip>
    <number-input v-model="params.height" label="高" :maxValue="5000" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import numberInput from '@/components/modules/settings/numberInput.vue'

type TProps = {
  params: any
}
const props = withDefaults(defineProps<TProps>(), {
  params: {},
})

const lockRatio = ref(false) // 锁定比例缩放画布
let scale = 0,
  temp = { width: 0, height: 0 }

watch(
  () => props.params.width,
  (val, old) => {
    if (scale && isNumber(val) && isNumber(old)) {
      temp.width === 0 && (temp.width = props.params.width)
      setChange()
    }
  },
)
watch(
  () => props.params.height,
  (val, old) => {
    if (scale && isNumber(val) && isNumber(old)) {
      temp.height === 0 && (temp.height = props.params.height)
      setChange()
    }
  },
)

// 锁定宽高比
function changeRatio() {
  lockRatio.value = !lockRatio.value
  if (lockRatio.value) {
    scale = props.params.width / props.params.height
  } else scale = 0
}

// 应用更改
let timer: any = null
function setChange() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    temp.width > 0 && temp.height === 0 && (props.params.height = props.params.width / scale)
    temp.height > 0 && temp.width === 0 && (props.params.width = props.params.height * scale)
    if (temp.width > 0 && temp.height > 0) {
      temp = { width: 0, height: 0 }
    }
  }, 300)
}

function isNumber(val: any) {
  return typeof val === 'number'
}
</script>

<style lang="less" scoped>
.position-size {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  width: 100%;
  .number-input {
    flex: 0.2;
  }
  .icon {
    cursor: pointer;
    font-size: 19px;
  }
  .sd-fdb,
  .sd-db {
    color: #999999;
    margin: 0 6px 0 -4px;
  }
  .sd-db {
    color: #333333;
  }
}
</style>
