/*
 * @Author: ShawnPhang
 * @Date: 2024-05-16 18:25:10
 * @Description: 文件操作示例代码，仅供参考
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 18:52:18
 */
import { Request, Response } from 'express'
const multiparty = require('multiparty')
const { filePath } = require('../configs.ts')
const { checkCreateFolder, randomCode, copyFile, send } = require('../utils/tools.ts')

const FileUrl = 'http://localhost:7001/static/'

module.exports = {
  // api/file/upload 上传接口
  async upload(req: Request, res: Response) {
    /**
     * @api {post} /api/file/upload 上传接口
     * @apiVersion 1.0.0
     * @apiGroup file
     *
     * @apiParam {File} file 二进制文件
     * @apiParam {String} folder 目标文件夹，空为根目录
     * @apiParam {String} name 文件名，默认随机
     *
     * @apiSuccess (__组__) {__类型__} __字段名__ __返回字段说明__
     */
    const form = new multiparty.Form()
    form.parse(req, async function (err: any, fields: any, files: any) {
      if (err) {
        console.error('上传文件出错！')
        return
      }
      if (files) {
        const file = files.file ? files.file[0] : {}
        const { size, headers, originalFilename } = file
        const fileType = headers['content-type'].split('/')[1]
        const Suffix = originalFilename.split('.').pop() || fileType || 'png'
        const { folder = '', name = `${randomCode(12)}.${Suffix}` } = fields
        const folderPath = `${filePath}${folder ? `${folder}/` : ''}`
        checkCreateFolder(folderPath) // 检测对应目录是否存在
        const targetPath = `${folderPath}${name}`
        copyFile(file.path, targetPath)
          .then(() => {
            const url = `${FileUrl}${folder ? folder + '/' : ''}${name}`
            send.success(res, {
              key: `${folder}/${name}`,
              url,
            })
          })
          .catch((err: any) => {
            console.log('上传异常', err)
          })
      }
    })
  },
}

export {}
