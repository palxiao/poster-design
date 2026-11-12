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
 * AI 能力接口实现：文案生成 / 文生图 / 智能配色
 * 走任意 OpenAI 兼容端点（默认智谱开放平台），接口地址、模型名与密钥由后台配置存储，登录用户可调用。
 */
import { Response } from 'express'
import fs from 'fs'
import axios from '../utils/http'
import imageSize from 'image-size'
import { filePath, staticLink } from '../configs'
import { send, checkCreateFolder, randomCode } from '../utils/tools'
import { getRequestUser } from '../utils/auth'
import { getAiSettings, saveAiSettingsInput, AiSettings, AiImageSizeMode } from '../db/settings'
import { addUserImage } from '../db/userImages'

/**
 * 各尺寸模式下「宽高比 → 供应商 size 参数」的映射。
 * 不同供应商可接受的档位不同：OpenAI 仅接受 256/512/1024/1792 组合，智谱接受 768x1024、720x1280 等。
 */
const IMAGE_SIZE_MAPS: Record<AiImageSizeMode, Record<string, string>> = {
  zhipu: { '1:1': '1024x1024', '3:4': '768x1024', '4:3': '1024x768', '9:16': '720x1280', '16:9': '1280x720' },
  openai: { '1:1': '1024x1024', '3:4': '1024x1792', '4:3': '1792x1024', '9:16': '1024x1792', '16:9': '1792x1024' },
  '1024': { '1:1': '1024x1024', '3:4': '1024x1024', '4:3': '1024x1024', '9:16': '1024x1024', '16:9': '1024x1024' },
}

/** 读取 AI 配置并做前置校验，未启用/未配置密钥时抛出带提示的异常 */
function requireAiEnabled(): AiSettings {
  const config = getAiSettings()
  if (!config.enabled) {
    throw new Error('Tính năng AI chưa được bật, vui lòng liên hệ quản trị viên để bật trong trang quản trị')
  }
  if (!config.api_key) {
    throw new Error('Dịch vụ AI chưa được cấu hình API Key, vui lòng liên hệ quản trị viên')
  }
  return config
}

/** 按宽高比与尺寸模式解析出供应商所需的 size 字符串，无法匹配时回退到 1:1 档位 */
function resolveImageSize(ratio: string, mode: AiImageSizeMode): string {
  const map = IMAGE_SIZE_MAPS[mode]
  if (!map) return '1024x1024'
  return map[ratio] || map['1:1'] || '1024x1024'
}

/** 密钥脱敏：短密钥只保留前 2 位，长密钥保留前 6 位与后 4 位 */
function maskApiKey(key: string): string {
  if (!key) return ''
  if (key.length <= 8) return key.slice(0, 2) + '****'
  return key.slice(0, 6) + '****' + key.slice(-4)
}

/** 从各供应商的错误响应中提取可读信息，兼容 { error: { message } } / { message } / { msg } 三种结构 */
function extractApiErrorMessage(e: any): string {
  const data = e && typeof e === 'object' ? e.response && e.response.data : undefined
  if (data && typeof data === 'object') {
    const message = data.error && typeof data.error.message === 'string' ? data.error.message : typeof data.message === 'string' ? data.message : typeof data.msg === 'string' ? data.msg : ''
    if (message) return message
  }
  return (e && e.message) || 'Lỗi không xác định'
}

/** 调用 OpenAI 兼容的对话接口，返回首个候选文本 */
async function chatCompletion(apiKey: string, baseUrl: string, model: string, system: string, user: string, temperature = 0.8): Promise<string> {
  // 注意：utils/http 的 axios 拦截器已将响应解包为 body，类型断言绕开 AxiosResponse 类型
  const body: any = await axios.post(
    `${baseUrl}/chat/completions`,
    {
      model,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    },
    { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 30000 }
  )
  const content = body?.choices?.[0]?.message?.content
  return typeof content === 'string' ? content : ''
}

/** 从对象中提取所有字符串字段值（智谱文案常返回 {主标题, 副标题, 宣传语} 结构） */
function collectObjectStrings(item: any): string[] {
  const values: string[] = []
  if (!item || typeof item !== 'object') return values
  for (const key of Object.keys(item)) {
    const value = item[key]
    if (typeof value === 'string' && value.trim()) values.push(value.trim())
    else if (value && typeof value === 'object') values.push(...collectObjectStrings(value))
  }
  return values
}

/** 从 LLM 输出中解析文案列表：兼容字符串数组、对象数组与逐行文本 */
function parseTextList(content: string): string[] {
  if (!content) return []
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) {
      const list: string[] = []
      for (const item of parsed) {
        if (typeof item === 'string' && item.trim()) list.push(item.trim())
        else list.push(...collectObjectStrings(item))
      }
      return list.filter(Boolean).slice(0, 6)
    }
  } catch (e) {}
  const lines = content.split('\n').map((line) => line.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean)
  return lines.slice(0, 6)
}

/** 校验并规范化十六进制色值，非法返回 null */
function normalizeColor(value: string): string | null {
  const match = String(value).trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (!match) return null
  const hex = match[1]
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  return '#' + full.toUpperCase()
}

/** 从 LLM 输出中解析配色：优先 JSON，其次按 #HEX 正则提取 */
function parseColorList(content: string): { name: string; value: string }[] {
  if (!content) return []
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) {
      const list = parsed
        .map((item) => {
          const name = typeof item?.name === 'string' ? item.name.trim() : ''
          const value = normalizeColor(item?.value ?? item?.color ?? '')
          return value ? { name: name || value, value } : null
        })
        .filter(Boolean) as { name: string; value: string }[]
      if (list.length) return list
    }
  } catch (e) {}
  const matches = content.match(/#[0-9a-fA-F]{3,6}\b/g) || []
  const values = matches.map((m) => normalizeColor(m)).filter((v): v is string => !!v)
  return values.map((value) => ({ name: value, value }))
}

/** 从生图响应中取出图片二进制：优先远端 url，回退 b64_json（部分 OpenAI 兼容实现只返回 base64） */
async function resolveImageBuffer(body: any): Promise<Buffer> {
  const item = body && Array.isArray(body.data) && body.data[0] ? body.data[0] : body
  if (item && typeof item.url === 'string' && item.url) {
    // 注意：utils/http 拦截器会把 arraybuffer 响应解包成 buffer 本体，不能再取 .data
    const imageRes: any = await axios.get(item.url, { responseType: 'arraybuffer', timeout: 60000 })
    return Buffer.from(imageRes || [])
  }
  if (item && typeof item.b64_json === 'string' && item.b64_json) {
    return Buffer.from(item.b64_json, 'base64')
  }
  return Buffer.alloc(0)
}

/** 生成的图片落盘到 static/ai 目录并校验有效性，无效时清理文件并返回 null */
function saveGeneratedImage(buffer: Buffer): { url: string; width: number; height: number } | null {
  const folder = 'ai'
  const folderPath = `${filePath}${folder}/`
  checkCreateFolder(folderPath)
  const name = `${Date.now()}-${randomCode(8)}.png`
  const targetPath = `${folderPath}${name}`
  fs.writeFileSync(targetPath, buffer)
  // 落盘后校验图片有效性（imageSize 抛错说明非有效图片）
  let width = 0
  let height = 0
  try {
    const sizeInfo = imageSize(targetPath)
    width = Number(sizeInfo.width)
    height = Number(sizeInfo.height)
  } catch (err) {
    fs.unlinkSync(targetPath)
    return null
  }
  // 显式拒绝 NaN / 0 / 负数，防止脏尺寸写入用户图片记录
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    fs.unlinkSync(targetPath)
    return null
  }
  return { url: `${staticLink}${folder}/${name}`, width, height }
}

export default {
  // AI 文案生成：POST /api/ai/text
  async textGenerate(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    let config: AiSettings
    try {
      config = requireAiEnabled()
    } catch (e) {
      return send.error(res, e?.message || 'Dịch vụ AI chưa được cấu hình')
    }
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''
    const style = typeof req.body?.style === 'string' && req.body.style.trim() ? req.body.style.trim() : 'Quảng cáo'
    if (!prompt) return send.error(res, 'Vui lòng nhập chủ đề')
    try {
      const system = `Bạn là chuyên gia viết nội dung poster. Hãy viết 4 mẫu nội dung poster với các phong cách khác nhau xoay quanh chủ đề người dùng đưa ra, tổng thể theo phong cách "${style}". Yêu cầu: mỗi nội dung ngắn gọn, truyền cảm hứng, không chứa placeholder, viết bằng tiếng Việt. Chỉ xuất ra một mảng JSON các chuỗi, ví dụ ["Nội dung một", "Nội dung hai", "Nội dung ba", "Nội dung bốn"], các phần tử phải là chuỗi thuần, không xuất thêm bất cứ nội dung nào khác.`
      const content = await chatCompletion(config.api_key, config.base_url, config.text_model, system, prompt)
      const list = parseTextList(content)
      if (!list.length) return send.error(res, 'AI chưa tạo được nội dung hợp lệ, vui lòng thử lại sau')
      send.success(res, { list })
    } catch (e) {
      console.error('[ai] 文案生成失败:', e?.message)
      send.error(res, 'Tạo nội dung bằng AI thất bại, vui lòng thử lại sau')
    }
  },

  // AI 文生图：POST /api/ai/image
  async imageGenerate(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    let config: AiSettings
    try {
      config = requireAiEnabled()
    } catch (e) {
      return send.error(res, e?.message || 'Dịch vụ AI chưa được cấu hình')
    }
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''
    const ratio = typeof req.body?.ratio === 'string' ? req.body.ratio.trim() : '1:1'
    if (!prompt) return send.error(res, 'Vui lòng nhập mô tả ảnh')
    const size = resolveImageSize(ratio, config.image_size_mode)
    try {
      // 注意：utils/http 的 axios 拦截器已将响应解包为 body，类型断言绕开 AxiosResponse 类型
      const body: any = await axios.post(
        `${config.base_url}/images/generations`,
        { model: config.image_model, prompt, size },
        { headers: { Authorization: `Bearer ${config.api_key}` }, timeout: 60000 }
      )
      const buffer = await resolveImageBuffer(body)
      if (!buffer || !buffer.length) return send.error(res, 'Tạo ảnh bằng AI thất bại, vui lòng thử lại sau')
      const saved = saveGeneratedImage(buffer)
      if (!saved) return send.error(res, 'Ảnh do AI tạo không hợp lệ, vui lòng thử lại')
      addUserImage(user.id, saved.url, saved.width, saved.height)
      send.success(res, saved)
    } catch (e) {
      console.error('[ai] 文生图失败:', e?.message)
      send.error(res, 'Tạo ảnh bằng AI thất bại, vui lòng thử lại sau')
    }
  },

  // AI 智能配色：POST /api/ai/color
  async colorSuggest(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    let config: AiSettings
    try {
      config = requireAiEnabled()
    } catch (e) {
      return send.error(res, e?.message || 'Dịch vụ AI chưa được cấu hình')
    }
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''
    if (!prompt) return send.error(res, 'Vui lòng nhập chủ đề phối màu')
    try {
      const system = `Bạn là nhà thiết kế phối màu chuyên nghiệp. Dựa trên chủ đề người dùng đưa ra, hãy xuất 5 màu hài hòa với nhau, trong đó có một màu chính. Chỉ xuất ra mảng JSON, mỗi phần tử có dạng {"name":"tên màu bằng tiếng Việt","value":"#RRGGBB"}, không xuất thêm nội dung nào khác.`
      const content = await chatCompletion(config.api_key, config.base_url, config.text_model, system, prompt, 0.7)
      const colors = parseColorList(content)
      if (!colors.length) return send.error(res, 'AI chưa tạo được bảng màu hợp lệ, vui lòng thử lại sau')
      send.success(res, { colors })
    } catch (e) {
      console.error('[ai] 配色失败:', e?.message)
      send.error(res, 'Tạo bảng màu bằng AI thất bại, vui lòng thử lại sau')
    }
  },

  // 获取 AI 配置（密钥脱敏）：GET /api/admin/ai/settings
  async getSettings(req: any, res: Response) {
    const config = getAiSettings()
    send.success(res, {
      api_key: maskApiKey(config.api_key),
      has_key: !!config.api_key,
      text_model: config.text_model,
      image_model: config.image_model,
      base_url: config.base_url,
      image_size_mode: config.image_size_mode,
      enabled: config.enabled,
    })
  },

  // 保存 AI 配置：POST /api/admin/ai/settings
  async updateSettings(req: any, res: Response) {
    // 逐字段校验与默认值降级由 saveAiSettingsInput 统一处理；密钥为空视为保留原值
    saveAiSettingsInput({
      api_key: req.body && req.body.api_key,
      text_model: req.body && req.body.text_model,
      image_model: req.body && req.body.image_model,
      base_url: req.body && req.body.base_url,
      image_size_mode: req.body && req.body.image_size_mode,
      enabled: req.body && req.body.enabled,
    })
    send.success(res, undefined)
  },

  // 测试连接：POST /api/admin/ai/test
  // 鉴权失败 / 模型不存在 / 网络不通都会在请求层抛错，能拿到响应即视为连接成功
  async testConnection(req: any, res: Response) {
    const config = getAiSettings()
    if (!config.enabled) return send.error(res, 'Tính năng AI chưa được bật')
    if (!config.api_key) return send.error(res, 'Chưa cấu hình API Key')
    try {
      const content = await chatCompletion(config.api_key, config.base_url, config.text_model, 'You are a connectivity test assistant. Reply with just the word: ok', 'ping', 0.2)
      send.success(res, { content: String(content || '').slice(0, 100) })
    } catch (e) {
      console.error('[ai] 测试连接失败:', e?.message)
      send.error(res, `Kết nối thất bại: ${extractApiErrorMessage(e)}`)
    }
  },
}
