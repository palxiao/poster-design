<template>
  <div id="app-view">
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import vi from 'element-plus/es/locale/lang/vi'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

// Element Plus mặc định là tiếng Anh, phải truyền locale theo ngôn ngữ app
const elementLocales = { vi, en, zh: zhCn }
const locale = computed(() => elementLocales[i18n.locale.value as keyof typeof elementLocales] ?? vi)

watchEffect(() => {
  document.documentElement.lang = i18n.locale.value
})
</script>

<style lang="less">
#app-view {
  min-width: 1180px;
}
</style>
