/*
 * @Author: ShawnPhang
 * @Date: 2021-08-29 20:35:31
 * @Description: 七牛上传方法
 * @LastEditors: ShawnPhang <site: book.palxp.com>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-02 11:50:00
 */
import dayjs from 'dayjs'
import api from '@/api/album'

interface Options {
  bucket: string
  prePath?: string
  fullPath?: string
}

export default {
  upload: async (file: File | Blob, options: Options, cb?: IQiniuSubscribeCb) => {
    const win = window
    let name = ''
    const suffix = file.type.split('/')[1] || 'png' // 文件后缀
    if (!options.fullPath) {
      // const DT: any = await exifGetTime(file) // 照片时间
      const DT = new Date()
      const YM = `${dayjs(DT).format('YYYY')}/${dayjs(DT).format('MM')}/` // 文件时间分类
      const keyName = YM + new Date(DT).getTime()
      const prePath = options.prePath ? options.prePath + '/' : ''
      name = `${prePath}${keyName}` + `.${suffix}` // 文件名
    } else name = options.fullPath + `.${suffix}` // 文件名
    const token = await api.getToken({ bucket: options.bucket, name })
    const exOption = {
      useCdnDomain: true, // 使用cdn加速
    }
    const observable = win.qiniu.upload(file, name, token, {}, exOption)
    return new Promise((resolve: IQiniuSubscribeCb, reject: (err: string) => void) => {
      observable.subscribe({
        next: (result) => {
          cb?.(result) // result.total.percent -> 展示进度
        },
        error: (e) => {
          reject(e)
        },
        complete: (result) => {
          resolve(result)
          // cb && cb(result) // result.total.percent -> 展示进度
        },
      })
    })
  },
}

// function exifGetTime(img: any) {
//   const win = window as any
//   return new Promise((resolve) => {
//     const file = img.originFileObj || img
//     win.EXIF.getData(file, function() {
//       const DT = win.EXIF.getAllTags(this).DateTimeOriginal || win.EXIF.getAllTags(this).DateTime
//       if (DT) {
//         if (DT.split(' ').length > 1) {
//           const date = DT.split(' ')[0].replace(/:/g, '/')
//           const time = DT.split(' ')[1]
//           resolve(dayjs(`${date} ${time}`).isValid() ? `${date} ${time}` : date)
//         } else {
//           resolve(DT)
//         }
//       } else {
//         resolve(new Date())
//       }
//     })
//   })
// }
