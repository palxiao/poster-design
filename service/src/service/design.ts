/*
 * @Author: ShawnPhang
 * @Date: 2024-05-16 18:25:10
 * @Description: 示例代码，仅供参考
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-17 11:22:42
 */
import { Request, Response } from 'express'
const fs = require('fs')
const path = require('path')
const axios = require('../utils/http.ts')
const multiparty = require('multiparty')
const { filePath } = require('../configs.ts')
const { checkCreateFolder, randomCode, send } = require('../utils/tools.ts')

const FileUrl = 'http://localhost:7001/static/'

module.exports = {
  // design/list 获取模板列表（虚拟）
  async getTemplates(req: any, res: Response) {
    /**
     * @api {get} /design/list 获取模板列表（虚拟）
     * @apiVersion 1.0.0
     * @apiGroup design
     */
    const { cate, type } = req.query
    const tempPath = type == 1 ? `../mock/components/list/${cate}.json` : '../mock/templates/list.json'
    try {
      const list = fs.readFileSync(path.resolve(__dirname, tempPath), 'utf8')
      send.success(res, { list: JSON.parse(list) })
    } catch (error) {}
  },
  // design/temp 获取模板（虚拟）
  async getDetail(req: any, res: Response) {
    /**
     * @api {get} /design/list 获取模板（虚拟）
     * @apiVersion 1.0.0
     * @apiGroup design
     */
    const { cate, type, id } = req.query
    const dPath = type == 1 ? `../mock/components/detail/${id}.json` : `../mock/templates/${id}.json`
    try {
      const detail = fs.readFileSync(path.resolve(__dirname, dPath), 'utf8')
      send.success(res, JSON.parse(detail))
    } catch (error) {}
  },
  // design/material 获取素材（虚拟）
  async getMaterial(req: any, res: any) {
    /**
     * @api {get} /design/material 获取素材（虚拟）
     * @apiVersion 1.0.0
     * @apiGroup design
     */
    const { cate } = req.query
    try {
      const detail = fs.readFileSync(path.resolve(__dirname, `../mock/materials/${cate}.json`), 'utf8')
      send.success(res, { list: JSON.parse(detail) })
    } catch (error) {
      console.log(error)
    }
  },
  // design/imgs 获取照片素材（虚拟）
  async getPhotos(req: any, res: any) {
    /**
     * @api {get} /design/imgs 获取照片素材（虚拟）
     * @apiVersion 1.0.0
     * @apiGroup design
     */
    const { cate } = req.query
    try {
      const detail = fs.readFileSync(path.resolve(__dirname, `../mock/materials/photos/${cate}.json`), 'utf8')
      send.success(res, { list: JSON.parse(detail) })
    } catch (error) {}
  },
  // design/edit 保存模板（虚拟）
  async saveTemplate(req: any, res: any) {
    /**
     * @api {post} /design/edit 保存模板（虚拟）
     * @apiVersion 1.0.0
     * @apiGroup design
     */
    let { id, title, data, width, height, type, cate, tag } = req.body
    const folder = type == 1 ? 'components/detail' : 'templates'
    const listPath = type == 1 ? 'components/list/comp.json' : 'templates/list.json'
    try {
      const isAdd = !id // 是否新增模板
      id = id || randomCode(8)
      const savePath = path.resolve(__dirname, `../mock/${folder}/${id}.json`)
      const jsonData = {
        id,
        data,
        title,
        width,
        height,
      }
      fs.writeFileSync(savePath, JSON.stringify(jsonData))
      // 生成封面
      const size = width > height ? 640 : 320
      const fetchScreenshotUrl = `http://localhost:7001/api/screenshots?tempid=${id}&tempType=${type}&width=${width}&height=${height}&type=cover&size=${size}&quality=75`
      await axios.get(fetchScreenshotUrl, { responseType: 'arraybuffer' })
      // 保存到其他地方可以设置 responseType: 'arraybuffer' 后操作buffer，这里只为了得到封面，发起请求就可以了
      if (isAdd) {
        const listVal = fs.readFileSync(path.resolve(__dirname, `../mock/${listPath}`), 'utf8')
        const list = JSON.parse(listVal)
        const cover = type == 1 ? FileUrl + `/${id}-screenshot.png` : FileUrl + `/${id}-cover.jpg`
        list.unshift({ id, cover, title, width, height })
        fs.writeFileSync(path.resolve(__dirname, `../mock/${listPath}`), JSON.stringify(list))
      }
      send.success(res, { id })
    } catch (error) {
      console.log(error)
    }
  },
}

export {}
