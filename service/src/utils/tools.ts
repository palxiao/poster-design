/*
 * @Author: ShawnPhang
 * @Date: 2024-05-11 02:26:55
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 13:48:40
 */
import fs from 'fs'
import path from 'path'
import { filesReader, copyFile, readFile } from './fs'

export const send = {
  success: (res: any, result: any, msg: string = 'ok') => {
    res.json({
      code: 200,
      msg,
      result: result || undefined,
    })
  },
  error: (res: any, msg: string = 'error') => {
    res.json({
      code: 400,
      msg,
    })
  },
}
export const isNumber = (value: any) => {
  return typeof value === 'number' && !isNaN(value)
}

export const buildTree = (data: any[]) => {}

export const groupBy = (array: any[], property: any) => {}

// 检测目录并创建目录（支持深层级）
export const checkCreateFolder = (folder: string) => {
  try {
    const pathArr = splitPath(folder)
    let _path = ''
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i]) {
        _path += `/${pathArr[i]}`
        !fs.existsSync(_path) && fs.mkdirSync(_path)
      }
    }
  } catch (e) {}
}

// 检测文件
export const checkCreateFile = (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '')
    }
  } catch (e) {
    fs.writeFileSync(filePath, '')
  }
}

// 生成随机码
export const randomCode = (length = 5) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }
  return result
}

// 取数组差集
export const findDifference = (a: any, b: any) => {
  return a.concat(b).filter((v: any) => !a.includes(v) || !b.includes(v))
}

export { copyFile, readFile, filesReader }

/**
 * 将路径切割为数组
 * @param dirPath
 * @returns Array
 */
function splitPath(dirPath: string) {
  const normalizedPath = path.normalize(dirPath)
  const separator = path.sep
  return normalizedPath.split(separator)
}

