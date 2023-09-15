/*
 * @Author: ShawnPhang
 * @Date: 2022-03-06 13:53:30
 * @Description: 计算密集型任务
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-14 17:28:53
 */
export default class WebWorker {
  private worker: any

  constructor(name: string) {
    if (typeof Worker === 'undefined') {
      console.error('Web Worker is not supported in this browser.')
    } else {
      const file = name ? `../widgets/${name}.worker.ts` : null
      file &&
        (this.worker = new Worker(new URL(file, import.meta.url), {
          type: 'module',
        }))
    }
  }
  public start(data: any) {
    return new Promise((resolve) => {
      // 监听Web Worker的消息
      this.worker.onmessage = (e: any) => {
        resolve(e.data)
      }
      // 发送数据给Web Worker
      this.worker.postMessage(data)
    })
  }
}
