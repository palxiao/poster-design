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
 * 后台管理接口实现（均需登录）
 */
import { Response } from 'express'
import axios from '../utils/http'
import { serviceLink, staticLink } from '../configs'
import { send, isNumber } from '../utils/tools'
import { listAllTemplates, softDeleteTemplate, deleteTemplate as deleteTemplateRow, deleteUserImage, listCategories, listAssets, addAsset as addAssetRow, saveAsset, moveAsset, deleteAsset as deleteAssetRow, deleteCategory, addCategory, renameCategory } from '../db/admin'
import { listUserImages } from '../db/userImages'
import * as fontsRepo from '../db/fonts'
import * as templatesRepo from '../db/templates'
import * as usersRepo from '../db/users'
import * as templateCategoriesRepo from '../db/templateCategories'
import * as designsRepo from '../db/designs'

function pageResult<T>(list: T[], pageValue: any, pageSizeValue: any) {
  const page = Math.max(1, Math.floor(Number(pageValue) || 1))
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSizeValue) || 20)))
  return { list: list.slice((page - 1) * pageSize, page * pageSize), total: list.length, page, pageSize }
}

export default {
  // 模板列表（含已下架）
  async getTemplates(req: any, res: Response) {
    send.success(res, pageResult(listAllTemplates(), req.query?.page, req.query?.pageSize))
  },

  // 软删除模板（state 置 0）
  async deleteTemplate(req: any, res: Response) {
    const id = Number(req.body?.id)
    if (!isNumber(id) || id <= 0) {
      send.error(res, 'Tham số không hợp lệ')
      return
    }
    softDeleteTemplate(id) ? send.success(res, undefined) : send.error(res, 'Bản ghi không tồn tại')
  },

  async removeTemplate(req: any, res: Response) {
    const id = Number(req.body?.id)
    if (!Number.isInteger(id) || id <= 0) return send.error(res, 'Tham số không hợp lệ')
    deleteTemplateRow(id) ? send.success(res, undefined) : send.error(res, 'Mẫu không tồn tại')
  },

  // 管理员保存模板（PSD 导入创建模板/组合），与原 /design/edit 等价但强制 admin 鉴权
  async saveTemplate(req: any, res: Response) {
    const { id, title, data, width, height, type } = req.body
    // 写入防御：参数校验（NaN 会被 JSON.stringify 偷换为 null，需显式拦截）
    const w = Number(width)
    const h = Number(height)
    if (typeof data !== 'string' || !data || !(w > 0) || !(h > 0)) {
      return send.error(res, 'Tham số thiếu hoặc không hợp lệ')
    }
    const tid = Number(id)
    const isAdd = !Number.isInteger(tid) || tid <= 0
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

    // 生成封面：调用截图服务，成功后回填 cover（失败不阻塞主流程）
    try {
      const size = w > h ? 640 : 320
      await axios.get(
        `${serviceLink}/api/screenshots?tempid=${savedId}&tempType=${params.type}&width=${w}&height=${h}&type=cover&size=${size}&quality=75`,
        { responseType: 'arraybuffer' }
      )
      const cover = params.type === 1 ? `${staticLink}${savedId}-screenshot.png` : `${staticLink}${savedId}-cover.jpg`
      templatesRepo.setCover(savedId, cover)
    } catch (error) {
      console.warn('[admin] 封面生成失败:', error)
    }

    send.success(res, { id: savedId })
  },

  async updateTemplateCategory(req: any, res: Response) {
    const id = Number(req.body?.id)
    const type = req.body?.type == 1 ? 1 : 0
    const cate = typeof req.body?.cate === 'string' ? req.body.cate.trim() : ''
    if (!Number.isInteger(id) || id <= 0) return send.error(res, 'Tham số không hợp lệ')
    if (cate && !templateCategoriesRepo.listCategories(type).some((item) => item.name === cate)) return send.error(res, 'Danh mục không tồn tại')
    templatesRepo.updateTemplateCategory(id, type, cate) ? send.success(res, undefined) : send.error(res, 'Mẫu không tồn tại')
  },

  // 用户上传图片列表
  async getUserImages(req: any, res: Response) {
    send.success(res, pageResult(listUserImages(), req.query?.page, req.query?.pageSize))
  },

  // 用户列表（不返回密码、salt 等敏感字段）
  async getUsers(req: any, res: Response) {
    send.success(res, pageResult(usersRepo.listUsers(), req.query?.page, req.query?.pageSize))
  },

  async getDesigns(req: any, res: Response) {
    send.success(res, pageResult(designsRepo.listAllDesigns(), req.query?.page, req.query?.pageSize))
  },

  async deleteDesign(req: any, res: Response) {
    const id = Number(req.body?.id)
    if (!Number.isInteger(id) || id <= 0) return send.error(res, 'Tham số không hợp lệ')
    designsRepo.deleteDesignByAdmin(id) ? send.success(res, undefined) : send.error(res, 'Thiết kế không tồn tại')
  },

  // 仅允许删除普通用户，管理员账号不可通过该接口删除
  async deleteUser(req: any, res: Response) {
    const id = Number(req.body?.id)
    const currentUserId = Number(req.user?.id)
    if (!Number.isInteger(id) || id <= 0 || id === currentUserId) {
      send.error(res, 'Tham số không hợp lệ hoặc không thể xóa tài khoản hiện tại')
      return
    }
    usersRepo.deleteUser(id) ? send.success(res, undefined) : send.error(res, 'Người dùng không tồn tại hoặc tài khoản quản trị không thể bị xóa')
  },

  // 删除用户图片记录
  async deleteUserImage(req: any, res: Response) {
    const id = Number(req.body?.id)
    if (!isNumber(id) || id <= 0) {
      send.error(res, 'Tham số không hợp lệ')
      return
    }
    deleteUserImage(id) ? send.success(res, undefined) : send.error(res, 'Bản ghi không tồn tại')
  },

  // 素材 / 照片分类列表
  async getCategories(req: any, res: Response) {
    const table = req.query?.type === 'photos' ? 'photos' : 'materials'
    send.success(res, pageResult(listCategories(table), req.query?.page, req.query?.pageSize))
  },

  async getAssets(req: any, res: Response) {
    const table = req.query?.type === 'photos' ? 'photos' : 'materials'
    send.success(res, pageResult(listAssets(table, String(req.query?.cate || ''), String(req.query?.search || '')), req.query?.page, req.query?.pageSize))
  },

  async addAsset(req: any, res: Response) {
    const table = req.body?.type === 'photos' ? 'photos' : 'materials'
    const cate = typeof req.body?.cate === 'string' ? req.body.cate.trim() : ''
    const asset = req.body?.asset && { ...req.body.asset, type: req.body.asset.type === 'png' ? 'image' : req.body.asset.type, ...(req.body.asset.type === 'mask' ? { isContainer: true } : {}) }
    if (!cate || !asset || typeof asset.url !== 'string' || !asset.url.trim() || (table === 'materials' && !['image', 'svg', 'mask'].includes(asset.type))) return send.error(res, 'Tham số không hợp lệ')
    addAssetRow(table, cate, asset) ? send.success(res, undefined) : send.error(res, 'Danh mục không tồn tại')
  },

  async updateAsset(req: any, res: Response) {
    const table = req.body?.type === 'photos' ? 'photos' : 'materials'
    const cate = typeof req.body?.cate === 'string' ? req.body.cate.trim() : ''
    const fromCate = typeof req.body?.fromCate === 'string' ? req.body.fromCate.trim() : cate
    const index = Number(req.body?.index)
    const asset = req.body?.asset && { ...req.body.asset, type: req.body.asset.type === 'png' ? 'image' : req.body.asset.type, ...(req.body.asset.type === 'mask' ? { isContainer: true } : {}) }
    if (!cate || !Number.isInteger(index) || !asset || typeof asset.url !== 'string' || !asset.url.trim() || (table === 'materials' && !['image', 'svg', 'mask'].includes(asset.type))) return send.error(res, 'Tham số không hợp lệ')
    const updated = fromCate !== cate ? moveAsset(table, fromCate, cate, index, asset) : saveAsset(table, cate, index, asset)
    if (updated) send.success(res, undefined)
    else send.error(res, 'Tư liệu không tồn tại')
  },

  async deleteAsset(req: any, res: Response) {
    const table = req.body?.type === 'photos' ? 'photos' : 'materials'
    const cate = typeof req.body?.cate === 'string' ? req.body.cate.trim() : ''
    const index = Number(req.body?.index)
    if (!cate || !Number.isInteger(index) || index < 0) return send.error(res, 'Tham số không hợp lệ')
    deleteAssetRow(table, cate, index) ? send.success(res, undefined) : send.error(res, 'Tài nguyên không tồn tại')
  },

  async getTemplateCategories(req: any, res: Response) {
    send.success(res, pageResult(templateCategoriesRepo.listCategories(req.query?.type == 1 ? 1 : 0), req.query?.page, req.query?.pageSize))
  },

  async addTemplateCategory(req: any, res: Response) {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    const type = req.body?.type == 1 ? 1 : 0
    const sort = Number(req.body?.sort)
    if (!name) return send.error(res, 'Tên danh mục không được để trống')
    try {
      const id = templateCategoriesRepo.addCategory(name, type, Number.isFinite(sort) ? sort : 0)
      send.success(res, { id })
    } catch (error) {
      send.error(res, error?.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 'Tên danh mục đã tồn tại' : 'Tạo danh mục thất bại')
    }
  },

  async deleteTemplateCategory(req: any, res: Response) {
    const id = Number(req.body?.id)
    if (!Number.isInteger(id) || id <= 0) return send.error(res, 'Tham số không hợp lệ')
    if (templateCategoriesRepo.countTemplateUsage(id) > 0) return send.error(res, 'Danh mục này vẫn đang được mẫu sử dụng, vui lòng đổi danh mục của mẫu trước')
    templateCategoriesRepo.deleteCategory(id) ? send.success(res, undefined) : send.error(res, 'Danh mục không tồn tại')
  },

  async renameTemplateCategory(req: any, res: Response) {
    const id = Number(req.body?.id)
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    if (!Number.isInteger(id) || id <= 0 || !name) return send.error(res, 'Tham số không hợp lệ')
    try {
      templateCategoriesRepo.renameCategory(id, name) ? send.success(res, undefined) : send.error(res, 'Danh mục không tồn tại')
    } catch (error) {
      send.error(res, 'Tên danh mục đã tồn tại')
    }
  },

  // 删除素材 / 照片分类
  async deleteCategory(req: any, res: Response) {
    const table = req.body?.type === 'photos' ? 'photos' : 'materials'
    const cate = req.body?.cate
    if (typeof cate !== 'string' || !cate) {
      send.error(res, 'Tham số không hợp lệ')
      return
    }
    deleteCategory(table, cate) ? send.success(res, undefined) : send.error(res, 'Danh mục không tồn tại')
  },

  async addCategory(req: any, res: Response) {
    const table = req.body?.type === 'photos' ? 'photos' : 'materials'
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    if (!name) return send.error(res, 'Tên danh mục không được để trống')
    try {
      addCategory(table, name) ? send.success(res, undefined) : send.error(res, 'Tạo danh mục thất bại')
    } catch (error) {
      send.error(res, 'Danh mục đã tồn tại')
    }
  },

  async renameCategory(req: any, res: Response) {
    const table = req.body?.type === 'photos' ? 'photos' : 'materials'
    const cate = typeof req.body?.cate === 'string' ? req.body.cate.trim() : ''
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    if (!cate || !name) return send.error(res, 'Tên danh mục không được để trống')
    try {
      renameCategory(table, cate, name) ? send.success(res, undefined) : send.error(res, 'Danh mục không tồn tại')
    } catch (error) {
      send.error(res, 'Danh mục đã tồn tại')
    }
  },

  // 字体列表（含完整字段，便于后台管理）
  async getFonts(req: any, res: Response) {
    const page = Number(req.query?.page) || 1
    const pageSize = Number(req.query?.pageSize) || 20
    const search = typeof req.query?.search === 'string' ? req.query.search : ''
    send.success(res, fontsRepo.listFonts(page, pageSize, search))
  },

  // 新增字体
  async addFont(req: any, res: Response) {
    const { alias, value, woff, lang, preview, ttf, font_family, size, woff_size } = req.body || {}
    // 必填：alias（显示名）、value（CSS family slug）、woff（字体 woff 链接）
    if (typeof alias !== 'string' || !alias.trim()) return send.error(res, 'Tên font không được để trống')
    if (typeof value !== 'string' || !value.trim()) return send.error(res, 'Giá trị value của font không được để trống')
    if (typeof woff !== 'string' || !woff.trim()) return send.error(res, 'Liên kết woff không được để trống')
    // lang 兜底为 'zh'，非字符串则视为 'zh'
    const langValue = lang === 'en' ? 'en' : 'zh'
    // 数值字段：上游可能给空串 / null，统一安全降级为 0
    const toSafeNumber = (v: any) => {
      const n = Number(v)
      return Number.isFinite(n) && n > 0 ? n : 0
    }
    const id = fontsRepo.addFont({
      alias: alias.trim(),
      value: value.trim(),
      preview: typeof preview === 'string' ? preview : '',
      woff: woff.trim(),
      ttf: typeof ttf === 'string' ? ttf : '',
      lang: langValue,
      font_family: typeof font_family === 'string' ? font_family : '',
      size: toSafeNumber(size),
      woff_size: toSafeNumber(woff_size),
    })
    send.success(res, { id })
  },

  // 编辑字体基础信息，不修改文件大小统计
  async updateFont(req: any, res: Response) {
    const { id, alias, value, woff, lang, preview, ttf, font_family } = req.body || {}
    if (!isNumber(Number(id)) || Number(id) <= 0) return send.error(res, 'Tham số không hợp lệ')
    if (typeof alias !== 'string' || !alias.trim()) return send.error(res, 'Tên font không được để trống')
    if (typeof value !== 'string' || !value.trim()) return send.error(res, 'Giá trị value của font không được để trống')
    if (typeof woff !== 'string' || !woff.trim()) return send.error(res, 'Liên kết woff không được để trống')
    const updated = fontsRepo.updateFont(Number(id), {
      alias: alias.trim(), value: value.trim(), woff: woff.trim(),
      preview: typeof preview === 'string' ? preview : '',
      ttf: typeof ttf === 'string' ? ttf : '', lang: lang === 'en' ? 'en' : 'zh',
      font_family: typeof font_family === 'string' ? font_family : '',
    })
    updated ? send.success(res, undefined) : send.error(res, 'Bản ghi không tồn tại')
  },

  // 删除字体
  async deleteFont(req: any, res: Response) {
    const id = Number(req.body?.id)
    if (!isNumber(id) || id <= 0) {
      send.error(res, 'Tham số không hợp lệ')
      return
    }
    fontsRepo.deleteFont(id) ? send.success(res, undefined) : send.error(res, 'Bản ghi không tồn tại')
  },
}
