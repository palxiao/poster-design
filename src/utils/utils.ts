import app_config from '@/config'
export const config = app_config

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
export const isInArray = (arr: Type.Object[], value: any) => {
  if (arr.indexOf && typeof arr.indexOf === 'function') {
    const index = arr.indexOf(value)
    if (index >= 0) {
      return index
    }
  }
  return false
}
/** 删除多个对象元素 */
export const deleteSome = (obj: Type.Object, arr: string[]) => {
  arr.forEach((key) => {
    delete obj[key]
  })
  return obj
}
/** 拾取对象元素 */
export const pickSome = (obj: Type.Object, arr: string[]) => {
  const newObj: Type.Object = {}
  arr.forEach((key) => {
    newObj[key] = obj[key]
  })
  return newObj
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
/** 检测苹果手机 */
// export const isIOS = () => {
//   const u = navigator.userAgent
//   // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
//   const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
//   return isiOS
// }
/**
 * 判断是否微信客户端
 */
// export const isWX = () => {
//   const ua = window.navigator.userAgent.toLowerCase()
//   const match = String(ua.match(/MicroMessenger/i)) || ''
//   if (match === 'micromessenger') {
//     return true
//   } else {
//     return false
//   }
// }

export default {}
