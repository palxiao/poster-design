/*
 * @Author: ShawnPhang
 * @Date: 2024-05-19 04:14:02
 * @Description: i18n 示例
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-05-19 05:19:57
 */
import { createI18n } from 'vue-i18n'

import zh from './modules/zh'
import en from './modules/en'

const i18n = createI18n({
  // Use Composition API, Set to false
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: {
    zh,
    en,
  },
})

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
  let defaultBrowserLang = ''
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh'
  } else {
    defaultBrowserLang = 'en'
  }
  return defaultBrowserLang
}

export default i18n
