import app_config from '@/config'
export const config = app_config

type TComObj = Record<string,any>

/**
 * 星期换算
 * @param {String} 'YYYY-MM-DD'
 */
// export const transformDate = (date: string) => {
//   const weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
//   const myDate = new Date(date.replace(/-/g, '/'))
//   if (weekDay[myDate.getDay()]) {
//     return weekDay[myDate.getDay()]
//   } else {
//     return ''
//   }
// }
/**
 * 返回正确时间
 */
// export const getDate = (date: string) => {
//   const reDate = new Date(date.replace(/-/g, '/'))
//   return reDate
// }
/**
 * 短日期
 */
// export const getMinDate = (d: string, type: string) => {
//   const mydate = new Date(d.replace(/-/g, '/'))
//   if (isNaN(mydate.getDate())) {
//     return d
//   }
//   if (type === 'ym') {
//     return mydate.getFullYear() + ' - ' + (mydate.getMonth() + 1)
//   } else if (type === 'md') {
//     return mydate.getMonth() + 1 + '-' + mydate.getDate()
//   } else {
//     return String(mydate.getMonth() + 1).padStart(2, '0')
//   }
// }
// 判断是否在数组中并返回下标
export const isInArray = (arr: (string | number)[], value: (string | number)) => {
  const index = arr.indexOf(value)
  if (index >= 0) {
    return index
  }
  return false
}

/** 删除多个对象元素 */
export const deleteSome = <R extends TComObj, T extends TComObj = TComObj>(obj: T, arr: string[]) => {
  arr.forEach((key) => {
    delete obj[key]
  })
  return obj as R extends T ? R : Partial<T>
}

/** 拾取对象元素 */
export const pickSome = <R extends TComObj, T extends TComObj = TComObj>(obj: T, arr: string[]) => {
  const newObj: Record<string, any> = {}
  arr.forEach((key) => {
    newObj[key] = obj[key]
  })
  return newObj as R extends T ? R : Partial<T>
}

/** String长度 */
// export const getBLen = (str: string | any) => {
//   if (str === null) {
//     return 0
//   }
//   return String(str).replace(/[^\x00-\xff]/g, '01').length
// }
/** 随机 */
export const rndNum = (n: number, m: number) => {
  const random = Math.floor(Math.random() * (m - n + 1) + n)
  return random
}

export default {}
