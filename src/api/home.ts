/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-13 18:19:14
 */
import fetch from '@/utils/axios'
import _config from '@/config'

// const screenshot_url = window.location.protocol + '//' + window.location.host + '/draw'
export const download = (params: Type.Object = {}) => `${_config.SCREEN_URL}/api/screenshots?id=${params.id}&width=${params.width}&height=${params.height}`

// 获取模板列表
export const getTempList = (params: Type.Object = {}) => fetch('design/list', params, 'get')
export const getTempDetail = (params: Type.Object = {}) => fetch('design/temp', params, 'get')
export const getCategories = (params: Type.Object = {}) => fetch('design/cate', params, 'get')
// 保存模板
export const saveTemp = (params: Type.Object = {}) => fetch('design/edit', params, 'post')
// export const delTemp = (params: Type.Object = {}) => fetch('/api/template/temp_del', params)

// 组件相关接口
export const getCompList = (params: Type.Object = {}) => fetch('design/list', params, 'get')
export const removeComp = (params: Type.Object = {}) => fetch('design/del', params, 'post')
// export const getCompDetail = (params: Type.Object = {}) => fetch('/api/template/temp_info', params, 'get')

// 保存作品
export const saveWorks = (params: Type.Object = {}) => fetch('design/save', params, 'post')

// 保存个人模板
export const saveMyTemp = (params: Type.Object = {}) => fetch('design/user/temp', params, 'post')

// 获取作品
export const getWorks = (params: Type.Object = {}) => fetch('design/poster', params, 'get')

// 作品列表
export const getMyDesign = (params: Type.Object = {}) => fetch('design/my', params, 'get')

export const test = (params: Type.Object = {}) => fetch('https://res.palxp.com/api/upload', params, 'post')
