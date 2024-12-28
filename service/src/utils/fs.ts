/*
 * @Author: ShawnPhang
 * @Date: 2024-05-28 17:10:51
 * @Description: 文件操作相关方法
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 06:29:58
 */
import fs from 'fs'
import path from 'path'
import imageSize from 'image-size'
import { filePath as StaticPath } from '../configs'
const FileUrl = 'http://localhost:7001/static/'

export function copyFile(sourceFile: string, destinationFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourceFile)
    const writeStream = fs.createWriteStream(destinationFile)

    readStream.on('error', (err: any) => {
      reject(err)
    })

    writeStream.on('error', (err: any) => {
      reject(err)
    })

    writeStream.on('finish', () => {
      resolve()
    })

    readStream.pipe(writeStream)
  })
}

// 读取目录
export function filesReader(directoryPath: string) {
  return new Promise((resolve) => {
    try {
      const files = fs.readdirSync(StaticPath + directoryPath)
      const filesArray: any = []
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file)
        // const stats = fs.statSync(filePath);
        const { width, height } = imageSize(StaticPath + filePath)
        if (file !== '.DS_Store') {
          const fileInfo = {
            width,
            height,
            // filename: file,
            // link: FileUrl + directoryPath,
            url: `${FileUrl + directoryPath}/${file}`,
            // filepath: StaticPath + filePath
            // size: stats.size, // 文件大小
            // modified: stats.mtime // 最后修改时间
          }
          filesArray.push(fileInfo)
        }
      })
      // JSON.stringify(filesArray, null, 2)
      resolve(filesArray)
    } catch (err) {
      console.error('Error reading directory:', err)
    }
  })
}

// 读取文件
export function readFile(directoryPath: string) {
  return new Promise((resolve) => {
    try {
      resolve(fs.readFileSync(StaticPath + directoryPath, 'utf8'))
    } catch (err) {
      console.error('Error reading file:', err)
    }
  })
}

export default {
  copyFile,
  filesReader,
  readFile,
}