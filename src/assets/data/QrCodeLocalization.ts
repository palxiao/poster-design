import i18n from '@/languages'
/*
 * @Author: ShawnPhang
 * @Date: 2022-03-16 11:38:48
 * @Description:
 * @LastEditors: ShawnPhang, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-01 20:55:51
 */

export type QrCodeLocalizationData = {
  dotColorTypes: {
    key: string
    value: string
  }[]
  dotTypes: {
    key: string
    value: string
  }[]
}

export default {
  dotColorTypes: [
    {
      key: 'single',
      value: i18n.global.t('editor.qr.single'),
    },
    {
      key: 'gradient',
      value: i18n.global.t('editor.qr.gradient'),
    },
  ],
  dotTypes: [
    {
      key: 'dots',
      value: i18n.global.t('editor.qr.dots'),
    },
    {
      key: 'rounded',
      value: i18n.global.t('editor.qr.rounded'),
    },
    {
      key: 'classy',
      value: i18n.global.t('editor.qr.classy'),
    },
    {
      key: 'classy-rounded',
      value: i18n.global.t('editor.qr.classyRounded'),
    },
    {
      key: 'square',
      value: i18n.global.t('editor.qr.square'),
    },
    {
      key: 'extra-rounded',
      value: i18n.global.t('editor.qr.extra'),
    },
  ],
} as QrCodeLocalizationData
