/*
 * @Author: ShawnPhang
 * @Date: 2021-08-23 17:25:35
 * @Description: 获取图片细节的相关方法
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-09 10:42:54
 */
export const getImage = (imgItem: string | File) => {
  // 创建对象
  const img = new Image()

  // 改变图片的src
  const url = window.URL || window.webkitURL
  img.src = typeof imgItem === 'string' ? imgItem : url.createObjectURL(imgItem)

  return new Promise((resolve) => {
    // 判断是否有缓存
    if (img.complete) {
      resolve(img)
    } else {
      // 加载完成执行
      img.onload = function () {
        resolve(img)
      }
    }
  })
}
