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
 * 用户相关接口实现
 */
import { Response } from 'express'
import axios from 'axios'
import { send } from '../utils/tools'
import { listUserImages, deleteUserImage } from '../db/userImages'
import * as designsRepo from '../db/designs'
import { getRequestUser } from '../utils/auth'
import { serviceLink, staticLink } from '../configs'

export default {
  async saveDesign(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    const { id, title, data, temp_id, width, height } = req.body || {}
    const w = Number(width); const h = Number(height)
    if (typeof data !== 'string' || !data || !(w > 0) || !(h > 0)) return send.error(res, 'Dữ liệu thiết kế thiếu hoặc không hợp lệ')
    const values = { title: String(title || 'Thiết kế chưa đặt tên'), data, template_id: Number(temp_id) || 0, cover: '', width: w, height: h }
    const designId = Number(id)
    const generateCover = async (savedId: number) => {
      const size = w > h ? 640 : 320
      const token = typeof req.headers.authorization === 'string' ? `&token=${encodeURIComponent(req.headers.authorization)}` : ''
      await axios.get(
        `${serviceLink}/api/screenshots?id=${savedId}&tempType=0&width=${w}&height=${h}&type=cover&size=${size}&quality=75${token}`,
        { responseType: 'arraybuffer' }
      )
      designsRepo.updateDesign(savedId, user.id, { cover: `${staticLink}${savedId}-cover.jpg` })
    }
    if (Number.isInteger(designId) && designId > 0) {
      const existing = designsRepo.getDesign(designId, user.id)
      designsRepo.updateDesign(designId, user.id, { title: values.title, data: values.data, width: w, height: h })
      // 只有封面为空时补生成，已有封面不因普通保存重复生成。
      if (existing && !String(existing.cover || '').trim()) {
        // 封面生成依赖 Puppeteer，异步执行，不能阻塞作品保存响应。
        void generateCover(designId).catch((error) => console.warn('[user] 作品封面生成失败:', error))
      }
      return send.success(res, { id: designId })
    }
    const savedId = designsRepo.createDesign({ user_id: user.id, ...values })
    send.success(res, { id: savedId })
    // 新作品保存成功后再生成封面；截图失败不回滚已保存的作品。
    try {
      await generateCover(savedId)
    } catch (error) {
      console.warn('[user] 作品封面生成失败:', error)
    }
  },
  async getMyDesigns(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    const page = Math.max(1, Number(req.query?.page) || 1); const pageSize = Math.min(100, Math.max(1, Number(req.query?.pageSize) || 20))
    send.success(res, designsRepo.listDesigns(user.id, page, pageSize))
  },
  async getDesign(req: any, res: Response) {
    const user = getRequestUser(req); const id = Number(req.query?.id)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    const design = Number.isInteger(id) && id > 0 ? designsRepo.getDesign(id, user.id) : undefined
    design ? send.success(res, design) : send.error(res, 'Thiết kế không tồn tại')
  },
  async deleteDesign(req: any, res: Response) {
    const user = getRequestUser(req); const id = Number(req.body?.id)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    designsRepo.deleteDesign(id, user.id) ? send.success(res, undefined) : send.error(res, 'Thiết kế không tồn tại')
  },
  // design/user/image 获取用户上传图片列表
  async getUserImages(req: any, res: Response) {
    /**
     * @api {get} /design/user/image 获取用户上传图片列表
     * @apiVersion 1.0.0
     * @apiGroup user
     */
    const user = getRequestUser(req)
    const list = listUserImages(user?.id || 0)
    send.success(res, { list })
  },
  // design/user/image/del 删除用户上传图片记录
  async deleteUserImage(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) return send.error(res, 'Vui lòng đăng nhập')
    const id = Number(req.body?.id)
    deleteUserImage(id, user.id) ? send.success(res, undefined) : send.error(res, 'Ảnh không tồn tại')
  },
}
