<!--
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * @Description: AI 助手面板：文案生成 / 文生图 / 智能配色
-->
<template>
  <el-dialog v-model="state.show" :title="$t('business.ai.title')" align-center width="680" :append-to-body="true" destroy-on-close @close="handleClose">
    <el-tabs v-model="state.activeTab" class="ai-tabs">
      <!-- 文案生成 -->
      <el-tab-pane :label="$t('business.ai.tabText')" name="text">
        <div class="ai-row">
          <el-input v-model="state.textPrompt" type="textarea" :rows="3" :placeholder="$t('business.ai.textPlaceholder')" />
        </div>
        <div class="ai-row ai-options">
          <span class="ai-label">{{ $t('business.ai.style') }}</span>
          <el-select v-model="state.textStyle" size="small" style="width: 160px">
            <el-option v-for="s in styleList" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button size="small" type="primary" :loading="state.textLoading" @click="generateText">{{ state.textLoading ? $t('business.ai.generating') : $t('business.ai.generateText') }}</el-button>
        </div>
        <div v-if="state.textList.length" class="ai-result">
          <div v-for="(item, index) in state.textList" :key="'t' + index" class="ai-result-item">
            <div class="ai-result-text">{{ item }}</div>
            <el-button size="small" type="primary" plain @click="insertText(item)">{{ $t('business.ai.insert') }}</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 文生图 -->
      <el-tab-pane :label="$t('business.ai.tabImage')" name="image">
        <div class="ai-row">
          <el-input v-model="state.imagePrompt" type="textarea" :rows="3" :placeholder="$t('business.ai.imagePlaceholder')" />
        </div>
        <div class="ai-row ai-options">
          <span class="ai-label">{{ $t('business.ai.ratio') }}</span>
          <el-select v-model="state.imageRatio" size="small" style="width: 160px">
            <el-option v-for="r in ratioList" :key="r" :label="r" :value="r" />
          </el-select>
          <el-button size="small" type="primary" :loading="state.imageLoading" @click="generateImage">{{ state.imageLoading ? $t('business.ai.generatingImage') : $t('business.ai.generateImage') }}</el-button>
        </div>
        <div v-if="state.imageUrl" class="ai-result image-preview">
          <img :src="state.imageUrl" :alt="$t('business.ai.imageAlt')" />
          <el-button size="small" type="primary" @click="insertImage">{{ $t('business.ai.insert') }}</el-button>
        </div>
      </el-tab-pane>

      <!-- 智能配色 -->
      <el-tab-pane :label="$t('business.ai.tabColor')" name="color">
        <div class="ai-row">
          <el-input v-model="state.colorPrompt" type="textarea" :rows="2" :placeholder="$t('business.ai.colorPlaceholder')" />
        </div>
        <div class="ai-row ai-options">
          <el-button size="small" type="primary" :loading="state.colorLoading" @click="generateColor">{{ state.colorLoading ? $t('business.ai.generating') : $t('business.ai.generateColor') }}</el-button>
        </div>
        <div v-if="state.colorList.length" class="ai-result">
          <div class="ai-color-list">
            <div v-for="(item, index) in state.colorList" :key="'c' + index" class="ai-color-item">
              <span class="ai-color-block" :style="{ backgroundColor: item.value }" @click="copyColor(item.value)" />
              <div class="ai-color-info">
                <div class="ai-color-name">{{ item.name }}</div>
                <div class="ai-color-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div class="ai-color-footer">
            <el-button size="small" plain @click="copyAllColors">{{ $t('business.ai.copyAll') }}</el-button>
            <el-button size="small" type="primary" @click="applyBackground">{{ $t('business.ai.applyBg') }}</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import i18n from '@/languages'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'
import api from '@/api'
import { useWidgetStore, useCanvasStore, useUserStore, useControlStore } from '@/store'
import { storeToRefs } from 'pinia'
import { wTextSetting } from '@/components/modules/widgets/wText/wTextSetting'
import wImageSetting from '@/components/modules/widgets/wImage/wImageSetting'
import { TAiColorItem } from '@/api/ai'

const styleList = [i18n.global.t('business.ai.styleMarketing'), i18n.global.t('business.ai.styleMinimal'), i18n.global.t('business.ai.styleArtistic'), i18n.global.t('business.ai.styleTech'), i18n.global.t('business.ai.styleEastern')]
const ratioList = ['1:1', '3:4', '4:3', '9:16', '16:9']

const state = reactive({
  show: false,
  activeTab: 'text',
  // 文案
  textPrompt: '',
  textStyle: i18n.global.t('business.ai.styleMarketing'),
  textLoading: false,
  textList: [] as string[],
  // 图片
  imagePrompt: '',
  imageRatio: '1:1',
  imageLoading: false,
  imageUrl: '',
  imageSize: { width: 0, height: 0 },
  // 配色
  colorPrompt: '',
  colorLoading: false,
  colorList: [] as TAiColorItem[],
})

const widgetStore = useWidgetStore()
const canvasStore = useCanvasStore()
const userStore = useUserStore()
const { dPage } = storeToRefs(canvasStore)

function checkLogin(): boolean {
  if (userStore.online) return true
  ElMessage.warning(i18n.global.t('business.ai.needLogin'))
  return false
}

function open() {
  // 清理选中框，避免 moveable 操作框遮挡弹窗（与其他弹窗行为一致）
  useControlStore().setShowMoveable(false)
  state.show = true
}

function handleClose() {
  state.activeTab = 'text'
  // 关闭后恢复选中框显示
  useControlStore().setShowMoveable(true)
}

// ---------- 文案生成 ----------
async function generateText() {
  if (!checkLogin()) return
  const prompt = state.textPrompt.trim()
  if (!prompt) return ElMessage.warning(i18n.global.t('business.ai.needTopic'))
  state.textLoading = true
  try {
    const res: any = await api.ai.textGenerate({ prompt, style: state.textStyle })
    // 接口异常（如未配置密钥）时透传真实提示
    if (res?.code !== 200) { ElMessage.warning(res?.msg || i18n.global.t('business.ai.textFailed')); return }
    state.textList = res?.list || []
    if (!state.textList.length) ElMessage.warning(i18n.global.t('business.ai.textEmpty'))
  } catch (e: any) {
    ElMessage.error(e?.message || i18n.global.t('business.ai.textFailed'))
  } finally {
    state.textLoading = false
  }
}

function insertText(text: string) {
  const setting = JSON.parse(JSON.stringify(wTextSetting))
  setting.text = text
  const { width: pW, height: pH } = dPage.value
  setting.fontSize = 48
  setting.width = setting.fontSize * text.length
  setting.left = pW / 2 - setting.width / 2
  setting.top = pH / 2 - setting.fontSize / 2
  widgetStore.addWidget(setting)
  ElMessage.success(i18n.global.t('business.ai.inserted'))
}

// ---------- 文生图 ----------
async function generateImage() {
  if (!checkLogin()) return
  const prompt = state.imagePrompt.trim()
  if (!prompt) return ElMessage.warning(i18n.global.t('business.ai.needImagePrompt'))
  state.imageLoading = true
  state.imageUrl = ''
  try {
    const res: any = await api.ai.imageGenerate({ prompt, ratio: state.imageRatio }, { _noLoading: true, timeout: 90000 })
    // 接口异常（如未配置密钥）时透传真实提示
    if (res?.code !== 200) { ElMessage.warning(res?.msg || i18n.global.t('business.ai.imageFailed')); return }
    state.imageUrl = res.url
    state.imageSize = { width: Number(res.width) || 0, height: Number(res.height) || 0 }
  } catch (e: any) {
    ElMessage.error(e?.message || i18n.global.t('business.ai.imageFailed'))
  } finally {
    state.imageLoading = false
  }
}

async function insertImage() {
  if (!state.imageUrl) return
  const setting = JSON.parse(JSON.stringify(wImageSetting))
  const { width: w, height: h } = state.imageSize
  const { width: pW, height: pH } = dPage.value
  // 按画布大小等比缩放，控制插入尺寸
  const ratio = Math.min(pW / (w || 1), pH / (h || 1), 1)
  setting.width = Math.round((w || 300) * ratio)
  setting.height = Math.round((h || 300) * ratio)
  setting.imgUrl = state.imageUrl
  setting.left = pW / 2 - setting.width / 2
  setting.top = pH / 2 - setting.height / 2
  widgetStore.addWidget(setting)
  ElMessage.success(i18n.global.t('business.ai.inserted'))
}

// ---------- 智能配色 ----------
async function generateColor() {
  if (!checkLogin()) return
  const prompt = state.colorPrompt.trim()
  if (!prompt) return ElMessage.warning(i18n.global.t('business.ai.needColorTheme'))
  state.colorLoading = true
  try {
    const res: any = await api.ai.colorSuggest({ prompt })
    // 接口异常（如未配置密钥）时透传真实提示
    if (res?.code !== 200) { ElMessage.warning(res?.msg || i18n.global.t('business.ai.colorFailed')); return }
    state.colorList = res.colors || []
    if (!state.colorList.length) ElMessage.warning(i18n.global.t('business.ai.colorEmpty'))
  } catch (e: any) {
    ElMessage.error(e?.message || i18n.global.t('business.ai.colorFailed'))
  } finally {
    state.colorLoading = false
  }
}

function copyColor(value: string) {
  navigator.clipboard?.writeText(value)
  ElMessage.success(`${i18n.global.t('business.ai.copied')} ${value}`)
}

function copyAllColors() {
  const values = state.colorList.map((item) => item.value).join(' ')
  navigator.clipboard?.writeText(values)
  ElMessage.success(i18n.global.t('business.ai.copiedAll'))
}

function applyBackground() {
  const main = state.colorList[0]
  if (!main) return
  dPage.value.backgroundColor = main.value
  ElMessage.success(`${i18n.global.t('business.ai.appliedBg')} ${main.value} ${i18n.global.t('business.ai.toBg')}`)
}

defineExpose({ open })
</script>

<style lang="less" scoped>
.ai-row {
  margin-bottom: 0.8rem;
  &.ai-options {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
.ai-label {
  font-size: 13px;
  color: #666;
  flex-shrink: 0;
}
.ai-result {
  margin-top: 0.5rem;
  max-height: 470px;
  overflow-y: auto;
  .ai-result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.6rem 0.5rem;
    border-radius: 6px;
    background: #f6f7f9;
    margin-bottom: 0.5rem;
    .ai-result-text {
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
  }
  &.image-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    img {
      max-width: 100%;
      max-height: 320px;
      border-radius: 6px;
    }
  }
}
.ai-color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}
.ai-color-item {
  width: calc(33.333% - 0.4rem);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  .ai-color-block {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    cursor: pointer;
    flex-shrink: 0;
  }
  .ai-color-info {
    .ai-color-name {
      font-size: 12px;
      color: #333;
    }
    .ai-color-value {
      font-size: 11px;
      color: #999;
    }
  }
}
.ai-color-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
// 让三个功能 Tab 更醒目
.ai-tabs {
  :deep(.el-tabs__nav-wrap::after) {
    height: 2px;
    background-color: #e4e7ed;
  }
  :deep(.el-tabs__item) {
    font-size: 15px;
    font-weight: 600;
    color: #909399;
    padding: 0 24px;
    height: 44px;
    line-height: 44px;
    &.is-active {
      color: @color-primary;
    }
    &:hover {
      color: @color-primary-hover;
    }
  }
  :deep(.el-tabs__active-bar) {
    height: 3px;
    background-color: @color-primary;
    border-radius: 2px;
  }
  :deep(.el-tabs__content) {
    padding-top: 14px;
  }
}
</style>
