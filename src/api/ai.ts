/*
 * @Author: ShawnPhang
 * @Date: 2021-08-27 14:42:15
 * @Description: AI相关接口
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @Date: 2024-03-03 19:00:00
 */
import fetch from '@/utils/axios'

export type TCommonUploadCb = (up: number, dp: number) => void

type TUploadProgressCbData = {
  loaded: number
  total: number
}

export type TUploadErrorResult = {type: "application/json"}

// 上传接口
export const upload = (file: File, cb: TCommonUploadCb) => {
  const formData = new FormData()
  formData.append('file', file)
  const extra = {
    responseType: 'blob',
    onUploadProgress: (progress: TUploadProgressCbData) => {
      cb(Math.floor((progress.loaded / progress.total) * 100), 0)
    },
    onDownloadProgress: (progress: TUploadProgressCbData) => {
      cb(100, Math.floor((progress.loaded / progress.total) * 100))
    },
  }
  return fetch<MediaSource | TUploadErrorResult>('https://res.palxp.cn/ai/upload', formData, 'post', {}, extra)
}
