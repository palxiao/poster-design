/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-03 19:00:00
 * @Description: 裁剪组件公共方法
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-03 19:00:00
 */

import Qiniu from '@/common/methods/QiNiu'
import { TCommonUploadCb, TUploadErrorResult } from '@/api/ai'
import { TImageCutoutState } from './index.vue'
import api from '@/api'
import { getImage } from '@/common/methods/getImgDetail'
import _config from '@/config'
import { Ref } from 'vue'

/** 选择图片 */
export const selectImageFile = async (state: TImageCutoutState, raw: Ref<HTMLElement | null>, file: File, successCb?: (result: MediaSource, fileName: string) => void, uploadCb?: TCommonUploadCb) => {
  // if (file.size > 1024 * 1024 * 2) {
  //   alert('上传图片超出限制')
  //   return false
  // }
  if (!raw.value) return
  // 显示选择的图片
  raw.value.addEventListener('load', () => {
    state.offsetWidth = (raw.value as HTMLElement).offsetWidth
  })
  // TODO: 模拟演示
  state.rawImage = 'https://pic.imgdb.cn/item/65222530c458853aefb0adeb.webp' // URL.createObjectURL(file)

  // 返回抠图结果
  // const result = await api.ai.upload(file, (up: number, dp: number) => {
  //   uploadCb && uploadCb(up, dp)
  //   if (dp) {
  //     state.progressText = dp === 100 ? '' : '导入中..'
  //     state.progress = dp
  //   } else {
  //     state.progressText = up < 100 ? '上传中..' : '正在处理，请稍候..'
  //     state.progress = up < 100 ? up : 0
  //   }
  // })
  // if (typeof result == 'object' && (result as TUploadErrorResult).type !== 'application/json') {
  // successCb && successCb(result as MediaSource, file.name)
  // } else alert('服务器繁忙，请稍等下重新尝试~')
  successCb('', file.name)
}

export async function uploadCutPhotoToCloud(cutImage: string) {
  try {
    const response = await fetch(cutImage)
    const buffer = await response.arrayBuffer()
    const file = new File([buffer], `cut_image_${Math.random()}.png`)
    // upload
    const qnOptions = { bucket: 'xp-design', prePath: 'user' }
    const result = await Qiniu.upload(file, qnOptions)
    const { width, height } = await getImage(file)
    const url = _config.IMG_URL + result.key
    await api.material.addMyPhoto({ width, height, url })
    return url
  } catch (e) {
    console.error(`upload cut file error: msg: ${e}`)
    return ''
  }
}
