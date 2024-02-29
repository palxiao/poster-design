/*
 * @Author: ShawnPhang
 * @Date: 2022-03-03 14:13:16
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-02-26 17:54:00
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from './utils'
import 'normalize.css/normalize.css'
import '@/assets/styles/index.less'
import elementConfig from './utils/widgets/elementConfig'

const app = createApp(App)

elementConfig.components.forEach((component) => {
  app.component(component.name, component)
})

elementConfig.plugins.forEach((plugin) => {
  app.use(plugin)
})

app
  .use(store)
  .use(router)
  .use(utils)
  .mount('#app')
