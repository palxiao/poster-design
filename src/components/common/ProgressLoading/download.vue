<!--
 * @Author: ShawnPhang
 * @Date: 2024-03-17 16:10:21
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-03 12:25:15
-->
<template>
  <div v-if="percent" v-show="!hide" class="mask">
    <div class="content">
      <div class="tool">
        <div v-show="percent < 100" class="backstage" @click="close"><iconSell width="18" /> <span style="margin-left: 0.4rem">后台下载</span></div>
        <iconClose v-show="percent >= 100" class="backstage" @click="cancel" width="20" />
      </div>
      <div class="text">{{ text }}</div>
      <el-progress style="width: 100%" :text-inside="true" :percentage="percent" />
      <div v-show="percent < 100" class="text btn" @click="cancel">{{ cancelText }}</div>
      <div class="text info">{{ msg }}</div>
      <div v-show="percent >= 100" class="success">
        <img src="https://store.palxp.cn/Celebration.png" alt="" srcset="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import { ElProgress } from 'element-plus'
import { Close as iconClose, Sell as iconSell } from '@element-plus/icons-vue'
import toolTip from '@/components/common/PopoverTip.vue'

type TProps = {
  percent: number
  text?: string
  cancelText?: string
  msg?: string
}

type TEmits = {
  (event: 'done'): void
  (event: 'cancel'): void
}

const props = withDefaults(defineProps<TProps>(), {
  percent: 0,
  text: '',
  cancelText: '',
  msg: '',
})

const hide = ref(false)

const emit = defineEmits<TEmits>()

watch(
  () => props.percent,
  (num) => {
    if (num >= 100) {
      // setTimeout(() => {
      //   emit('done')
      // }, 1000)
      hide.value = false
    }
  },
)

const cancel = () => {
  emit('cancel')
  hide.value = false
}

const close = () => {
  hide.value = true
}

defineExpose({
  cancel,
})
</script>

<style lang="less" scoped>
:deep(.el-progress-bar__innerText) {
  opacity: 0;
}
.mask {
  user-select: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 24%;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
}
.content {
  background: #ffffff;
  border-radius: 8px;
  padding: 2rem 4rem;
}
.text {
  margin: 2rem 0;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  color: #333333;
}
.btn {
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  color: #3771e5;
}
.info {
  font-weight: 400;
  font-size: 16px;
  color: #777777;
}
.tool {
  text-align: right;
  .backstage {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
  }
}
.success {
  display: flex;
  justify-content: center;
  img {
    width: 80%;
  }
}
</style>
