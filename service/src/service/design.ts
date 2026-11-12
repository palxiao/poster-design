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
 * 模板 / 素材相关接口实现（数据源：SQLite）
 */
import { Response } from 'express'
import axios from '../utils/http'
import { serviceLink, staticLink } from '../configs'
import { send } from '../utils/tools'
import * as templatesRepo from '../db/templates'
import * as materialsRepo from '../db/materials'
import * as fontsRepo from '../db/fonts'
import * as templateCategoriesRepo from '../db/templateCategories'
import { listAssetCategories } from '../db/assetCategories'

// design/list 获取模板列表
export async function getTemplates(req: any, res: Response) {
  /**
   * @api {get} /design/list 获取模板列表
   * @apiVersion 1.0.0
   * @apiGroup design
   */
  const { cate, type } = req.query || {}
  const typeValue = type == 1 ? 1 : 0
  const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(String(req.query.pageSize || '20'), 10) || 20))
  const rawCate = typeof cate === 'string' ? cate.trim() : ''
  const categoryId = /^\d+$/.test(rawCate) ? Number(rawCate) : 0
  const category = categoryId > 0 ? templateCategoriesRepo.getCategoryById(categoryId, typeValue) : undefined
  const categoryName = category?.name || rawCate
  const result = templatesRepo.listPage(typeValue, { page, pageSize, cate: categoryName, search: typeof req.query.search === 'string' ? req.query.search.trim() : '' })
  send.success(res, result)
}

export async function getTemplateCategories(req: any, res: Response) {
  send.success(res, { list: templateCategoriesRepo.listCategories(req.query?.type == 1 ? 1 : 0) })
}

// design/temp 获取模板详情
export async function getDetail(req: any, res: Response) {
  /**
   * @api {get} /design/temp 获取模板
   * @apiVersion 1.0.0
   * @apiGroup design
   */
  const { type, id } = req.query
  const tid = Number(id)
  if (!Number.isInteger(tid) || tid <= 0) {
    return send.error(res, 'Tham số id không hợp lệ')
  }
  const detail = templatesRepo.getDetail(tid, type == 1 ? 1 : 0)
  if (!detail) {
    return send.error(res, 'Mẫu không tồn tại')
  }
  send.success(res, detail)
}

// design/material 获取素材
export async function getMaterial(req: any, res: Response) {
  /**
   * @api {get} /design/material 获取素材
   * @apiVersion 1.0.0
   * @apiGroup design
   */
  const list = materialsRepo.getMaterials(req.query.cate)
  send.success(res, { list })
}

// design/imgs 获取照片素材
export async function getPhotos(req: any, res: Response) {
  /**
   * @api {get} /design/imgs 获取照片素材
   * @apiVersion 1.0.0
   * @apiGroup design
   */
  const list = materialsRepo.getPhotos(req.query.cate)
  send.success(res, { list })
}

export async function getAssetCategories(req: any, res: Response) {
  const type = req.query?.type === 'photos' ? 'photos' : 'materials'
  send.success(res, { list: listAssetCategories(type) })
}

// design/fonts 获取字体列表（公开接口，编辑器无需登录即可使用）
export async function getFonts(req: any, res: Response) {
  /**
   * @api {get} /design/fonts 获取字体列表
   * @apiVersion 1.0.0
   * @apiGroup design
   */
  const rows = fontsRepo.listAllFonts()
  // 对外仅暴露编辑器实际需要的字段，避免泄漏管理字段
  const list = rows.map((row) => ({
    id: row.id,
    alias: row.alias,
    value: row.value,
    preview: row.preview,
    woff: row.woff,
    ttf: row.ttf,
    lang: row.lang,
    font_family: row.font_family,
    size: row.size,
    woff_size: row.woff_size,
  }))
  send.success(res, { list })
}

// design/edit 保存模板
export async function saveTemplate(req: any, res: Response) {
  /**
   * @api {post} /design/edit 保存模板
   * @apiVersion 1.0.0
   * @apiGroup design
   */
  const { id, title, data, width, height, type } = req.body
  // 参数校验：防止脏数据落库（NaN 会被 JSON.stringify 偷换为 null）
  const w = Number(width)
  const h = Number(height)
  if (typeof data !== 'string' || !data || !(w > 0) || !(h > 0)) {
    return send.error(res, 'Tham số thiếu hoặc không hợp lệ')
  }
  const tid = Number(id)
  const isAdd = !Number.isInteger(tid) || tid <= 0 // 是否新增模板
  const params = {
    title: String(title || ''),
    data,
    width: w,
    height: h,
    type: (type == 1 ? 1 : 0) as 0 | 1,
    cate: String(req.body.cate || ''),
  }

  const savedId = isAdd ? templatesRepo.createTemplate(params) : tid
  if (!isAdd && !templatesRepo.updateTemplate(tid, params)) {
    return send.error(res, 'Mẫu không tồn tại')
  }

  // 生成封面（调用截图服务，成功后回填 cover）
  try {
    const size = w > h ? 640 : 320
    await axios.get(
      `${serviceLink}/api/screenshots?tempid=${savedId}&tempType=${params.type}&width=${w}&height=${h}&type=cover&size=${size}&quality=75`,
      { responseType: 'arraybuffer' }
    )
    // 组件与模板的封面命名规则不同，与截图服务的产出保持一致
    const cover = params.type === 1 ? `${staticLink}${savedId}-screenshot.png` : `${staticLink}${savedId}-cover.jpg`
    templatesRepo.setCover(savedId, cover)
  } catch (error) {
    console.warn('[design] 封面生成失败:', error)
  }

  send.success(res, { id: savedId })
}

export default { getTemplates, getTemplateCategories, getDetail, getMaterial, getPhotos, getAssetCategories, getFonts, saveTemplate }
