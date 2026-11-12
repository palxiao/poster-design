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
 * 文件上传接口实现：文件落盘 static 目录，记录写入 SQLite
 */
import { Request, Response } from 'express'
import imageSize from 'image-size'
import multiparty from 'multiparty'
import { filePath, staticLink } from '../configs'
import { checkCreateFolder, randomCode, copyFile, send } from '../utils/tools'
import { addUserImage } from '../db/userImages'
import { getRequestUser } from '../utils/auth'

// api/file/upload 上传接口
export async function upload(req: Request, res: Response) {
  /**
   * @api {post} /api/file/upload 上传接口
   * @apiVersion 1.0.0
   * @apiGroup file
   *
   * @apiParam {File} file 二进制文件
   * @apiParam {String} folder 目标文件夹，空为根目录
   * @apiParam {String} name 文件名，默认随机
   */
  const form = new multiparty.Form()
  form.parse(req as any, async function (err: any, fields: any, files: any) {
    if (err) {
      console.error('上传文件出错！')
      return send.error(res, 'Lỗi khi tải tệp lên')
    }
    const file = files && files.file ? files.file[0] : null
    if (!file || !file.path) {
      return send.error(res, 'Thiếu tệp')
    }
    const { headers, originalFilename } = file
    const fileType = (headers['content-type'] || '').split('/')[1]
    const suffix = String(originalFilename).split('.').pop() || fileType || 'png'
    const rawName = fields && fields.name ? fields.name[0] : ''
    // 文件名做基础清洗，避免路径拼接异常
    const name = rawName ? String(rawName).replace(/[\\/]/g, '') : `${randomCode(12)}.${suffix}`
    const folder = fields && fields.folder ? String(fields.folder[0]).replace(/\.\./g, '') : ''
    const folderPath = `${filePath}${folder ? `${folder}/` : ''}`
    checkCreateFolder(folderPath)
    const targetPath = `${folderPath}${name}`
    try {
      await copyFile(file.path, targetPath)
    } catch (e) {
      console.error('上传异常', e)
      return send.error(res, 'Lưu tệp thất bại')
    }

    const url = `${staticLink}${folder ? folder + '/' : ''}${name}`
    // 记录入库；非图片文件读取不到尺寸，则不入用户图片列表
    try {
      const size = imageSize(targetPath)
      const width = Number(size.width)
      const height = Number(size.height)
      if (width > 0 && height > 0) {
        addUserImage(getRequestUser(req)?.id || 0, url, width, height)
      }
    } catch (e) {}

    send.success(res, {
      key: `${folder}/${name}`,
      url,
    })
  })
}

export default { upload }
