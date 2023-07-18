/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description:  
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-06 15:59:58
 */
const rExpress = require('express');
const screenshots = require('../service/screenshots.ts');
const api = require('./api.ts');
const rRouter = rExpress.Router();

rRouter.get(api.SCREENGHOT, screenshots.screenshots);
rRouter.get(api.PRINTSCREEN, screenshots.printscreen);
rRouter.get(api.GETIMAGE, screenshots.getImg);

module.exports = rRouter;

