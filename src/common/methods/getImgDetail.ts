/*
 * @Author: ShawnPhang
 * @Date: 2021-08-23 17:25:35
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-24 00:16:59
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
      img.onload = function() {
        resolve(img)
      }
    }
  })
}
