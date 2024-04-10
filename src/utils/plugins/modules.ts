/*
 * @Author: ShawnPhang
 * @Date: 2021-07-14 11:43:13
 * @Description: 全局组件导入
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-08 18:23:15
 */
import coms from '@/components/modules'
import pageStyle from '@/components/modules/layout/designBoard/pageStyle.vue'
import { App } from 'vue'

export default (Vue: App) => {
  coms(Vue)
  Vue.component('page-style', pageStyle) // 背景属性已不在 modules/widgets 中，单独注册
  // Vue.use(Field).use(Divider).use(NavBar).use(Toast).use(Popup)
}
