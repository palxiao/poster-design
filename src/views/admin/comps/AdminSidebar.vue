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
  <aside class="admin-sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark"><el-icon><Brush /></el-icon></div>
      <div class="brand-text">
        <div class="brand-name">{{ APP_NAME }}</div>
        <div class="brand-sub">{{ $t('admin.brand.sub') }}</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div v-for="group in NAV_GROUPS" :key="group.title" class="nav-group">
        <div class="nav-group-title">{{ group.title }}</div>
        <div
          v-for="item in group.items"
          :key="item.key"
          class="nav-item"
          :class="{ active: item.key === active }"
          @click="$emit('select', item.key)"
        >
          <el-icon class="nav-item-icon"><component :is="item.icon" /></el-icon>
          <span class="nav-item-label">{{ item.label }}</span>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="user-avatar">{{ avatarChar }}</div>
      <div class="user-meta">
        <div class="user-name">{{ user.account }}</div>
        <div class="user-role">{{ $t('admin.v.admin') }}</div>
      </div>
      <el-button class="logout-btn" type="primary" link @click="$emit('logout')">
        <el-icon><SwitchButton /></el-icon>
      </el-button>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElIcon, ElButton } from 'element-plus'
import { Brush, SwitchButton } from '@element-plus/icons-vue'
import config from '@/config'
import { NAV_GROUPS } from '../constants'
import type { TAdminUser } from '../types'

const props = defineProps<{ active: string; user: TAdminUser }>()
defineEmits<{ select: [key: string]; logout: [] }>()

const APP_NAME = config.APP_NAME
const avatarChar = computed(() => (props.user.account || 'A').slice(0, 1).toUpperCase())
</script>

<style lang="less" scoped>
.admin-sidebar {
  display: flex;
  flex-direction: column;
  flex: none;
  width: 248px;
  height: 100%;
  background: @color-canvas;
  border-right: 1px solid @color-hairline-soft;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  height: 64px;
  padding: 0 18px;
  border-bottom: 1px solid @color-hairline-soft;
  .brand-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 32px;
    height: 32px;
    border-radius: @radius-md;
    background: @color-primary;
    color: @color-canvas;
    font-size: 17px;
  }
  .brand-text {
    min-width: 0;
    .brand-name {
      font-size: 15px;
      font-weight: 600;
      color: @color-ink-strong;
      letter-spacing: 0.02em;
    }
    .brand-sub {
      margin-top: 2px;
      font-size: 12px;
      color: @color-ink-hint;
    }
  }
}
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
  .nav-group {
    & + .nav-group { margin-top: 10px; }
    .nav-group-title {
      padding: 0 10px;
      margin-bottom: 6px;
      font-size: 11px;
      font-weight: 600;
      color: @color-ink-hint;
      letter-spacing: 0.08em;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 38px;
      padding: 0 10px;
      margin-bottom: 2px;
      border-radius: @radius-sm;
      color: @color-ink-secondary;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.15s, color 0.15s;
      .nav-item-icon {
        flex: none;
        font-size: 18px;
      }
      &:hover {
        background: @color-surface-hover;
        color: @color-ink-strong;
      }
      &.active {
        background: @color-primary-soft;
        color: @color-primary;
        font-weight: 600;
        &:hover {
          background: @color-primary-soft;
          color: @color-primary;
        }
      }
    }
  }
}
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid @color-hairline-soft;
  .user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 32px;
    height: 32px;
    border-radius: @radius-full;
    background: @color-primary-soft;
    color: @color-primary;
    font-size: 13px;
    font-weight: 600;
  }
  .user-meta {
    min-width: 0;
    .user-name {
      overflow: hidden;
      font-size: 13px;
      font-weight: 600;
      color: @color-ink-strong;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .user-role {
      margin-top: 1px;
      font-size: 12px;
      color: @color-ink-hint;
    }
  }
  .logout-btn {
    margin-left: auto;
    color: @color-ink-muted;
    font-size: 18px;
  }
}
</style>
