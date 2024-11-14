/*
 * @Author: ShawnPhang
 * @Date: 2021-08-02 18:27:27
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-11-14 16:41:19
 */

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
    tip: '加粗',
    value: ['normal', 'bold'],
    select: false,
  },
  {
    key: 'fontStyle',
    icon: 'icon-italic',
    tip: '斜体',
    value: ['normal', 'italic'],
    select: false,
  },
  {
    key: 'textDecoration',
    icon: 'icon-underline',
    tip: '下划线',
    value: ['none', 'underline'],
    select: false,
  },
  {
    key: 'textDecoration',
    icon: 'icon-strikethrough',
    tip: '删除线',
    value: ['none', 'line-through'],
    select: false,
  },
  {
    key: 'writingMode',
    icon: 'icon-textorientation',
    tip: '竖版文字',
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
    tip: '左对齐',
    value: 'left',
    select: false,
  },
  {
    key: 'textAlign',
    icon: 'icon-align-center-text',
    tip: '居中对齐',
    value: 'center',
    select: false,
  },
  {
    key: 'textAlign',
    icon: 'icon-align-right-text',
    tip: '右对齐',
    value: 'right',
    select: false,
  },
  {
    key: 'textAlign',
    icon: 'icon-align-justify-text',
    tip: '两端对齐',
    value: 'justify',
    select: false,
  },
  {
    key: 'textAlignLast',
    icon: 'icon-align-justify-text',
    tip: '分散对齐',
    value: 'justify',
    select: false,
  },
] as TStyleIconData2[]

export const alignIconList = [
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
