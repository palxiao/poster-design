/*
 * @Author: ShawnPhang
 * @Date: 2022-03-06 13:53:30
 * @Description: 计算密集型任务
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-05 12:00:00
 */
export default class WebWorker {
  private worker: Worker | undefined

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
      if (!this.worker) resolve('')
      else {
        // 监听Web Worker的消息
        this.worker.onmessage = (e) => {
          resolve(e.data)
        }
        // 发送数据给Web Worker
        this.worker.postMessage(data)
      }
    })
  }
}
