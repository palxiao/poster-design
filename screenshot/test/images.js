/*
 * @Author: ShawnPhang
 * @Date: 2022-02-28 15:35:59
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-28 16:52:35
 */

const path = '/Users/mac/Documents/workSpace/Products/Management-Center/screenshot-service/static/screenshot-1-new.jpg'

const images = require('images')

const path233 = require('path')
// let tinyJpg = images(path233.resolve(__dirname, `../static/screenshot-1.png`)).size(300).encode('jpg', { quality: 20 })
// images(tinyJpg).save(path)
let tinyJpg = images(path233.resolve(__dirname, `../static/screenshot-1.png`)).size(300).save(path, { quality: 30 })
