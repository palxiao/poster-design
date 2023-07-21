// const prefix = import.meta.env
const prefix = process.env

const isDev = prefix.NODE_ENV === 'development'

export default {
  isDev,
  BASE_URL: isDev ? '/' : './',
  VERSION: '1.1.0',
  APP_NAME: '迅排设计',
  COPYRIGHT: 'ShawnPhang - Palxp.com',
  // API_URL: isDev ? 'http://localhost:9998' : '${API}',
  API_URL: 'https://app.palxp.com:8887',
  SCREEN_URL: isDev ? 'http://localhost:7001' : '${SCREEN_URL}',
  IMG_URL: 'https://store.palxp.com/',
  // ICONFONT_URL: '//at.alicdn.com/t/font_3223711_74mlzj4jdue.css',
  ICONFONT_URL: '//at.alicdn.com/t/font_2717063_ypy8vprc3b.css',
  ICONFONT_EXTRA: '//at.alicdn.com/t/c/font_3228074_6qsac4kteu7.css',
  QINIUYUN_PLUGIN: 'https://cdn.jsdelivr.net/npm/qiniu-js@2.5.5/dist/qiniu.min.js',
}
