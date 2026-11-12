import i18n from '@/languages'
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
