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
 * SQLite 连接与初始化（better-sqlite3）
 * 数据库为单文件：service/data/poster.db（已 gitignore）
 */
import fs from 'fs'
import path from 'path'
const Database = require('better-sqlite3')
import bootstrapDatabase from './bootstrap'

let instance: any = null

export function getDB(): any {
  if (!instance) {
    throw new Error('Cơ sở dữ liệu chưa được khởi tạo, hãy gọi initDB() trước')
  }
  return instance
}

/** 初始化数据库：建表、迁移并创建必要的系统账号。应在服务启动时最先调用 */
export function initDB(): void {
  if (instance) return
  const dbDir = path.resolve(process.cwd(), 'data')
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  instance = new Database(path.join(dbDir, 'poster.db'))
  instance.pragma('journal_mode = WAL')
  createTables(instance)
  bootstrapDatabase(instance)
}

function createTables(db: any): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      cover TEXT NOT NULL DEFAULT '',
      width REAL NOT NULL DEFAULT 0,
      height REAL NOT NULL DEFAULT 0,
      state INTEGER NOT NULL DEFAULT 1,
      type INTEGER NOT NULL DEFAULT 0,
      cate TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS materials (
      cate TEXT PRIMARY KEY,
      list TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS photos (
      cate TEXT PRIMARY KEY,
      list TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS asset_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cate TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      UNIQUE(type, cate)
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      salt TEXT NOT NULL,
      role INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS user_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 0,
      url TEXT NOT NULL,
      width REAL NOT NULL DEFAULT 0,
      height REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS fonts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alias TEXT NOT NULL DEFAULT '',
      value TEXT NOT NULL DEFAULT '',
      preview TEXT NOT NULL DEFAULT '',
      woff TEXT NOT NULL DEFAULT '',
      ttf TEXT NOT NULL DEFAULT '',
      lang TEXT NOT NULL DEFAULT 'zh',
      font_family TEXT NOT NULL DEFAULT '',
      size REAL NOT NULL DEFAULT 0,
      woff_size REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS template_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type INTEGER NOT NULL DEFAULT 0,
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      template_id INTEGER NOT NULL DEFAULT 0,
      title TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL DEFAULT '{}',
      cover TEXT NOT NULL DEFAULT '',
      width REAL NOT NULL DEFAULT 0,
      height REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS ai_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `)
  const categoryColumns: { name: string }[] = db.prepare('PRAGMA table_info(template_categories)').all()
  if (categoryColumns.some((column) => column.name === 'value')) {
    db.exec(`CREATE TABLE template_categories_new (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, type INTEGER NOT NULL DEFAULT 0, sort INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')));
      INSERT INTO template_categories_new (id, name, type, sort, created_at) SELECT id, name, type, sort, created_at FROM template_categories;
      DROP TABLE template_categories;
      ALTER TABLE template_categories_new RENAME TO template_categories;`)
  }
  migrateTables(db)
}

/** 老库迁移：补 role 列；保证至少存在一个管理员（最早的账号提升为管理员） */
function migrateTables(db: any): void {
  const cols: { name: string }[] = db.prepare(`PRAGMA table_info(users)`).all()
  if (!cols.some((c) => c.name === 'role')) {
    db.prepare(`ALTER TABLE users ADD COLUMN role INTEGER NOT NULL DEFAULT 0`).run()
  }
  const imageCols: { name: string }[] = db.prepare('PRAGMA table_info(user_images)').all()
  if (!imageCols.some((c) => c.name === 'user_id')) db.prepare('ALTER TABLE user_images ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0').run()
  const admin = db.prepare(`SELECT id FROM users WHERE role = 1 LIMIT 1`).get()
  if (!admin) {
    db.prepare(`UPDATE users SET role = 1 WHERE id = (SELECT MIN(id) FROM users)`).run()
  }
}

export default { initDB, getDB }
