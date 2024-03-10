/*
 * @Author: ShawnPhang
 * @Date: 2023-05-29 14:24:41
 * @Description:
 * @LastEditors: ShawnPhang <site: m.palxp.cn>
 * @LastEditTime: 2023-05-29 14:25:05
 */
import { App } from 'vue'
import Comp from './index.vue'

Comp.install = (app: App): void => {
  app.component(Comp.name, Comp)
}

export default Comp
