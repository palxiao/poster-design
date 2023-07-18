/*
 * @Author: ShawnPhang
 * @Date: 2023-07-12 19:37:14
 * @Description: 下载 base64
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-12 19:37:39
 */
export default (base64Data: string, fileName: string) => {
  const link = document.createElement('a')
  link.href = base64Data
  link.download = fileName
  link.click()
}
