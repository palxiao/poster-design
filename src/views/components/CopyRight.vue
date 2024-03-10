<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-25 15:19:02
 * @Description: 版权声明
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-08-08 10:09:59
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

const content = '本站为个人项目，所使用素材图片等均为网络收集而来，下载之作品仅供学习研究或欣赏目的而使用，无法提供商用授权哦。'
</script>

<style lang="less" scoped>
.text {
  color: #33383e;
  font-size: 14px;
}
</style>
