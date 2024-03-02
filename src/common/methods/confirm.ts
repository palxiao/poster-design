/*
 * @Author: ShawnPhang
 * @Date: 2022-02-03 16:30:18
 * @Description: Type: success / info / warning / error
 * @LastEditors: ShawnPhang <site: book.palxp.com>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-02 11:50:00
 */
import { ElMessageBox, messageType } from 'element-plus'
export default (title: string = '提示', message: string = '', type: messageType = 'success') => {
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
