// const prefix = import.meta.env
const prefix = process.env

const isDev = prefix.NODE_ENV === 'development'
import { version } from '../package.json'

export default {
  isDev,
  BASE_URL: isDev ? '/' : './',
  VERSION: version,
  APP_NAME: '迅排设计',
  COPYRIGHT: 'ShawnPhang - Palxp.cn',
  // API_URL: isDev ? 'http://localhost:9998' : '${API}',
  API_URL: 'https://palxp.cn:8887', // 服务端地址
  SCREEN_URL: isDev ? 'http://localhost:7001' : '#{SCREEN_URL}', // 截图服务地址
  IMG_URL: 'https://store.palxp.com/', // 七牛云资源地址
  // ICONFONT_URL: '//at.alicdn.com/t/font_3223711_74mlzj4jdue.css',
  ICONFONT_URL: '//at.alicdn.com/t/font_2717063_ypy8vprc3b.css?display=swap',
  ICONFONT_EXTRA: '//at.alicdn.com/t/c/font_3228074_zubqmza1sdk.css',
  QINIUYUN_PLUGIN: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/qiniu-js/2.5.5/qiniu.min.js',
  supportSubFont: true, // 是否开启服务端字体压缩
}
