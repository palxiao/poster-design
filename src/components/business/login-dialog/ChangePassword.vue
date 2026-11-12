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
  <el-dialog v-model="visible" :title="$t('business.password.title')" width="360px" :append-to-body="true" @closed="reset">
    <el-form @submit.prevent>
      <el-form-item>
        <el-input v-model="form.oldPassword" type="password" :placeholder="$t('business.password.old')" show-password @keyup.enter="submit" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.newPassword" type="password" :placeholder="$t('business.password.new')" show-password @keyup.enter="submit" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.confirmPassword" type="password" :placeholder="$t('business.password.confirm')" show-password @keyup.enter="submit" />
      </el-form-item>
      <el-button type="primary" style="width: 100%" :loading="loading" @click="submit">{{ $t('business.password.submit') }}</el-button>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
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
import { reactive, ref } from 'vue'
// ElDialog / ElInput / ElButton 已全局注册（见 elementConfig.ts），此处仅需补未注册的
import { ElMessage, ElForm, ElFormItem } from 'element-plus'
import { LocalStorageKey } from '@/config'
import * as adminApi from '@/api/admin'

export type ChangePasswordResult = { oldPassword: string; newPassword: string }

const visible = ref(false)
const loading = ref(false)
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
let resolveFn: ((value: boolean | null) => void) | null = null

/** 打开弹窗，改密成功后 resolve true，取消返回 null */
function open(): Promise<boolean | null> {
  visible.value = true
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

function reset() {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  resolveFn?.(null)
  resolveFn = null
}

function settle(success: boolean) {
  visible.value = false
  resolveFn?.(success)
  resolveFn = null
}

async function submit() {
  if (!form.oldPassword || !form.newPassword) {
    ElMessage.warning(i18n.global.t('business.password.fillOldNew'))
    return
  }
  if (form.newPassword.length < 6) {
    ElMessage.warning(i18n.global.t('business.password.tooShort'))
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.warning(i18n.global.t('business.password.mismatch'))
    return
  }
  loading.value = true
  try {
    const res: any = await adminApi.changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
    if (res?.code === 200) {
      ElMessage.success(i18n.global.t('business.password.done'))
      localStorage.removeItem(LocalStorageKey.tokenKey)
      settle(true)
    } else {
      ElMessage.error(res?.msg || i18n.global.t('business.password.failed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.message || i18n.global.t('business.login.network'))
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
