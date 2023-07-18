/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 16:28:40
 * @Description: 加载遮罩 / 弹窗
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-01-20 17:46:20
 */
import { ElLoading } from 'element-plus'
export default (text: string = 'loading') => {
  const loading = ElLoading.service({
    lock: true,
    text,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  return loading
  // loading.close()
}
