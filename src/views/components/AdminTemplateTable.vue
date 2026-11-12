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
  <el-table class="admin-table" :data="rows" size="small" stripe v-loading="loading">
    <el-table-column prop="id" label="ID" width="70" />
    <el-table-column :label="$t('admin.templateTable.cover')" width="90">
      <template #default="{ row }">
        <el-image v-if="row.cover" :src="row.cover" :preview-src-list="[row.cover]" fit="cover" style="width: 64px; height: 36px" preview-teleported />
        <span v-else class="empty-cover">{{ $t('admin.templateTable.noCover') }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" :label="$t('admin.templateTable.title')" min-width="180" show-overflow-tooltip />
    <el-table-column :label="$t('admin.templateTable.size')" width="110"><template #default="{ row }">{{ row.width }} × {{ row.height }}</template></el-table-column>
    <el-table-column :label="$t('admin.templateTable.category')" width="160" show-overflow-tooltip><template #default="{ row }"><span>{{ row.cate || $t('admin.templateTable.uncategorized') }}</span><el-button type="primary" size="small" link @click="$emit('category', row)">{{ $t('common.modify') }}</el-button></template></el-table-column>
    <el-table-column :label="$t('admin.templateTable.status')" width="80"><template #default="{ row }"><el-tag :type="row.state === 1 ? 'success' : 'info'" size="small">{{ row.state === 1 ? $t('admin.templateTable.active') : $t('admin.templateTable.offline') }}</el-tag></template></el-table-column>
    <el-table-column :label="$t('admin.templateTable.actions')" width="170" fixed="right"><template #default="{ row }"><el-button type="primary" size="small" link @click="$emit('edit', row)">{{ $t('common.edit') }}</el-button><el-button v-if="row.state === 1" type="warning" size="small" link @click="$emit('delete', row)">{{ $t('admin.templateTable.unpublish') }}</el-button><el-button type="danger" size="small" link @click="$emit('remove', row)">{{ $t('common.delete') }}</el-button></template></el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElImage, ElTag, ElButton } from 'element-plus'
withDefaults(defineProps<{ rows: any[]; loading?: boolean }>(), { loading: false })
defineEmits<{ delete: [row: any]; remove: [row: any]; edit: [row: any]; category: [row: any] }>()
</script>

<style lang="less" scoped>
.empty-cover {
  display: inline-flex;
  width: 64px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: @color-ink-hint;
  background: @color-canvas-page;
  font-size: 12px;
}
</style>
