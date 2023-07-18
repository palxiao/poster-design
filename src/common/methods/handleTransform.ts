/*
 * @Author: ShawnPhang
 * @Date: 2022-01-31 10:45:53
 * @Description: 用于修改transform字符串
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-18 16:54:13
 */
export function getTransformAttribute(target: any, attr: string = '') {
  const tf = target.style.transform
  const iof = tf.indexOf(attr)
  const half = tf.substring(iof + attr.length + 1)
  return half.substring(0, half.indexOf(')'))
}

export function setTransformAttribute(target: any, attr: string, value: string | number = 0) {
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

export function getMatrix(params: any) {
  const result = []
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      result.push(params[key])
    }
  }
  return result
}
