/*
 * @Author: ShawnPhang
 * @Date: 2021-08-02 18:27:27
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-11-14 16:41:19
 */

import i18n from '@/languages'
import { AlignListData } from "./AlignListData"

export type TStyleIconData = {
  key: string
  icon: string
  tip: string
  value: string[]
  select: boolean
  extraIcon?: boolean,
}

export const styleIconList1 = [
  {
    key: 'fontWeight',
    icon: 'icon-bold',
    tip: i18n.global.t('editor.tip.bold'),
    value: ['normal', 'bold'],
    select: false,
  },
  {
    key: 'fontStyle',
    icon: 'icon-italic',
    tip: i18n.global.t('editor.tip.italic'),
    value: ['normal', 'italic'],
    select: false,
  },
  {
    key: 'textDecoration',
    icon: 'icon-underline',
    tip: i18n.global.t('editor.tip.underline'),
    value: ['none', 'underline'],
    select: false,
  },
  {
    key: 'textDecoration',
    icon: 'icon-strikethrough',
    tip: i18n.global.t('editor.tip.strike'),
    value: ['none', 'line-through'],
    select: false,
  },
  {
    key: 'writingMode',
    icon: 'icon-textorientation',
    tip: i18n.global.t('editor.tip.vertical'),
    value: ['horizontal-tb', 'vertical-rl'], // tb-rl
    select: false,
  },
] as TStyleIconData[]

export type TStyleIconData2 = {
  key: string
  icon: string
  tip: string
  value: string
  select: boolean
}

export const styleIconList2 = [
  {
    key: 'textAlign',
    icon: 'icon-align-left-text',
    tip: i18n.global.t('editor.tip.alignLeft'),
    value: 'left',
    select: false,
  },
  {
    key: 'textAlign',
    icon: 'icon-align-center-text',
    tip: i18n.global.t('editor.tip.alignCenter'),
    value: 'center',
    select: false,
  },
  {
    key: 'textAlign',
    icon: 'icon-align-right-text',
    tip: i18n.global.t('editor.tip.alignRight'),
    value: 'right',
    select: false,
  },
  {
    key: 'textAlign',
    icon: 'icon-align-justify-text',
    tip: i18n.global.t('editor.tip.justify'),
    value: 'justify',
    select: false,
  },
  {
    key: 'textAlignLast',
    icon: 'icon-align-justify-text',
    tip: i18n.global.t('editor.tip.distribute'),
    value: 'justify',
    select: false,
  },
] as TStyleIconData2[]

export const alignIconList = [
  {
    key: 'align',
    icon: 'icon-align-left',
    tip: i18n.global.t('editor.tip.alignLeft'),
    value: 'left',
  },
  {
    key: 'align',
    icon: 'icon-align-center-horiz',
    tip: i18n.global.t('editor.tip.alignHCenter'),
    value: 'ch',
  },
  {
    key: 'align',
    icon: 'icon-align-right',
    tip: i18n.global.t('editor.tip.alignRight'),
    value: 'right',
  },
  {
    key: 'align',
    icon: 'icon-align-top',
    tip: i18n.global.t('editor.tip.alignTop'),
    value: 'top',
  },
  {
    key: 'align',
    icon: 'icon-align-center-verti',
    tip: i18n.global.t('editor.tip.alignVCenter'),
    value: 'cv',
  },
  {
    key: 'align',
    icon: 'icon-align-bottom',
    tip: i18n.global.t('editor.tip.alignBottom'),
    value: 'bottom',
  },
] as AlignListData[]
