/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 16:28:40
 * @Description: 加载遮罩 / 弹窗
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-01-20 18:19:20
 */
import { ElNotification } from 'element-plus'
export default (title: string, message: string = '', type: any = 'success') => {
  ElNotification({
    title,
    message,
    type,
  })
}
