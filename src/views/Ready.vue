<!--
 * @Author: ShawnPhang
 * @Date: 2021-07-13 02:48:38
 * @Description: 可用于放置一些权限校验逻辑，不通过时阻止router-view渲染
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-17 14:29:24
-->
<template>
  <router-view />
</template>

<script lang="ts">
import { onMounted, nextTick, getCurrentInstance, ComponentInternalInstance, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    onMounted(() => {
      // const { proxy } = getCurrentInstance() as ComponentInternalInstance
      // console.log(proxy?.$utils.isIOS())
    })
  },
  async created() {
    await nextTick()
    // console.log('Vue3 Setup 写法', this)
  },
})
</script>
