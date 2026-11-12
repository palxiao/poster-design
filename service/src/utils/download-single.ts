/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 14:47:22
 * @Description: 下载图片（单浏览器版，适用于低配置服务器）
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2026-08-31 21:39:37
 */
const isDev = process.env.NODE_ENV === 'development'
const puppeteer = require('puppeteer')
const sharp = require('sharp')
const { executablePath } = require('../configs.ts')
const forceTimeOut = 60 // 强制超时时间，单位：秒
// 4K规格，总计约830万像素 3840 * 2160 2K规格，总计约830万像素 2048 * 1080
// const maxPXs = 8294400 
const maxPXs = 4211840 // 超出此规格会触发限制器降低dpr，节省服务器资源
const maximum = 5000 // 最大宽高限制，超过截断以防止服务崩溃

export const saveScreenshot = async (url: string, { path, width, height, thumbPath, size = 0, quality = 0, prevent, ua, devices, scale, wait }: any) => {
  return new Promise(async (resolve: Function, reject: Function) => {
    let isPageLoad = false
    let browser: any = null
    // 格式化浏览器宽高
    width = Number(width).toFixed(0)
    height = Number(height).toFixed(0)

    const puppeteerArgs = {
      old: ['–no-first-run', '--no-sandbox', '--disable-setuid-sandbox', `--window-size=${width},${height}`, '–single-process', '–disable-gpu', '–no-zygote', '–disable-dev-shm-usage'],
      new: [ '–no-first-run', '--no-sandbox', '--disable-setuid-sandbox', `--window-size=${width},${height}` ]
    }
    // 启动浏览器
    try {
      browser = await puppeteer.launch({
        headless: true, // !isDev,
        executablePath,
        ignoreHTTPSErrors: true, // 忽略https安全提示
        args: puppeteerArgs.old, // 如puppeteer版本v20+报错请尝试使用新参数
        defaultViewport: null,
      })
    } catch (error) {
      console.log('Puppeteer Error: ', error, '窗口大小：', width, height);
    }
    if (!browser) {
      reject()
      return false
    }
    const regulators = setTimeout(() => {
      browser && browser.close()
      browser = null
      console.log('超时强制释放浏览器')
      reject(new Error('Chụp ảnh quá thời gian, trang chưa render xong'))
    }, forceTimeOut * 1000)

    // 打开页面
    const page = await browser.newPage()
    // 设置浏览器视窗
    function limiter(w: number, h: number) {
      return w*h < maxPXs ? 1 : +(1/(w*h) * maxPXs).toFixed(2)
    }
    page.setViewport({
      width: Number(width) > maximum ? 5000 : Number(width),
      height: Number(height) > maximum ? 5000 : Number(height),
      deviceScaleFactor: !isNaN(scale) ? (+scale > 4 ? 4 : +scale) : limiter(Number(width), Number(height)),
    })
    ua && page.setUserAgent(ua)
    if (devices) {
      devices = puppeteer.devices[devices]
      devices && (await page.emulate(devices))
    }
    // 自动模式下页面加载完毕立即截图
    if (!prevent) {
      page.on('load', async () => {
        await autoScroll()
        await sleep(wait)
        // await waitTillHTMLRendered(page)
        await page.screenshot({ path, fullPage: true })
        // 关闭浏览器
        await browser.close()
        browser = null
        await compress()
        clearTimeout(regulators)
        resolve()
      })
    }
    // 主动模式下注入全局方法
    await page.exposeFunction('loadFinishToInject', async () => {
      // console.log('-> 开始截图')
      // await page.evaluate(() => document.body.style.background = 'transparent');
      await page.screenshot({ path, omitBackground: true })
      // 关闭浏览器
      browserClose()
      await compress()
      // console.log('浏览器已释放');
      clearTimeout(regulators)
      resolve()
    })

    // 地址栏输入网页地址
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    isPageLoad = true

    // 压缩图片
    async function compress() {
      if (!thumbPath) return
      try {
        await sharp(path)
          .resize(+size || 300)
          .jpeg({ quality: +quality || 70 })
          .toFile(thumbPath)
      } catch (err) {
        console.log(err)
        throw err
      }
    }

    async function autoScroll() {
      await page.evaluate(async () => {
        await new Promise((resolve: any, reject: any) => {
          try {
            const maxScroll = Number.MAX_SAFE_INTEGER
            let lastScroll = 0
            const interval = setInterval(() => {
              window.scrollBy(0, 100)
              const scrollTop = document.documentElement.scrollTop || window.scrollY
              if (scrollTop === maxScroll || scrollTop === lastScroll) {
                clearInterval(interval)
                resolve()
              } else {
                lastScroll = scrollTop
              }
            }, 100)
          } catch (err) {
            console.log(err)
            reject(err)
          }
        })
      })
    }

    function sleep(timeout: number = 1) {
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve()
        }, timeout)
      })
    }

    // 异步关闭：Error: Navigation failed because browser has disconnected!
    async function browserClose() {
      if (isPageLoad) {
        await browser.close()
        browser = null
      } else {
        browser = null
      }
    }
  })
}

export default { saveScreenshot }
