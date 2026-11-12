/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description: 服务端截图
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-17 11:23:58
 */
import { saveScreenshot } from '../utils/download-single'
import uuid from '../utils/uuid'
import { filePath, upperLimit, drawLink } from '../configs'
import { queueRun, queueList } from '../utils/node-queue'
// const path = require('path')

/**
 * @api {get} api/screenshots 截图
 * @apiVersion 1.0.0
 * @apiGroup screenShot
 *
 * @apiParam {String|Number} id (可选) 截图id，高优先级
 * @apiParam {String|Number} tempid (可选) 模板id，低优先级，无id时取该值
 * @apiParam {String|Number} tempType (可选) 区分模板和组件类型，临时用
 * @apiParam {String} width (必传)视窗大小
 * @apiParam {String} height (必传)视窗大小
 * @apiParam {String} screenshot_url 可选
 * @apiParam {String} type 可选, file正常截图返回，cover封面生成，默认file
 * @apiParam {String} size 可选, 按比例缩小到宽度
 * @apiParam {String} quality 可选, 质量
 * @apiParam {String|Number} index 可选, 下载哪个画板
 */
export async function screenshots(req: any, res: any) {
  let { id, tempid, tempType, width, height, screenshot_url, type = 'file', size, quality, index = 0 } = req.query
  id == 'undefined' && (id = null)
  const url = (screenshot_url || drawLink) + `${id ? '?id=' : '?tempid='}`
  id = id || tempid
  const path = filePath + `${id}-screenshot.png`
  const thumbPath = type === 'cover' && tempType != 1 ? filePath + `${id}-cover.jpg` : null

  if (id && width && height) {
    if (queueList.length > upperLimit) {
      res.json({ code: 200, msg: 'Máy chủ đang quá tải, vui lòng thử lại sau~' })
      return
    }
    const renderToken = typeof req.query.token === 'string' ? `&token=${encodeURIComponent(req.query.token)}` : ''
    const targetUrl = url + id + `${tempType ? '&tempType=' + tempType : ''}` + `&index=${index}${renderToken}`
    // /draw 会在模板、图片和字体完成加载后主动调用 loadFinishToInject；
    // 禁止 load 事件提前截图，否则会得到空白页面。
    queueRun(saveScreenshot, targetUrl, { width, height, path, thumbPath, size, quality, prevent: true })
      .then(() => {
        res.setHeader('Content-Type', 'image/jpg')
        // const stats = fs.statSync(path)
        // res.setHeader('Cache-Control', stats.size)
        // 组件模板不生成 JPG 缩略图，cover 请求直接返回 PNG 截图，避免 sendFile(null)。
        type === 'file' || !thumbPath ? res.sendFile(path) : res.sendFile(thumbPath)
      })
      .catch((e: any) => {
        res.json({ code: 500, msg: 'Lỗi khi tạo ảnh' })
      })
  } else {
    res.json({ code: 500, msg: 'Thiếu tham số, vui lòng kiểm tra' })
  }
}

/**
 * @api {get} api/printscreen 全屏网页截图
 * @apiVersion 1.0.0
 * @apiGroup screenShot
 *
 * @apiParam {String} url (必传) 目标网页link
 * @apiParam {String} width (可选) 视窗大小
 * @apiParam {String} height (可选) 视窗大小
 * @apiParam {Boolean} prevent (可选, 默认false) true: 阻止立即截图，使用注入函数接管
 * @apiParam {String} type (可选, 默认file) file: 返回二进制文件，cover: 立即返回地址(path, thumbPath)
 * @apiParam {String} size 可选 (只在type=cover生效, eg:300，等比缩放到300像素宽）传该值时会额外产生小图（封面，格式jpeg）
 * @apiParam {String} quality 可选 (只在有size生效, eg:75)，压缩质量:1-100，质量越小图片占用空间越小
 * @apiParam {Number} wait (可选) 截图前的等待时间，单位 ms
 * @apiParam {String} ua (可选) 模拟设备 eg: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
 * @apiParam {String} devices (可选) 套用设备预设，传该值则ua、width、height均会失效。eg: iPhone 6 所有预设：/src/utils/widget/Device.js
 * @apiParam {Number} scale (可选) 针对移动端的设备像素比(DPR) 整型范围 1~4，默认1
 */
export async function printscreen(req: any, res: any) {
  
  let { width = 375, height = 0, url, type = 'file', size, quality, prevent = false, ua, devices, scale, wait } = req.query
  const path = filePath + `screenshot_${new Date().getTime()}_${uuid()}.png`
  const thumbPath = type === 'cover' ? path.replace('.png', '.jpg') : null

  if (url) {
    const sign = `${new Date().getTime()}_${uuid()}`
    req._queueSign = sign
    // console.log(url + id, path, thumbPath);
    if (queueList.length > upperLimit) {
      res.json({ code: 200, msg: 'Hệ thống đang bận, vui lòng thử lại sau~' })
      return
    }
    queueRun(saveScreenshot, url, { width, height, path, thumbPath, size, quality, prevent, ua, devices, scale, wait }, sign)
      .then(() => {
        if (!res.headersSent) {
          // res.setHeader('Content-Type', 'image/jpg')
          // const stats = fs.statSync(path)
          // res.setHeader('Cache-Control', stats.size)
          res.json({ code: 200, msg: 'Chụp ảnh thành công', data: { path, thumbPath } })
        } else {
          res.json({ code: 200, msg: 'ok' })
        }
      })
      .catch((e: any) => {
        res.json({ code: 500, msg: 'Lỗi khi tạo ảnh!' })
      })
  } else {
    res.json({ code: 500, msg: 'Thiếu tham số, vui lòng kiểm tra' })
  }
}

export default { printscreen, screenshots }
