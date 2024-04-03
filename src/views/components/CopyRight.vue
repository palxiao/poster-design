<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-25 15:19:02
 * @Description: 版权声明
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-03 10:55:43
-->
<template>
  <tool-tip title="免责声明" :width="340" :content="content">
    <div>
      <slot />
    </div>
  </tool-tip>
</template>

<script lang="ts" setup>
import toolTip from '@/components/common/PopoverTip.vue'

const content = '本站为个人项目，所使用图片等素材均为网络搜集而来，下载作品仅供学习、研究或欣赏用途，暂不提供商用授权。'
</script>

<style lang="less" scoped>
.text {
  color: #33383e;
  font-size: 14px;
}
</style>
