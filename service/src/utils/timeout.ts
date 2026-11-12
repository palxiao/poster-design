/*
 * @Author: ShawnPhang
 * @Date: 2021-12-24 17:51:15
 * @Description: 超时中间件
 * @LastEditors: ShawnPhang <site: m.palxp.cn>
 * @LastEditTime: 2023-07-05 20:17:00
 */

export default async (req: any, res: any, next: any) => {
  const { queueList } = require('../utils/node-queue.ts')
  const time = 30000 // 设置所有HTTP请求的服务器响应超时时间
  res.setTimeout(time, () => {
    const statusCode = 408
    const index = queueList.findIndex((x: any) => x.sign === req._queueSign)
    if (index !== -1) {
      queueList.splice(index, 1)
      if (!res.headersSent) {
        res.status(statusCode).json({
          statusCode,
          message: 'Quá thời gian phản hồi, tác vụ đã bị hủy, vui lòng thử lại',
        })
      }
    }
  })
  next()
}
