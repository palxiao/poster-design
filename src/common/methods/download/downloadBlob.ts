/*
 * @Author: ShawnPhang
 * @Date: 2023-07-12 19:36:16
 * @Description: 下载 blob
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-12 19:36:41
 */
export default (blob: Blob, fileName: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
