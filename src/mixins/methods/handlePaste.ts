/*
 * @Author: ShawnPhang
 * @Date: 2023-10-09 09:47:40
 * @Description: 处理剪贴板
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-15 17:35:18
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
// import wImage from '@/components/modules/widgets/wImage/wImage.vue'
import wImageSetting from '@/components/modules/widgets/wImage/wImageSetting'
// import wText from '@/components/modules/widgets/wText/wText.vue'
import { wTextSetting } from '@/components/modules/widgets/wText/wTextSetting'
import eventBus from '@/utils/plugins/eventBus'

export default () => {
  return new Promise<void>((resolve) => {
    navigator.clipboard
      .read()
      .then(async (dataTransfer: any) => {
        if (store.getters.dActiveElement.editable) {
          return
        }
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
            // 刷新用户列表
            eventBus.emit('refreshUserImages')
            // 添加图片到画布中
            store.commit('setShowMoveable', false) // 清理掉上一次的选择
            const setting = JSON.parse(JSON.stringify(wImageSetting))
            setting.width = width
            setting.height = height
            setting.imgUrl = url
            const { width: pW, height: pH } = store.getters.dPage
            setting.left = pW / 2 - width / 2
            setting.top = pH / 2 - height / 2
            store.dispatch('addWidget', setting)
            // 清空剪贴板，防止多次上传图片
            navigator.clipboard.write([
              new ClipboardItem({
                'text/plain': new Blob([''], {type: 'text/plain'})
              })
            ])
            // 最后尝试复制，将图片替换为图片组件
            setTimeout(() => {
              store.dispatch('copyWidget')
            }, 100)
            break
          } else if (item.types.toString().indexOf('text') !== -1) {
            store.commit('setShowMoveable', false) // 清理掉上一次的选择
            const setting = JSON.parse(JSON.stringify(wTextSetting))
            setting.text = await navigator.clipboard.readText()
            store.dispatch('addWidget', setting)
            break
          } else resolve()
        }
      })
      .catch((error) => {
        // 剪贴板内容为空, 直接返回
        resolve()
      })
  })
}
