/*
 * @Author: ShawnPhang
 * @Date: 2022-02-03 16:30:18
 * @Description: Type: success / info / warning / error
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-03 16:43:01
 */
import { ElMessageBox } from 'element-plus'
export default (title: string = '提示', message: string = '', type: any = 'success') => {
  return new Promise((resolve: Function) => {
    ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type,
    })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}
