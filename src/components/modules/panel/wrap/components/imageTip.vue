<!--
 * @Author: ShawnPhang
 * @Date: 2023-10-04 19:12:40
 * @Description: 图片描述ToolTip
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-04 22:51:06
-->
<template>
  <el-tooltip :disabled="!detail.author" :offset="1" effect="light" placement="bottom-start" :hide-after="0" :enterable="false" raw-content>
    <template #content>
      <p style="max-width: 140px">
        <b>{{ detail.description }}</b>
      </p>
      <p>@{{ detail.author }}</p>
    </template>
    <slot />
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    detail: {},
  },
  setup() {
    return {}
  },
})
</script>
