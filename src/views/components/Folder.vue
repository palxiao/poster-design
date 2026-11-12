<!--
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * @Author: ShawnPhang
 * @Date: 2024-04-03 19:15:21
 * @Description: 文件 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2026-08-31 13:19:45
-->
<template>
  <el-dropdown trigger="click" size="large" placement="bottom-start">
    <span class="el-dropdown-link">
      <slot />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item><div @click="$emit('select', 'newDesign')" class="item">{{ $t('editor.menu.newDesign') }}</div></el-dropdown-item>
        <!-- <el-dropdown-item @click="openPSD">导入文件</el-dropdown-item> -->
        <el-dropdown-item @click="$emit('select', 'save')" divided>{{ $t('editor.menu.save') }}</el-dropdown-item>
        <el-dropdown-item @click="$emit('select', 'download')">{{ $t('editor.menu.download') }}</el-dropdown-item>
        <!-- <el-dropdown-item disabled>版本记录</el-dropdown-item> -->
        <!-- <el-dropdown-item disabled>批量套模板</el-dropdown-item> -->
        <el-dropdown-item @click="$emit('select', 'changeLineGuides')" divided>{{ $t('editor.menu.guides') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// import { ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'

const router = useRouter()

const openPSD = () => {
  window.open(router.resolve('/psd').href, '_blank')
}
</script>

<style lang="less" scoped>
.item {
  width: 224px;
}
</style>
