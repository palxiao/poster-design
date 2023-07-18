<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-25 15:19:02
 * @Description: 版权声明
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-06 16:48:12
-->
<template>
  <tool-tip title="免责声明" :width="340" :content="content">
    <div>
      <slot />
    </div>
  </tool-tip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import toolTip from '@/components/common/PopoverTip.vue'

export default defineComponent({
  components: { toolTip },
  setup() {
    const content = '本站为个人项目，素材资源均来源于网络，不提供任何版权保障，下载之作品仅供学习研究或欣赏目的而使用，请于24h内自行删除。'
    return {
      content,
    }
  },
})
</script>

<style lang="less" scoped>
.text {
  color: #33383e;
  font-size: 14px;
}
</style>
