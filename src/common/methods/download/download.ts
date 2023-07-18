/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 15:52:59
 * @Description: 下载远程图片
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-12 16:54:51
 */
export default (src: string, cb: Function) => {
  return new Promise((resolve: any) => {
    // const image = new Image()
    // // 解决跨域 Canvas 污染问题
    // image.setAttribute('crossOrigin', 'anonymous')
    // image.onload = function() {
    //   const canvas = document.createElement('canvas')
    //   canvas.width = image.width
    //   canvas.height = image.height

    //   const context = canvas.getContext('2d')
    //   context?.drawImage(image, 0, 0, image.width, image.height)
    //   const url = canvas.toDataURL('image/jpg')

    //   const a = document.createElement('a')
    //   const event = new MouseEvent('click')

    //   a.download = String(new Date().getTime())
    //   a.href = url

    //   // 触发a的单击事件
    //   a.dispatchEvent(event)
    //   resolve()
    // }

    fetchImageDataFromUrl(src, (progress: number, xhr: XMLHttpRequest) => {
      cb(progress, xhr)
    }).then((res: any) => {
      const reader = new FileReader()
      reader.onload = function (event) {
        const txt: any = event?.target?.result
        // image.src = txt
        const a = document.createElement('a')
        const mE = new MouseEvent('click')
        // TODO: 部分浏览器会丢失后缀，所以补上
        a.download = String(new Date().getTime()) + '.png'
        a.href = txt
        // 触发a的单击事件
        a.dispatchEvent(mE)
        resolve()
      }
      if (!res) {
        resolve()
        return
      }
      reader.readAsDataURL(res)
    })
  })
}

function fetchImageDataFromUrl(url: string, cb: Function) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    let totalLength: any = ''
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onreadystatechange = function () {
      totalLength = Number(xhr.getResponseHeader('content-length')) // 'cache-control'
    }
    xhr.onprogress = function (event) {
      cb((event.loaded / totalLength) * 100, xhr)
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
