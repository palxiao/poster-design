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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      default: '',
    },
    width: {
      default: 0,
    },
    content: {
      default: '',
    },
    // top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    position: {
      default: 'bottom',
    },
    // offset: {
    //   default: 0,
    // },
  },
  setup() {},
})
</script>
