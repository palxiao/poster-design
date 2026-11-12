/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-03 19:00:00
 * @Description: 裁剪组件公共方法
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-03 19:00:00
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import i18n from '@/languages'
import { TImageCutoutState } from './index.vue'
import api from '@/api'
import { Ref } from 'vue'
import { cutoutImage } from './helper/useCutout'

/** 选择图片 */
export const selectImageFile = async (state: TImageCutoutState, raw: Ref<HTMLElement | null>, file: File, successCb?: (result: string, fileName: string) => void) => {
  // if (file.size > 1024 * 1024 * 2) {
  //   alert('上传图片超出限制')
  //   return false
  // }
  if (!raw.value) return
  // 显示选择的图片
  raw.value.addEventListener('load', () => {
    state.offsetWidth = (raw.value as HTMLElement).offsetWidth
  })
  state.rawImage = URL.createObjectURL(file)

  // 浏览器端自动抠图（rembg-web + u2netp，无需后端服务）
  const blob = await cutoutImage(file, ({ text, progress }) => {
    state.progressText = progress >= 100 ? '' : text
    state.progress = progress
  })
  if (blob) {
    successCb(URL.createObjectURL(blob), file.name)
  } else {
    state.progressText = ''
    alert(i18n.global.t('business.cutout.failed'))
  }
}

export async function uploadCutPhotoToCloud(cutImage: string) {
  try {
    const response = await fetch(cutImage)
    const buffer = await response.arrayBuffer()
    const file = new File([buffer], `cut_image_${Math.random()}.png`)
    // 上传到自建后端（上传成功会自动记录到"我的上传"）
    const result = await api.material.upload({ file }, () => {})
    return result?.url || ''
  } catch (e) {
    console.error(`upload cut file error: msg: ${e}`)
    return ''
  }
}
