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
 * 用户注册 / 登录接口实现
 */
import { Response } from 'express'
import { send } from '../utils/tools'
import { login, register, getRequestUser, hashPassword, createSalt } from '../utils/auth'
import { findUserById, updatePassword } from '../db/users'

export default {
  // 注册账号，成功返回 token
  async register(req: any, res: Response) {
    const { account, password } = req.body || {}
    if (typeof account !== 'string' || !account.trim() || typeof password !== 'string' || password.length < 6) {
      send.error(res, 'Tài khoản không được để trống, mật khẩu tối thiểu 6 ký tự')
      return
    }
    const result = register(account.trim(), password)
    if (!result) {
      send.error(res, 'Tài khoản đã tồn tại')
      return
    }
    send.success(res, result)
  },

  // 登录，成功返回 token
  async login(req: any, res: Response) {
    const { account, password } = req.body || {}
    const result = login(String(account || ''), String(password || ''))
    if (!result) {
      send.error(res, 'Sai tài khoản hoặc mật khẩu')
      return
    }
    send.success(res, result)
  },

  // 修改密码：校验原密码后更新，成功返回无内容
  async changePassword(req: any, res: Response) {
    const user = getRequestUser(req)
    if (!user) {
      send.error(res, 'Vui lòng đăng nhập')
      return
    }
    const { oldPassword, newPassword } = req.body || {}
    if (typeof oldPassword !== 'string' || !oldPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      send.error(res, 'Mật khẩu cũ không được để trống, mật khẩu mới tối thiểu 6 ký tự')
      return
    }
    const row = findUserById(user.id)
    if (!row || hashPassword(oldPassword, row.salt) !== row.password) {
      send.error(res, 'Mật khẩu cũ không đúng')
      return
    }
    const salt = createSalt()
    updatePassword(user.id, hashPassword(newPassword, salt), salt)
    send.success(res, undefined)
  },
}
