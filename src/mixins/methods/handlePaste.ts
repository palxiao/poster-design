/*
 * @Author: ShawnPhang
 * @Date: 2023-10-09 09:47:40
 * @Description: 处理剪贴板
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-09 10:35:21
 */

// window.addEventListener('paste', (e: any) => {
//   const clipdata = e.clipboardData || (window as any).clipboardData
//   console.log('主动粘贴', clipdata.getData('text/plain'))
// })

import store from '@/store'
import api from '@/api'
import Qiniu from '@/common/methods/QiNiu'
import _config from '@/config'
import { getImage } from '@/common/methods/getImgDetail'
import wImage from '@/components/modules/widgets/wImage/wImage.vue'
import wText from '@/components/modules/widgets/wText/wText.vue'

export default () => {
  navigator.clipboard
    .read()
    .then(async (dataTransfer: any) => {
      for (let i = 0; i < dataTransfer.length; i++) {
        const item = dataTransfer[i]
        if (item.types.toString().indexOf('image') !== -1) {
          const imageBlob = await item.getType(item.types[0])
          const file = new File([imageBlob], 'screenshot.png', { type: 'image/png' })
          // 上传图片
          const qnOptions = { bucket: 'xp-design', prePath: 'user' }
          const result: any = await Qiniu.upload(file, qnOptions)
          const { width, height }: any = await getImage(file)
          const url = _config.IMG_URL + result.key
          await api.material.addMyPhoto({ width, height, url })
          // 添加图片到画布中
          store.commit('setShowMoveable', false) // 清理掉上一次的选择
          const setting = JSON.parse(JSON.stringify(wImage.setting))
          setting.width = width
          setting.height = height
          setting.imgUrl = url
          const { width: pW, height: pH } = store.getters.dPage
          setting.left = pW / 2 - width / 2
          setting.top = pH / 2 - height / 2
          store.dispatch('addWidget', setting)
          break
        } else if (item.types.toString().indexOf('text') !== -1) {
          store.commit('setShowMoveable', false) // 清理掉上一次的选择
          const setting = JSON.parse(JSON.stringify(wText.setting))
          setting.text = await navigator.clipboard.readText()
          store.dispatch('addWidget', setting)
          break
        }
      }
    })
    .catch((error) => {
      console.error('无法读取剪贴板内容：', error)
    })
}
