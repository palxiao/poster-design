/*
 * @Author: ShawnPhang
 * @Date: 2021-07-13 22:51:29
 * @Description: Widgets、panel中所有组件将会自动全局引入
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-09 22:31:08
 */
import { App } from "vue"

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// 排除要全局引入的组件,可以是目录名也可以是文件名
const exclude = ['settings', 'layout']

const regex = RegExp('.*^(?!.*?(' + exclude.join('|') + ')).*\\.vue$')

// const requireComponent = require.context('.', true, /\.vue$/) // 找到components文件夹下以.vue命名的文件

const requireComponent = import.meta.glob('./**/*.vue', { eager: true })

function guide(Vue: App) {
  for (const fileName in requireComponent) {
    if (regex.test(fileName)) {
      const componentConfig = requireComponent[fileName]
      const componentName = capitalizeFirstLetter(fileName.replace(/^\..*\//, '').replace(/\.\w+$/, ''))
      Vue.component(componentName, componentConfig.default || componentConfig)
    }
  }
}

export default guide
