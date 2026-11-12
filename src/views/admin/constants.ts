/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import i18n from '@/languages'
import {
  Odometer,
  Grid,
  Picture,
  Camera,
  CollectionTag,
  Document,
  PictureFilled,
  User,
  Star,
  Setting,
} from '@element-plus/icons-vue'
import type { TNavGroup } from './types'

/** 侧边栏导航结构。key 必须与 Admin.vue 各 pane 的激活键完全一致 */
export const NAV_GROUPS: TNavGroup[] = [
  {
    title: i18n.global.t('admin.nav.overviewGroup'),
    items: [{ key: 'overview', label: i18n.global.t('admin.nav.overview'), icon: Odometer }],
  },
  {
    title: i18n.global.t('admin.nav.contentGroup'),
    items: [
      { key: 'templates', label: i18n.global.t('admin.nav.templates'), icon: Grid },
      { key: 'materials', label: i18n.global.t('admin.nav.materials'), icon: Picture },
      { key: 'photos', label: i18n.global.t('admin.nav.photos'), icon: Camera },
      { key: 'categories', label: i18n.global.t('admin.nav.categories'), icon: CollectionTag },
      { key: 'fonts', label: i18n.global.t('admin.nav.fonts'), icon: Document },
    ],
  },
  {
    title: i18n.global.t('admin.v.userLabel'),
    items: [
      { key: 'user-images', label: i18n.global.t('admin.stat.userImages'), icon: PictureFilled },
      { key: 'users', label: i18n.global.t('admin.nav.users'), icon: User },
      { key: 'designs', label: i18n.global.t('admin.nav.designs'), icon: Star },
    ],
  },
  {
    title: i18n.global.t('admin.nav.systemGroup'),
    items: [{ key: 'ai-settings', label: i18n.global.t('admin.nav.ai'), icon: Setting }],
  },
]

/** 各页顶部栏文案：标题 + 一句职责说明 */
export const PAGE_META: Record<string, { title: string; description: string }> = {
  overview: { title: i18n.global.t('admin.nav.overview'), description: i18n.global.t('admin.desc.overview') },
  templates: { title: i18n.global.t('admin.nav.templates'), description: i18n.global.t('admin.desc.templates') },
  materials: { title: i18n.global.t('admin.nav.materials'), description: i18n.global.t('admin.desc.materials') },
  photos: { title: i18n.global.t('admin.nav.photos'), description: i18n.global.t('admin.desc.photos') },
  categories: { title: i18n.global.t('admin.nav.categories'), description: i18n.global.t('admin.desc.categories') },
  fonts: { title: i18n.global.t('admin.nav.fonts'), description: i18n.global.t('admin.desc.fonts') },
  'user-images': { title: i18n.global.t('admin.stat.userImages'), description: i18n.global.t('admin.desc.userImages') },
  users: { title: i18n.global.t('admin.nav.users'), description: i18n.global.t('admin.desc.users') },
  designs: { title: i18n.global.t('admin.nav.designs'), description: i18n.global.t('admin.desc.designs') },
  'ai-settings': { title: i18n.global.t('admin.nav.ai'), description: i18n.global.t('admin.desc.ai') },
}

/** AI 生图尺寸模式：不同供应商可接受的 size 档位不同，需按供应商选择映射 */
export const AI_SIZE_MODE_OPTIONS: { value: string; label: string }[] = [
  { value: 'zhipu', label: i18n.global.t('admin.size.zhipu') },
  { value: 'openai', label: i18n.global.t('admin.size.openai') },
  { value: '1024', label: i18n.global.t('admin.size.unified') },
]
