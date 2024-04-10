<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-08 19:19:17
 * @Description: 水印组件封装
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-08 21:30:12
-->
<template>
  <slot v-if="isDrawPage" />
  <el-watermark v-else :style="props.customStyle" :gap="[140, 120]" :content="watermark">
    <slot />
  </el-watermark>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElWatermark } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useBaseStore } from '@/store'
import { useRoute } from 'vue-router'
const route = useRoute()

type TProps = {
  customStyle: any
}

const props = withDefaults(defineProps<TProps>(), {
  customStyle: {}
})

const isDrawPage = computed(() => route.name === 'Draw')
const baseStore = useBaseStore()
const { watermark } = storeToRefs(baseStore)
</script>
