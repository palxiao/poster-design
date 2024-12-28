/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description: 路由
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 13:40:13
 */
import rExpress from 'express'
import screenshots from '../service/screenshots'
import fileService from '../service/files'
import userService from '../service/user'
import designService from '../service/design'
import api from './api'
const rRouter = rExpress.Router()

rRouter.get(api.SCREENGHOT, screenshots.screenshots)
rRouter.get(api.PRINTSCREEN, screenshots.printscreen)
rRouter.post(api.UPLOAD, fileService.upload)
rRouter.get(api.USER_IMAGES, userService.getUserImages)
rRouter.get(api.GET_TEMPLATE_LIST, designService.getTemplates)
rRouter.get(api.GET_TEMPLATE, designService.getDetail)
rRouter.get(api.GET_MATERIAL, designService.getMaterial)
rRouter.get(api.GET_PHOTOS, designService.getPhotos)
rRouter.post(api.UPDATE_TEMPLATE, designService.saveTemplate)

export default rRouter
