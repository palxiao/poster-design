<template>
  <div id="app-view">
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useI18n } from 'vue-i18n'
import { getBrowserLang } from './languages'

const lang = getBrowserLang()

const i18n = useI18n()
onMounted(() => {
  i18n.locale.value = lang
})

// 配置语言,否则element默认是英语
const locale = computed(() => {
  return lang == 'zh' ? zhCn : en
})
</script>

<style lang="less">
#app-view {
  min-width: 1180px;
}
</style>
