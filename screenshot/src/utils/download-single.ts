/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 14:47:22
 * @Description: 下载图片（单浏览器版，适用于低配置服务器）
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-18 18:17:54
 */
const isDev = process.env.NODE_ENV === 'development'
const puppeteer = require('puppeteer')
const images = require('images')
const { executablePath } = require('../configs.ts')
const forceTimeOut = 60 // 强制超时时间，单位：秒
// 4K规格，总计约830万像素 3840 * 2160 2K规格，总计约830万像素 2048 * 1080
// const maxPXs = 8294400 
const maxPXs = 4211840 // 超出此规格会触发限制器降低dpr，节省服务器资源
const maximum = 5000 // 最大宽高限制，超过截断以防止服务崩溃

const saveScreenshot = async (url: string, { path, width, height, thumbPath, size = 0, quality = 0, prevent, ua, devices, scale, wait }: any) => {
  return new Promise(async (resolve: Function) => {
    let isPageLoad = false
    // 启动浏览器
    let browser = await puppeteer.launch({
      headless: true, // !isDev,
      executablePath: isDev ? null : executablePath,
      ignoreHTTPSErrors: true, // 忽略https安全提示
      args: ['–no-first-run', '–single-process', '–disable-gpu', '–no-zygote', '–disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', `--window-size=${width},${height}`], // 优化配置
      defaultViewport: null,
    })
    const regulators = setTimeout(() => {
      browser && browser.close()
      browser = null
      console.log('超时强制释放浏览器')
      resolve()
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
    if (prevent === false) {
      page.on('load', async () => {
        await autoScroll()
        await sleep(wait)
        // await waitTillHTMLRendered(page)
        await page.screenshot({ path, fullPage: true })
        // 关闭浏览器
        await browser.close()
        browser = null
        compress()
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
      compress()
      // console.log('浏览器已释放');
      clearTimeout(regulators)
      resolve()
    })

    // 地址栏输入网页地址
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    isPageLoad = true

    // 压缩图片
    function compress() {
      try {
        thumbPath &&
          images(path)
            .size(+size || 300)
            .save(thumbPath, { quality: +quality || 70 })
      } catch (err) {
        console.log(err)
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

module.exports = { saveScreenshot }

export {}
