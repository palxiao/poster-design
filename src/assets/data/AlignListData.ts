/*
 * @Author: ShawnPhang
 * @Date: 2022-02-12 11:08:57
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-01 20:55:51
 */

export type AlignListData = {
  key: string
  icon: string
  tip: string
  value: string
}

export default [
  {
    key: 'align',
    icon: 'icon-align-left',
    tip: '左对齐',
    value: 'left',
  },
  {
    key: 'align',
    icon: 'icon-align-center-horiz',
    tip: '水平居中对齐',
    value: 'ch',
  },
  {
    key: 'align',
    icon: 'icon-align-right',
    tip: '右对齐',
    value: 'right',
  },
  {
    key: 'align',
    icon: 'icon-align-top',
    tip: '上对齐',
    value: 'top',
  },
  {
    key: 'align',
    icon: 'icon-align-center-verti',
    tip: '垂直居中对齐',
    value: 'cv',
  },
  {
    key: 'align',
    icon: 'icon-align-bottom',
    tip: '下对齐',
    value: 'bottom',
  },
] as AlignListData[]
