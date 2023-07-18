/*
 * @Author: ShawnPhang
 * @Date: 2021-08-26 12:47:40
 * @Description: 相册 api 接口
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-30 10:45:49
 */
import fetch from '@/utils/axios'
import _config from '@/config'
const prefix = _config.API_URL + '/'
const API = {
  init: prefix + 'pic/init',
  getList: prefix + 'pic/list',
  getToken: prefix + 'pic/getToken',
  delOne: prefix + 'pic/delOne',
  rename: prefix + 'pic/rename',
  del: prefix + 'pic/del',
}

export const init = (params: Type.Object = {}) => fetch(API.init, params, 'post')

export const getPicList = (params: Type.Object = {}) => fetch(API.getList, params)

export const getToken = (params: Type.Object = {}) => fetch(API.getToken, params)

export const deletePic = (params: Type.Object = {}) => fetch(API.delOne, params, 'post')

export const delPics = (params: Type.Object = {}) => fetch(API.del, params, 'post')

export const reName = (params: Type.Object = {}) => fetch(API.rename, params, 'post')

export default {
  init,
  getPicList,
  getToken,
  deletePic,
  delPics,
  reName,
}
