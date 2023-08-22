/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-17 18:03:13
 */
const { saveScreenshot } = require('../utils/download-single.ts')
const { filePath, upperLimit } = require('../configs.ts')
const { queueRun, queueList } = require('../utils/node-queue.ts')
// const path = require('path')
const fs = require('fs')

module.exports = {
  async getImg(req: any, res: any) {
    /**
     * @api {get} api/get_img 获取图片
     * @apiVersion 1.0.0
     * @apiGroup screenShot
     *
     * @apiParam {String|Number} id (必传) 截图id
     * @apiParam {String} type 可选, file源文件，cover封面图
     */
    
    const isDev = process.env.NODE_ENV === 'development'
    let { id, type = 'file' } = req.query
    const path = filePath + `${id}-screenshot.png`
    const thumbPath = type === 'cover' ? filePath + `${id}-cover.jpg` : null

    if (id) {
      try {
        fs.statSync(path)
        res.setHeader('Content-Type', 'image/jpg')
        type === 'file' ? res.sendFile(path) : res.sendFile(thumbPath)
      } catch (error) {
        res.json({ code: 500, msg: '请求图片不存在' })
      }
    } else {
      res.json({ code: 500, msg: '缺少参数，请检查' })
    }
  },
  async screenshots(req: any, res: any) {
    /**
     * @api {get} api/screenshots 截图
     * @apiVersion 1.0.0
     * @apiGroup screenShot
     *
     * @apiParam {String|Number} id (可选) 截图id，高优先级
     * @apiParam {String|Number} tempid (可选) 模板id，低优先级，无id时取该值
     * @apiParam {String} width (必传)视窗大小
     * @apiParam {String} height (必传)视窗大小
     * @apiParam {String} screenshot_url 可选
     * @apiParam {String} type 可选, file正常截图返回，cover封面生成，默认file
     * @apiParam {String} size 可选, 按比例缩小到宽度
     * @apiParam {String} quality 可选, 质量
     */
    
    const isDev = process.env.NODE_ENV === 'development'
    let { id, tempid, width, height, screenshot_url, type = 'file', size, quality } = req.query
    const defaultUrl = isDev ? 'http://localhost:3000/draw' : 'https://design.palxp.com/draw'
    const url = (screenshot_url || defaultUrl) + `${id ? '?id=' : '?tempid='}`
    id = id || tempid
    const path = filePath + `${id}-screenshot.png`
    const thumbPath = type === 'cover' ? filePath + `${id}-cover.jpg` : null

    if (id && width && height) {
      if (queueList.length > upperLimit) {
        res.json({ code: 200, msg: '服务器表示顶不住啊，等等再来吧~' })
        return
      }
      // console.log(url + id, path, thumbPath);
      queueRun(saveScreenshot, url + id, { width, height, path, thumbPath, size, quality })
        .then(() => {
          res.setHeader('Content-Type', 'image/jpg')
          // const stats = fs.statSync(path)
          // res.setHeader('Cache-Control', stats.size)
          type === 'file' ? res.sendFile(path) : res.sendFile(thumbPath)
        })
        .catch((e: any) => {
          res.json({ code: 500, msg: '图片生成错误' })
        })
    } else {
      res.json({ code: 500, msg: '缺少参数，请检查' })
    }
  },
  async printscreen(req: any, res: any) {
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
    let { width = 375, height = 0, url, type = 'file', size, quality, prevent = false, ua, devices, scale, wait } = req.query
    const path = filePath + `screenshot_${new Date().getTime()}.png`
    const thumbPath = type === 'cover' ? path.replace('.png', '.jpg') : null

    if (url) {
      const sign = new Date().getTime() + ''
      req._queueSign = sign
      // console.log(url + id, path, thumbPath);
      if (queueList.length > upperLimit) {
        res.json({ code: 200, msg: '业务繁忙，等等再来吧~' })
        return
      }
      queueRun(saveScreenshot, url, { width, height, path, thumbPath, size, quality, prevent, ua, devices, scale, wait }, sign)
        .then(() => {
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'image/jpg')
            // const stats = fs.statSync(path)
            // res.setHeader('Cache-Control', stats.size)
            type === 'file' ? res.sendFile(path) : res.sendFile(thumbPath)
          }
        })
        .catch((e: any) => {
          res.json({ code: 500, msg: '图片生成错误!' })
        })
    } else {
      res.json({ code: 500, msg: '缺少参数，请检查' })
    }
  },
}

export {}
