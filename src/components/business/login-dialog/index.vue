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
  <el-dialog v-model="visible" :title="$t('business.login.title')" width="360px" :append-to-body="true" @closed="reset">
    <el-tabs v-model="mode">
      <el-tab-pane :label="$t('business.login.login')" name="login" />
      <el-tab-pane :label="$t('business.login.register')" name="register" />
    </el-tabs>
    <el-form @submit.prevent>
      <el-form-item>
        <el-input v-model="form.account" :placeholder="$t('business.login.account')" @keyup.enter="submit" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" :placeholder="$t('business.login.password')" show-password @keyup.enter="submit" />
      </el-form-item>
      <el-button type="primary" style="width: 100%" :loading="loading" @click="submit">
        {{ mode === 'login' ? $t('business.login.login') : $t('business.login.registerAndLogin') }}
      </el-button>
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
import { ElMessage, ElTabs, ElTabPane, ElForm, ElFormItem } from 'element-plus'
import { LocalStorageKey } from '@/config'
import * as adminApi from '@/api/admin'

export type LoginResult = { account: string; role: number }

const visible = ref(false)
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const form = reactive({ account: '', password: '' })
let resolveFn: ((value: LoginResult | null) => void) | null = null

/** 打开弹窗，成功登录后 resolve 用户信息，取消返回 null */
function open(initMode: 'login' | 'register' = 'login'): Promise<LoginResult | null> {
  mode.value = initMode
  visible.value = true
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

function reset() {
  form.account = ''
  form.password = ''
  resolveFn?.(null)
  resolveFn = null
}

function settle(result: LoginResult) {
  // token 已在 submit 中写入，这里补写用户信息
  localStorage.setItem('xp_user', JSON.stringify({ account: result.account, role: result.role }))
  visible.value = false
  resolveFn?.(result)
  resolveFn = null
}

async function submit() {
  if (!form.account || !form.password) {
    ElMessage.warning(i18n.global.t('business.login.fillAll'))
    return
  }
  loading.value = true
  try {
    const api = mode.value === 'login' ? adminApi.login : adminApi.register
    // axios 拦截器对 code===200 的响应只返回 result 本体，错误返回完整对象
    const res: any = await api({ account: form.account.trim(), password: form.password })
    if (res?.token) {
      localStorage.setItem(LocalStorageKey.tokenKey, res.token)
      settle({ account: res.account, role: res.role })
    } else {
      ElMessage.error(res?.msg || i18n.global.t('business.login.failed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.message || i18n.global.t('business.login.network'))
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
