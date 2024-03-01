/*
 * @Author: ShawnPhang
 * @Date: 2022-04-15 10:51:50
 * @Description:
 * @LastEditors: ShawnPhang, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-01 20:55:51
 */

export type LayerIconList = {
  key: string
  icon: string
  tip: string
  value: number
}

export default [
  {
    key: 'zIndex',
    icon: 'icon-layer-up',
    tip: '上一层',
    value: 1,
  },
  {
    key: 'zIndex',
    icon: 'icon-layer-down',
    tip: '下一层',
    value: -1,
  },
] as LayerIconList[]
