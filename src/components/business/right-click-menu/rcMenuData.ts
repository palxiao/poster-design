/*
 * @Author: ShawnPhang
 * @Date: 2021-07-30 17:38:50
 * @Description:
 * @LastEditors: xi_zi
 * @Date: 2024-03-04 18:50:00
 */

export type TMenuItemData = {
  left: number
  top: number
  list: TWidgetItemData[]
}

export const menuList: TMenuItemData = {
  left: 0,
  top: 0,
  list: [],
}

export type TWidgetItemData = {
  type: 'copy' | 'paste' | 'index-up' | 'index-down' | 'del' | 'ungroup' | 'warpable' | 'scalable' | 'resizable'
  text: string
}

export const widgetMenu: TWidgetItemData[] = [
  {
    type: 'copy',
    text: '复制',
  },
  {
    type: 'paste',
    text: '粘贴',
  },
  {
    type: 'index-up',
    text: '上移一层',
  },
  {
    type: 'index-down',
    text: '下移一层',
  },
  {
    type: 'del',
    text: '删除',
  },
  {
    type: 'warpable',
    text: '斜切',
  },
  {
    type: 'scalable',
    text: '缩放',
  },
  {
    type: 'resizable',
    text: '调整大小',
  },
]

export const pageMenu: TWidgetItemData[] = [
  {
    type: 'paste',
    text: '粘贴',
  },
]
