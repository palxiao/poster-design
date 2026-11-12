<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-08 16:50:04
 * @Description: 画布加水印
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2026-09-02 12:50:17
-->
<template>
  <!-- <el-switch v-model="wmBollean" @change="wmChange" size="large" inline-prompt style="--el-switch-off-color: #9999999e" active-text="移除水印" inactive-text="官方水印" /> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBaseStore } from '@/store'

const baseStore = useBaseStore()
const wmBollean = ref(true)

function wmChange(isRemove: string | number | boolean) {
  baseStore.changeWatermark(isRemove ? '' : ['TinixPoster', 'poster-design'])
}
</script>
