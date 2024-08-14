/*
 * @Author: ShawnPhang
 * @Date: 2022-01-25 17:02:02
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 13:59:34
 */
const axios = require('axios')

const httpRequest = axios.create({
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
})

httpRequest.interceptors.response.use((config: any) => {
  return config.data
})

module.exports = httpRequest
