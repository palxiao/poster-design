<!--
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 -->
<template>
  <header class="admin-topbar">
    <div class="topbar-heading">
      <div class="topbar-title">{{ title }}</div>
      <div class="topbar-desc">{{ description }}</div>
    </div>
    <div class="topbar-actions">
      <el-button type="primary" plain @click="$emit('home')">
        <el-icon class="action-icon"><Promotion /></el-icon>
        {{ $t('admin.topbar.openEditor') }}
      </el-button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ElIcon, ElButton } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'

defineProps<{ title: string; description: string }>()
defineEmits<{ home: [] }>()
</script>

<style lang="less" scoped>
.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex: none;
  height: 64px;
  padding: 0 28px;
  background: @color-canvas;
  border-bottom: 1px solid @color-hairline-soft;
}
.topbar-heading {
  min-width: 0;
  .topbar-title {
    font-size: 17px;
    font-weight: 600;
    color: @color-ink-strong;
    line-height: 1.4;
  }
  .topbar-desc {
    margin-top: 2px;
    overflow: hidden;
    font-size: 13px;
    color: @color-ink-muted;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.topbar-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
  .action-icon { font-size: 16px; }
}
</style>
