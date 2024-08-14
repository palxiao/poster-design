/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 15:52:59
 * @Description: 下载远程图片
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-12 17:01:59
 */

type TCallBack = (progress: number, xhr: XMLHttpRequest) => void

export default (src: string, cb: TCallBack, fileName?: string) => {
  return new Promise<void>((resolve) => {
    fetchImageDataFromUrl(src, (progress: number, xhr: XMLHttpRequest) => {
      cb(progress, xhr)
    }).then((res: any) => {
      const reader = new FileReader()
      reader.onload = function (event) {
        const a = document.createElement('a')
        const mE = new MouseEvent('click')
        const suffix = res.type ? res.type.split('/')[1] : 'png'
        const randomName = String(new Date().getTime()) + `.${suffix || 'png'}`
        a.download = fileName || randomName
        a.href = event?.target?.result as string
        // 触发a的单击事件
        a.dispatchEvent(mE)
        resolve(res)
      }
      if (!res) {
        resolve()
        return
      }
      reader.readAsDataURL(res)
    })
  })
}

function fetchImageDataFromUrl(url: string, cb: TCallBack) {
  return new Promise<null>((resolve) => {
    const xhr = new XMLHttpRequest()
    let totalLength: string | number = ''
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onreadystatechange = function () {
      totalLength = Number(xhr.getResponseHeader('content-length')) // 'cache-control'
    }
    xhr.onprogress = function (event) {
      cb((event.loaded / Number(totalLength)) * 100, xhr)
    }
    xhr.onload = function () {
      if (xhr.status < 400) resolve(this.response)
      else resolve(null)
    }
    xhr.onerror = function (e) {
      resolve(null)
    }
    xhr.send()
  })
}
