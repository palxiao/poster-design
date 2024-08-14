/*
 * @Author: ShawnPhang
 * @Date: 2022-02-01 13:41:59
 * @Description: 配置文件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 05:13:19
 */
const isDev = process.env.NODE_ENV === 'development'

// 服务器常用修改项
const serviceComfig = {
    port: 7001, // 端口号
    website: 'http://127.0.0.1:5173/', // 编辑器项目的地址
    filePath: '/cache/' // 生成图片保存的目录
}

/**
 * 端口号
 */
exports.servicePort = serviceComfig.port

/**
 * 前端绘制页地址
 */
exports.drawLink = isDev ? 'http://127.0.0.1:5173/draw' : serviceComfig.website + '/draw'

/**
 * 图片缓存目录位置，根据实际情况调整
 */
exports.filePath = isDev ? process.cwd() + `/static/` : serviceComfig.filePath

/**
 * 配置服务器端的chrome浏览器位置
 */
exports.executablePath = isDev ? null : '/opt/google/chrome-unstable/chrome'

/**
 * 截图并发数上限
 */
exports.maxNum = 2

/**
 * 截图队列的阈值，超出时请求将会被熔断
 */
exports.upperLimit = 20

/**
 * 多久释放浏览器驻留内存，单位：秒（多标签页版生效）
 */
exports.releaseTime = 300
