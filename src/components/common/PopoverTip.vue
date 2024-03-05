<!--
 * @Author: ShawnPhang
 * @Date: 2022-04-10 12:12:57
 * @Description: tooltip提示
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-10 12:42:02
-->
<template>
  <el-popover ref="popover" :placement="position" :title="title" :width="width" trigger="hover" :content="content">
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

type TProps = {
  title: string
  width: number
  content: string
  position: "bottom" | "auto" | "auto-start" | "auto-end" | "top" | "right" | "left" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end"
  offset?: number
}

const { title, width, content, position } = withDefaults(defineProps<TProps>(), {
  title: '',
  width: 0,
  content: '',
  position: 'bottom'
})
</script>
