/*
 * @Author: ShawnPhang
 * @Date: 2021-07-14 11:43:13
 * @Description: 全局组件注册方法
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-10 17:39:01
 */
// import { Button, Field, Divider, NavBar, Toast, Popup } from 'vant'
import coms from '@/components/modules'

export default (Vue: any) => {
  coms(Vue)
  // Vue.component(Button.name, Button)
  // Vue.use(Field).use(Divider).use(NavBar).use(Toast).use(Popup)
}
