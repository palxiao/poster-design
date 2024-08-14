/*
 * @Author: ShawnPhang
 * @Date: 2022-02-01 13:41:59
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 06:18:56
 */
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
// const path = require('path')
const router = require('./control/router.ts')
const { filePath, servicePort } = require('./configs.ts')
const handleTimeout = require('./utils/timeout.ts')

const port = process.env.PORT || servicePort
const app = express()

// 创建目录
const createFolder = (folder: string) => {
  try {
    fs.accessSync(folder)
  } catch (e) {
    fs.mkdirSync(folder)
  }
}
createFolder(filePath)

app.all('*', (req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Access-Token,Content-Type,Authorization,Content-Length,Content-Size')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use('/static', setUploadContentType, express.static(process.cwd() + `/static/`))

app.use(handleTimeout)

app.use((req: any, res: any, next: any) => {
  console.log(req.path)
  next()
})

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(router)

app.listen(port, () => console.log(`Screenshot Server start on port:${port}`))

const getContentType = function (path: any) {
  const extension = path.split('.').pop().toLowerCase()
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    default:
      return null
  }
}

function setUploadContentType(req: any, res: any, next: any) {
  const contentType = getContentType(req.path)
  if (contentType) {
    res.setHeader('Content-Type', contentType)
  }
  next()
}
