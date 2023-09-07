/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description: 路由
 * @LastEditors: ShawnPhang <site: m.palxp.cn>
 * @LastEditTime: 2023-07-27 17:51:36
 */
const rExpress = require('express');
const screenshots = require('../service/screenshots.ts');
const api = require('./api.ts');
const rRouter = rExpress.Router();

rRouter.get(api.SCREENGHOT, screenshots.screenshots);

if (process.env.NODE_ENV === 'development') {
    rRouter.get(api.PRINTSCREEN, screenshots.printscreen);
    rRouter.get(api.GETIMAGE, screenshots.getImg);
}

module.exports = rRouter;

