/*
 * @Author: ShawnPhang
 * @Date: 2021-08-27 14:42:15
 * @Description: 媒体相关接口
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 11:40:47
 */
import fetch from '@/utils/axios'
import { IGetTempListData } from './home'

// 获取素材分类：
export const getKinds = (params: Type.Object = {}) => fetch('design/cate', params)

type TGetListParam = {
  first_id?: number
  second_id?: string
  cate?: number
  pageSize?: number
}

export type TGetListData = {
  category: number
  created_time: string
  height: number
  id: number
  model: string
  original: string
  state: number
  thumb: string
  title: string
  type: string
  updated_time: string
  url: string
  width: number
  thumbUrl: string
  imgUrl: string
}

export type TGetListResult = TPageRequestResult<TGetListData[]>



// 获取素材列表：
export const getList = (params: TGetListParam) => fetch<TGetListResult>('design/material', params)

export type TGetFontParam = {
  pageSize?: number
}

/** 字体item数据 */
export type TGetFontItemData = {
  id: number
  alias: string
  oid: string
  value: string
  preview: string
  woff: string
  lang: string
}

// 获取字体
export const getFonts = (params: TGetFontParam = {}) => fetch<TPageRequestResult<TGetFontItemData[]>>('design/fonts', params)
export const getFontSub = (params: Type.Object = {}, extra: any = {}) => fetch('design/font_sub', params, 'get', {}, extra)

type TGetImageListParams = {
  page?: number
  cate?: number
}

export type TGetImageListResult = {
  created_time: string
  height: number
  width: number
  url: string
  user_id: number
  id: string
  thumb: string
} & IGetTempListData

// 图库列表
export const getImagesList = (params: TGetImageListParams) => fetch<TPageRequestResult<TGetImageListResult[]>>('design/imgs', params, 'get')

// 我的上传列表
export const getMyPhoto = (params: TGetImageListParams) => fetch<TPageRequestResult<TGetImageListResult[]>>('design/user/image', params)
export const deleteMyPhoto = (params: Type.Object = {}) => fetch('design/user/image/del', params, 'post')
export const deleteMyWorks = (params: Type.Object = {}) => fetch('design/poster/del', params, 'post')

// 添加图片
export const addMyPhoto = (params: Type.Object = {}) => fetch('design/user/add_image', params)
