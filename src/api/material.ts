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

type TGetFontSubParam = {
  font_id: string | number
  id: string | number
  content: string
}

type TGetFontSubExtra = {
  responseType?: string
}

export const getFontSub = (params: TGetFontSubParam, extra: TGetFontSubExtra = {}) => fetch<Blob | string>('design/font_sub', params, 'get', {}, extra)

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
  thumb?: string
} & Partial<IGetTempListData>

// 图库列表
export const getImagesList = (params: TGetImageListParams) => fetch<TPageRequestResult<TGetImageListResult[]>>('design/imgs', params, 'get')

type TMyPhotoParams = {
  
  page: number
  pageSize?: number
}

/** 获取我的资源管理返回 */
export type TMyPhotoResult = {
  created_time: string
  height: number
  id: number
  url: string
  user_id: number
  width: number
} & IGetTempListData

// 我的上传列表
export const getMyPhoto = (params: TMyPhotoParams) => fetch<TPageRequestResult<TMyPhotoResult[]>>('design/user/image', params)

type TDeleteMyPhotoParams = {
  id: string | number
  key: string
}

export const deleteMyPhoto = (params: TDeleteMyPhotoParams) => fetch<void>('design/user/image/del', params, 'post')

type TDeleteMyWorksParams = {
  id: string | number
}

export const deleteMyWorks = (params: TDeleteMyWorksParams) => fetch<void>('design/poster/del', params, 'post')

type TAddMyPhotoParam = {
  width: number
  height: number
  url: string
}

// 添加图片
export const addMyPhoto = (params: TAddMyPhotoParam) => fetch<void>('design/user/add_image', params)
