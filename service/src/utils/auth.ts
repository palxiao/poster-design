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
 * 认证工具：密码哈希 + HMAC token 签发/校验 + 请求鉴权中间件
 */
import crypto from 'crypto'
import { tokenSecret } from '../configs'
import { countUsers, createUser, findUserByAccount, findUserById } from '../db/users'

const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000 // 7 天

/** sha256(salt + password)，简单可用即可 */
export function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(salt + password).digest('hex')
}

export function createSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', tokenSecret).update(payload).digest('hex')
}

/** 签发 token：base64(payload).hmac，payload 含用户 id、账号与过期时间 */
export function createToken(id: number, account: string): string {
  const payload = Buffer.from(JSON.stringify({ id, account, exp: Date.now() + TOKEN_TTL })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

/** 校验 token，通过返回 payload，失败返回 null */
export function verifyToken(token: string): { id: number; account: string } | null {
  const [payload, signature] = String(token || '').split('.')
  if (!payload || !signature) return null
  try {
    const expected = sign(payload)
    if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof data.id !== 'number' || typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return { id: data.id, account: data.account }
  } catch (e) {
    return null
  }
}

/** 从请求头解析用户，未登录返回 null */
export function getRequestUser(req: any): { id: number; account: string } | null {
  return verifyToken(String(req.headers.authorization || ''))
}

/** 管理员鉴权中间件：未登录 / 非管理员一律 401；reason 供前端区分两种情况，不要依赖 msg 文案 */
export function requireAdmin(req: any, res: any, next: () => void) {
  const user = getRequestUser(req)
  const row = user && findUserById(user.id)
  if (!row || row.role !== 1) {
    res.json({ code: 401, reason: user ? 'forbidden' : 'unauthenticated', msg: user ? 'Bạn không có quyền quản trị' : 'Vui lòng đăng nhập' })
    return
  }
  req.user = user
  next()
}

export interface AuthResult {
  token: string
  account: string
  /** 1 管理员，0 普通用户 */
  role: number
}

/** 注册并签发 token；账号已存在返回 null。首个注册用户自动成为管理员 */
export function register(account: string, password: string): AuthResult | null {
  if (findUserByAccount(account)) return null
  const salt = createSalt()
  const role = countUsers() === 0 ? 1 : 0
  const id = createUser(account, hashPassword(password, salt), salt, role)
  return { token: createToken(id, account), account, role }
}

/** 登录校验，成功签发 token，失败返回 null */
export function login(account: string, password: string): AuthResult | null {
  const user = findUserByAccount(account)
  if (!user) return null
  if (hashPassword(password, user.salt) !== user.password) return null
  return { token: createToken(user.id, account), account: user.account, role: user.role }
}
