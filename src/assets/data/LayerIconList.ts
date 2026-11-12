/*
 * @Author: ShawnPhang
 * @Date: 2022-04-15 10:51:50
 * @Description:
 * @LastEditors: ShawnPhang, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-01 20:55:51
 */

import i18n from '@/languages'
import { TIconItemSelectData } from "@/components/modules/settings/iconItemSelect.vue"

export default [
  {
    key: 'zIndex',
    icon: 'icon-layer-up',
    tip: i18n.global.t('editor.tip.layerUp'),
    value: 1,
  },
  {
    key: 'zIndex',
    icon: 'icon-layer-down',
    tip: i18n.global.t('editor.tip.layerDown'),
    value: -1,
  },
] as TIconItemSelectData[]
