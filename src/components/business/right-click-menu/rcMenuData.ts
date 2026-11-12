import i18n from '@/languages'
/*
 * @Author: ShawnPhang
 * @Date: 2021-07-30 17:38:50
 * @Description:
 * @LastEditors: ShawnPhang, Jeremy Yu <https://github.com/JeremyYu-cn>
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
  type: 'copy' | 'paste' | 'index-up' | 'index-down' | 'del' | 'ungroup'
  text: string
}

export const widgetMenu: TWidgetItemData[] = [
  {
    type: 'copy',
    text: i18n.global.t('business.menu.copy'),
  },
  {
    type: 'paste',
    text: i18n.global.t('business.menu.paste'),
  },
  {
    type: 'index-up',
    text: i18n.global.t('business.menu.up'),
  },
  {
    type: 'index-down',
    text: i18n.global.t('business.menu.down'),
  },
  {
    type: 'del',
    text: i18n.global.t('business.menu.delete'),
  },
]

export const pageMenu: TWidgetItemData[] = [
  {
    type: 'paste',
    text: i18n.global.t('business.menu.paste'),
  },
]
