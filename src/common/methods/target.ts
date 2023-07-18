/*
 * @Author: ShawnPhang
 * @Date: 2021-08-10 15:42:12
 * @Description: 处理与目标组件相关
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-13 16:17:54
 */
// TODO: Group类型比较特殊，所以需要全量循环并判断是否为group
const arr = ['w-text', 'w-image', 'w-svg', 'w-group', 'w-qrcode']

export function getTarget(currentTarget: any) {
  let collector: any[] = []
  let groupTarger: any = null
  let saveTarger: any = null
  return new Promise((resolve) => {
    function findTarget(target: any) {
      if (!target || target.id === 'page-design') {
        if (collector.length > 1) {
          resolve(groupTarger)
        } else {
          resolve(saveTarger || currentTarget)
        }
        return
      }
      const t = Array.from(target.classList)

      collector = collector.concat(
        t.filter((x) => {
          arr.includes(x) && (saveTarger = target)
          x === 'w-group' && (groupTarger = target)
          return arr.includes(x)
        }),
      )
      findTarget(target.parentElement)
    }
    findTarget(currentTarget)
  })
}

export function getFinalTarget(currentTarget: any) {
  let collector: any[] = []
  let groupTarger: any = null
  let saveTarger: any = null
  return new Promise((resolve) => {
    function findTarget(target: any) {
      if (!target || target.id === 'page-design') {
        resolve(target)
        return
      }
      const t = Array.from(target.classList)

      collector = collector.concat(
        t.filter((x) => {
          arr.includes(x) && (saveTarger = target)
          x === 'w-group' && (groupTarger = target)
          return arr.includes(x)
        }),
      )

      findTarget(target.parentElement)
    }
    findTarget(currentTarget)
  })
}
