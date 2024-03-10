/*
 * @Author: ShawnPhang
 * @Date: 2022-01-31 10:45:53
 * @Description: 用于修改transform字符串
 * @LastEditors: ShawnPhang <site: book.palxp.com>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-02 11:50:00
 */
export function getTransformAttribute(target: HTMLElement, attr: string = '') {
  const tf = target.style.transform
  const iof = tf.indexOf(attr)
  const half = tf.substring(iof + attr.length + 1)
  return half.substring(0, half.indexOf(')'))
}

export function setTransformAttribute(target: HTMLElement, attr: string, value: string | number = 0) {
  const tf = target?.style.transform
  if (!tf) {
    return
  }
  const iof = tf.indexOf(attr)
  const FRONT = tf.slice(0, iof + attr.length + 1)
  const half = tf.substring(iof + attr.length + 1)
  const END = half.substring(half.indexOf(')'))
  target.style.transform = FRONT + value + END
}

export function getMatrix(params: Record<string, any>) {
  const result = []
  for (const key in params) {
    if (Object.hasOwn(params, key)) {
      result.push(params[key])
    }
  }
  return result
}
