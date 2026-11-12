/*
 * @Author: ShawnPhang
 * @Date: 2022-02-03 16:30:18
 * @Description: Type: success / info / warning / error
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-08 18:55:12
 */
import i18n from '@/languages'
import { ElMessageBox, messageType } from 'element-plus'
export default (title: string = i18n.global.t('common.notice'), message: string = '', type: messageType = 'success', extra?: any) => {
  return new Promise((resolve: Function) => {
    ElMessageBox.confirm(message, title, Object.assign({
      confirmButtonText: i18n.global.t('common.ok'),
      cancelButtonText: i18n.global.t('common.cancel'),
      type,
    }, extra))
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}
