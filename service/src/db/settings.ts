/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * 系统设置键值存储（key-value）
 * 用于持久化后台可配置项，如 AI 接口密钥、模型名、接口地址等。
 *
 * AI 配置读写约定（两者缺一不可）：
 * - 写入防御：saveAiSettingsInput 逐字段校验后再落盘，不让脏值写入
 * - 读取校验：getAiSettings 逐字段做类型与取值范围校验，缺省/损坏静默降级为默认值
 * - 向后兼容：老版本 zhipu_api_key 字段双读兼容，写路径只写 ai_api_key
 */
import { getDB } from './index'

const TABLE = 'ai_settings'

/** AI 接口默认地址（智谱开放平台，OpenAI 兼容格式），可切换为任意 OpenAI 兼容端点 */
export const DEFAULT_AI_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

/** 默认文案模型 */
export const DEFAULT_TEXT_MODEL = 'glm-4-flash'

/** 默认生图模型 */
export const DEFAULT_IMAGE_MODEL = 'cogview-3-flash'

/**
 * 生图尺寸模式：
 * - zhipu：智谱档位（768x1024 / 720x1280 等）
 * - openai：OpenAI 标准档位（仅 256/512/1024/1792 组合）
 * - 1024：一律 1024x1024，兼容仅支持单一尺寸的模型
 */
export type AiImageSizeMode = 'zhipu' | 'openai' | '1024'

const AI_IMAGE_SIZE_MODES: AiImageSizeMode[] = ['zhipu', 'openai', '1024']

/** 读取单个设置项，不存在返回空串 */
export function getSetting(key: string): string {
  const row = getDB().prepare(`SELECT value FROM ${TABLE} WHERE key = ?`).get(key) as { value: string } | undefined
  return row && typeof row.value === 'string' ? row.value : ''
}

/** 写入单个设置项（存在则更新） */
export function setSetting(key: string, value: string): void {
  getDB().prepare(`INSERT INTO ${TABLE} (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run(key, value)
}

/** 归一化 AI 接口地址：仅允许 http(s)，去除尾随斜杠，非法或为空时降级为默认地址 */
export function normalizeAiBaseUrl(value: any): string {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return DEFAULT_AI_BASE_URL
  const matched = raw.match(/^https?:\/\/\S+/i)
  if (!matched) return DEFAULT_AI_BASE_URL
  return matched[0].replace(/\/+$/, '')
}

/** 归一化生图尺寸模式：非白名单值降级为 zhipu */
export function normalizeAiSizeMode(value: any): AiImageSizeMode {
  if (value === 'openai' || value === '1024' || value === 'zhipu') return value
  return 'zhipu'
}

/** 归一化模型名：仅保留字母数字与点、横线、下划线，避免拼出异常请求路径 */
export function sanitizeAiModel(value: any): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[^a-zA-Z0-9._-]/g, '')
}

/** 解析 enabled 布尔值，兼容 '0'/'1'/'true'/'false' 字符串，空值视为关闭 */
export function parseAiEnabled(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value !== '' && value !== '0' && value !== 'false'
  return value === undefined ? false : true
}

/** 后台提交 AI 配置时的入参（字段均可缺省，缺省项降级为默认值） */
export interface AiSettingsInput {
  api_key?: any
  text_model?: any
  image_model?: any
  base_url?: any
  image_size_mode?: any
  enabled?: any
}

/**
 * 保存 AI 配置：写入前逐字段校验。
 * 密钥为空视为「保留原值」而非清空，避免误操作导致配置丢失；如需停用请直接关闭开关。
 */
export function saveAiSettingsInput(input: AiSettingsInput): void {
  const apiKey = typeof input.api_key === 'string' ? input.api_key.trim() : ''
  // 后台读取到的是脱敏值（含 ****），被原样回传时不得覆盖真实密钥
  if (apiKey && apiKey.indexOf('****') === -1) setSetting('ai_api_key', apiKey)
  setSetting('text_model', sanitizeAiModel(input.text_model) || DEFAULT_TEXT_MODEL)
  setSetting('image_model', sanitizeAiModel(input.image_model) || DEFAULT_IMAGE_MODEL)
  setSetting('ai_base_url', normalizeAiBaseUrl(input.base_url))
  setSetting('ai_image_size_mode', normalizeAiSizeMode(input.image_size_mode))
  setSetting('enabled', parseAiEnabled(input.enabled) ? '1' : '0')
}

export interface AiSettings {
  api_key: string
  text_model: string
  image_model: string
  base_url: string
  image_size_mode: AiImageSizeMode
  enabled: boolean
}

/** 读取 AI 配置；逐字段类型校验，缺省/损坏时静默降级为默认值 */
export function getAiSettings(): AiSettings {
  const rows = getDB().prepare(`SELECT key, value FROM ${TABLE}`).all() as { key: string; value: string }[]
  const map: Record<string, string> = {}
  for (const row of rows) {
    if (row && typeof row.key === 'string') map[row.key] = row.value
  }
  // 密钥：新字段 ai_api_key 优先，老版本 zhipu_api_key 兜底（写路径只写新字段）
  const currentKey = typeof map.ai_api_key === 'string' ? map.ai_api_key.trim() : ''
  const legacyKey = typeof map.zhipu_api_key === 'string' ? map.zhipu_api_key.trim() : ''
  const textModel = typeof map.text_model === 'string' && map.text_model.trim() ? map.text_model.trim() : DEFAULT_TEXT_MODEL
  const imageModel = typeof map.image_model === 'string' && map.image_model.trim() ? map.image_model.trim() : DEFAULT_IMAGE_MODEL
  return {
    api_key: currentKey || legacyKey,
    text_model: textModel,
    image_model: imageModel,
    base_url: normalizeAiBaseUrl(map.ai_base_url),
    image_size_mode: normalizeAiSizeMode(map.ai_image_size_mode),
    enabled: parseAiEnabled(map.enabled),
  }
}

/** 导出给后台表单渲染的尺寸模式选项 */
export const AI_SIZE_MODE_OPTIONS: { value: AiImageSizeMode; label: string }[] = AI_IMAGE_SIZE_MODES.map((mode) => ({
  value: mode,
  label: mode === 'zhipu' ? 'Khung Zhipu' : mode === 'openai' ? 'OpenAI chuẩn' : 'Thống nhất 1024',
}))
