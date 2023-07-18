/*
 * @Author: ShawnPhang
 * @Date: 2022-04-19 14:19:13
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-21 18:38:10
 */
// const fs2 = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const GIFEncoder = require('gif-encoder-2')
const { createWriteStream } = require('fs')
const PNG = require('png-js')

const params = { width: 1242/3, height: 2208/3 }

function decode(png) {
  return new Promise((r) => {
    png.decode((pixels) => r(pixels))
  })
}

async function gifAddFrame(page, encoder) {
  const pngBuffer = await page.screenshot({ clip: { width: params.width, height: params.height, x: 0, y: 0 } })
  const png = new PNG(pngBuffer)
  await decode(png).then((pixels) => encoder.addFrame(pixels))
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 0,
  })
  const page = await browser.newPage()
  page.setViewport({ width: params.width, height: params.height })
  await page.goto('http://localhost:3000/draw?tempid=519', {
    waitUntil: ['networkidle0'],
    timeout: 60000,
  })

  const dstPath = path.join(__dirname, `test.gif`)
  // create a write stream for GIF data
  const writeStream = createWriteStream(dstPath)
  writeStream.on('close', () => {
    console.log('create is done')
  })
  // createWriteStream().pipe(fs2.createWriteStream('test.gif'))

  // setting gif encoder
  // record gif
  var encoder = new GIFEncoder(params.width, params.height)
  encoder.createReadStream().pipe(writeStream)
  encoder.start()
  encoder.setRepeat(0)
  encoder.setDelay(200)
  // encoder.setQuality(10) // default

  for (let i = 0; i < 5; i++) {
    await gifAddFrame(page, encoder)
  }

  // finish encoder, test.gif saved
  encoder.finish()

  await browser.close()
})()
