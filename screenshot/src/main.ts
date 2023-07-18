/*
 * @Author: ShawnPhang
 * @Date: 2022-02-01 13:41:59
 * @Description:  
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-06 10:19:18
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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Length,Content-Size');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use('/static', express.static('static'))
// app.use('/cache', express.static('cache'))

app.use(handleTimeout)

app.use((req: any, res: any, next: any) => {
    console.log(req.path)
    next()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(router)

app.listen(port, () => console.log(`devServer start on port:${port}`))
