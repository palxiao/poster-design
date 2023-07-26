/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 16:28:40
 * @Description: 弹出提示
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-01-20 18:19:20
 */
import { ElNotification } from 'element-plus'

interface ElNotifi {
  type?: 'success' | 'warning' | 'info' | 'error' | ''
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default (title: string, message: string = '', extra?: ElNotifi) => {
  ElNotification({
    title,
    message,
    ...extra,
  })
}
