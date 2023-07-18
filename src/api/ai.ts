/*
 * @Author: ShawnPhang
 * @Date: 2023-07-12 09:51:07
 * @Description: AI接口
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-13 16:59:21
 */
import fetch from '@/utils/axios'

export const kt = (params: Type.Object = {}) => fetch('https://kt.palxp.com/api/remove', params, 'post', {}, { responseType: 'arraybuffer' })
