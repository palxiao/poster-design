/*
 * @Author: ShawnPhang
 * @Date: 2023-09-07 22:56:09
 * @Description: 配置文件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-16 20:32:48
 */
// const prefix = import.meta.env
const prefix = process.env

const isDev = prefix.NODE_ENV === 'development'

export default {
  isDev,
  BASE_URL: isDev ? '/' : './',
  VERSION: '1.1.0',
  APP_NAME: '迅排设计',
  COPYRIGHT: 'ShawnPhang - Palxp.cn',
  // API_URL: isDev ? 'http://localhost:9998' : '${API}',
  API_URL: 'https://palxp.cn:8887', // 服务端地址
  SCREEN_URL: isDev ? 'http://localhost:7001' : '#{SCREEN_URL}', // 截图服务地址
  IMG_URL: 'https://store.palxp.com/', // 七牛云资源地址
  KT_URL: 'https://res.palxp.cn:5001', // 抠图服务地址
  // ICONFONT_URL: '//at.alicdn.com/t/font_3223711_74mlzj4jdue.css',
  ICONFONT_URL: '//at.alicdn.com/t/font_2717063_ypy8vprc3b.css?display=swap',
  ICONFONT_EXTRA: '//at.alicdn.com/t/c/font_3228074_6qsac4kteu7.css?&display=swap',
  QINIUYUN_PLUGIN: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/qiniu-js/3.4.0/qiniu.min.js',
}
