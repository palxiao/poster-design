/*
 * @Author: ShawnPhang
 * @Date: 2022-01-22 10:22:53
 * @Description: 稿定接口
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-27 10:38:51
 */
import httpRequest from '@/utils/http-request'

export const CORS = 'https://juejin.palxp.com/cors?url='
export const GAODING_API_V2 = 'https://www.gaoding.com/api/v2'
export const GAODING_FONTER = 'https://fonter.dancf.com'

export const getFonts = async (pageNum: number): Promise<any> => {
  return await httpRequest.get(`${CORS}${GAODING_API_V2}/fonts`, {
    params: {
      type: 'font',
      page_size: 100,
      page_num: pageNum,
      region_id: 1,
      biz_code: 1,
      endpoint: 4,
    },
  })
}

export const searchFonts = async (name: string): Promise<any> => {
  const url = `${CORS}https://www.gaoding.com/api/v2/font-fallbacks?font_name=${name}`
  return await httpRequest.get(url, {})
}

interface GetSubsetFontParams {
  font_id: number
  content: string
  url: string
}

export async function getSubsetFont(params: GetSubsetFontParams) {
  return await httpRequest.get(`${GAODING_FONTER}/subset`, {
    params: {
      from_site: 'gaoding',
      type: 'woff',
      ...params,
    },
    responseType: 'blob',
  })
}
