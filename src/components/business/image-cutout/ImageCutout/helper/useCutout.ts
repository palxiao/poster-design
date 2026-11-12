/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import i18n from '@/languages'
import type { BaseSession } from '@bunnio/rembg-web'

/** 抠图进度信息 */
export type TCutoutProgress = {
  text: string
  progress: number
}

/** 进度步骤文案映射 */
const stepText: Record<string, string> = {
  downloading: i18n.global.t('business.cutout.modelDownloading'),
  processing: i18n.global.t('business.cutout.processing'),
  postprocessing: i18n.global.t('business.cutout.postprocessing'),
  complete: '',
}

// 固定使用 u2netp 轻量模型（约 4.7MB，从站点 /models/u2netp.onnx 加载）
const MODEL_NAME = 'u2netp'

// 会话单例：模型只需下载/初始化一次，后续抠图直接复用
let sessionPromise: Promise<BaseSession> | null = null

/** 懒加载 rembg-web 并创建 u2netp 会话（动态引入，避免 onnxruntime 进入主包） */
function loadSession(): Promise<BaseSession> {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      // ORT 默认相对路径在 Vite 下会取到 index.html 导致实例化失败，需显式指向 wasm 运行时目录：
      // - dev：Vite 禁止把 public 目录文件当作 ES 模块 import，改指向 node_modules
      // - prod：用 public/ort/ 下自托管的 ort-wasm-simd-threaded.jsep.{mjs,wasm}（无跨域/CDN 依赖）
      const ort = await import('onnxruntime-web')
      ort.env.wasm.wasmPaths = import.meta.env.DEV ? '/node_modules/onnxruntime-web/dist/' : '/ort/'
      // numThreads 固定为 1：多线程 wasm 依赖跨域隔离（COOP/COEP），单线程下 u2netp 推理约 1s
      const { newSession } = await import('@bunnio/rembg-web')
      return newSession(MODEL_NAME, undefined, { numThreads: 1 })
    })()
    sessionPromise.catch(() => {
      // 失败后允许下次重试
      sessionPromise = null
    })
  }
  return sessionPromise
}

/**
 * 浏览器端自动抠图（rembg-web + u2netp）
 * @returns 抠除背景后的 PNG Blob，失败返回 null
 */
export async function cutoutImage(file: File, onProgress?: (p: TCutoutProgress) => void): Promise<Blob | null> {
  try {
    const [{ remove }, session] = await Promise.all([import('@bunnio/rembg-web'), loadSession()])
    return await remove(file, {
      session,
      onProgress: (info) => {
        onProgress && onProgress({ text: stepText[info.step] ?? info.message, progress: Math.round(info.progress) })
      },
    })
  } catch (e) {
    console.error('cutout error: ', e)
    return null
  }
}
