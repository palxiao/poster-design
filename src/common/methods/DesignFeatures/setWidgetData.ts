/*
 * @Author: ShawnPhang
 * @Date: 2022-02-22 15:06:14
 * @Description: 设置元素时根据类型处理
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-03 10:10:53
 */
// import store from '@/store'
// import { getImage } from '../getImgDetail'
import setImageData from '@/common/methods/DesignFeatures/setImage'
import wText from '@/components/modules/widgets/wText/wText.vue'
// import wImage from '@/components/modules/widgets/wImage/wImage.vue'
import wImageSetting from '@/components/modules/widgets/wImage/wImageSetting'
import wSvg from '@/components/modules/widgets/wSvg/wSvg.vue'

export default async function(type: string, item: TCommonItemData, data: Record<string, any>) {
  let setting = data
  if (type === 'text') {
    !item.fontFamily && !item.color ? (setting = JSON.parse(JSON.stringify(wText.setting))) : (setting = item)
    !setting.text ? (setting.text = '双击编辑文字') : (setting.text = decodeURIComponent(setting.text)) // item.text
    setting.fontSize = item.fontSize
    setting.width = item.width || item.fontSize * setting.text.length
    setting.fontWeight = item.fontWeight
  }
  if (type === 'image' || type === 'mask') {
    setting = JSON.parse(JSON.stringify(wImageSetting))
    const img = await setImageData(item.value)
    setting.width = img.width
    setting.height = img.height // parseInt(100 / item.value.ratio, 10)
    setting.imgUrl = item.value.url
    console.log("setting", setting)
  }
  if (type === 'mask') {
    setting.mask = item.value.url
  }
  if (type === 'svg') {
    setting = JSON.parse(JSON.stringify(wSvg.setting))
    const img = await setImageData(item.value)
    setting.width = img.width
    setting.height = img.height // parseInt(100 / item.value.ratio, 10)
    setting.svgUrl = item.value.url
    const models = JSON.parse(item.value.model)
    for (const key in models) {
      if (Object.hasOwnProperty.call(models, key)) {
        setting[key] = models[key]
      }
    }
  }
  return setting
}
