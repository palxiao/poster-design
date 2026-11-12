/*
 * @Author: ShawnPhang
 * @Date: 2021-07-17 11:20:22
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-01 20:55:51
 */

import i18n from '@/languages'
import { StyleValue } from "vue"

export type TWidgetClassifyData = {
  name: string
  icon: string
  show: boolean
  component: string
  style?: StyleValue
}

export default [
  {
    get name() { return i18n.global.t('editor.sidebar.templates') },
    icon: 'icon-moban',
    show: false,
    component: 'temp-list-wrap',
  },
  {
    get name() { return i18n.global.t('editor.sidebar.materials') },
    icon: 'icon-sucai',
    show: false,
    component: 'graph-list-wrap',
  },
  {
    get name() { return i18n.global.t('editor.sidebar.text') },
    icon: 'icon-wenzi',
    show: false,
    style: { fontWeight: 600 },
    component: 'text-list-wrap',
  },
  {
    get name() { return i18n.global.t('editor.sidebar.photos') },
    icon: 'icon-gallery',
    show: false,
    component: 'photo-list-wrap',
  },
  // {
  //   name: '背景',
  //   icon: 'icon-beijing',
  //   show: false,
  //   component: 'bg-img-list-wrap',
  // },
  {
    get name() { return i18n.global.t('editor.sidebar.tools') },
    icon: 'icon-zujian01',
    show: false,
    component: 'tools-list-wrap',
  },
  {
    get name() { return i18n.global.t('editor.sidebar.mine') },
    icon: 'icon-shangchuan',
    show: false,
    component: 'user-wrap',
  },
] as TWidgetClassifyData[]
