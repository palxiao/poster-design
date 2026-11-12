/*
 * @Author: ShawnPhang
 * @Date: 2026-08-31 20:11:18
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2026-09-01 18:52:24
 */
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
 * 数据库基础初始化：只创建可配置的首个管理员，不导入旧版 mock 业务数据。
 */
import crypto from 'crypto'

function createSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(salt + password).digest('hex')
}

/**
 * 把内置示例数据的中文名称迁移为越南语（Việt hóa）。
 * 只匹配与内置默认值完全相同的名称，管理员自行改过的名称不会被覆盖；可重复执行。
 */
function localizeDefaultNames(db: any): void {
  const assetNames: [string, string, string][] = [
    ['materials', '贴纸，图片类型', 'Sticker, loại hình ảnh'],
    ['materials', 'SVG矢量元素，可改色', 'Phần tử vector SVG, có thể đổi màu'],
    ['materials', '容器Mask，图形遮罩', 'Khung chứa Mask, mặt nạ hình'],
    ['photos', '商务', 'Doanh nghiệp'],
    ['photos', '风景', 'Phong cảnh'],
    ['photos', '人文', 'Nhân văn'],
  ]
  const templateCategoryNames: [number, string, string][] = [
    [0, '测试分类', 'Danh mục thử nghiệm'],
    [1, '测试组件', 'Component thử nghiệm'],
  ]
  const templateTitles: [string, string][] = [
    ['穿搭品牌文字组合', 'Bộ chữ thương hiệu thời trang'],
    ['自设计模板', 'Mẫu tự thiết kế'],
  ]
  const run = db.transaction(() => {
    const renameAsset = db.prepare('UPDATE asset_categories SET name = ? WHERE type = ? AND name = ?')
    assetNames.forEach(([type, from, to]) => renameAsset.run(to, type, from))
    const targetExists = db.prepare('SELECT 1 FROM template_categories WHERE type = ? AND name = ?')
    const renameCategory = db.prepare('UPDATE template_categories SET name = ? WHERE type = ? AND name = ?')
    const renameTemplateCate = db.prepare('UPDATE templates SET cate = ? WHERE type = ? AND cate = ?')
    templateCategoryNames.forEach(([type, from, to]) => {
      if (targetExists.get(type, to)) return
      renameCategory.run(to, type, from)
      renameTemplateCate.run(to, type, from)
    })
    const renameTitle = db.prepare('UPDATE templates SET title = ? WHERE title = ?')
    templateTitles.forEach(([from, to]) => renameTitle.run(to, from))
  })
  run()
}

/** Font hỗ trợ tiếng Việt, file woff2 nằm ở service/seed/static/fonts (id cố định vì font mặc định của widget văn bản tham chiếu id 100) */
function ensureVietnameseFonts(db: any): void {
  const fonts = [
    { id: 100, alias: 'Be Vietnam Pro', value: 'be-vietnam-pro', woff: '/static/fonts/be-vietnam-pro-400.woff2', size: 27648 },
    { id: 101, alias: 'Be Vietnam Pro Bold', value: 'be-vietnam-pro-bold', woff: '/static/fonts/be-vietnam-pro-700.woff2', size: 29340 },
  ]
  const exists = db.prepare('SELECT 1 FROM fonts WHERE value = ?')
  const insert = db.prepare("INSERT INTO fonts (id, alias, value, woff, lang, woff_size) VALUES (@id, @alias, @value, @woff, 'en', @size)")
  fonts.forEach((font) => {
    if (!exists.get(font.value)) insert.run(font)
  })
}

/** 仅在全新数据库中创建管理员；已有数据库不会覆盖任何账号。 */
export default function bootstrapDatabase(db: any): void {
  const categoryDefaults = [
    ['png', 'Sticker, loại hình ảnh', 'materials'],
    ['svg', 'Phần tử vector SVG, có thể đổi màu', 'materials'],
    ['mask', 'Khung chứa Mask, mặt nạ hình', 'materials'],
  ]
  const insertCategory = db.prepare('INSERT OR IGNORE INTO asset_categories (cate, name, type) VALUES (?, ?, ?)')
  categoryDefaults.forEach((item) => insertCategory.run(item[0], item[1], item[2]))
  const existing = db.prepare('SELECT cate FROM materials').all()
  existing.forEach((row: { cate: string }) => insertCategory.run(row.cate, row.cate, 'materials'))
  const existingPhotos = db.prepare('SELECT cate FROM photos').all()
  existingPhotos.forEach((row: { cate: string }) => insertCategory.run(row.cate, row.cate, 'photos'))
  localizeDefaultNames(db)
  ensureVietnameseFonts(db)

  const userCount = Number(db.prepare('SELECT COUNT(*) AS n FROM users').get()?.n || 0)
  if (userCount > 0) return

  const account = String(process.env.DEFAULT_ADMIN_ACCOUNT || 'admin').trim()
  const password = String(process.env.DEFAULT_ADMIN_PASSWORD || '123456')
  if (!account || password.length < 6) {
    console.warn('[db:bootstrap] 默认管理员配置无效，请设置 DEFAULT_ADMIN_ACCOUNT / DEFAULT_ADMIN_PASSWORD')
    return
  }
  const salt = createSalt()
  db.prepare('INSERT INTO users (account, password, salt, role) VALUES (?, ?, ?, 1)')
    .run(account, hashPassword(password, salt), salt)
  console.log(`[db:bootstrap] 默认管理员已创建：${account}`)
}
