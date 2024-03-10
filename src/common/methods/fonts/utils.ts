interface TextItem {
  text: string
  [porpname: string]: any
}
interface CloudText {
  fontFamily: string
  fontSize: number
  textAlign: string
  color: string
  textDecoration: string
  writingMode: string
  fontWeight: string | number
  fontStyle: string
  lineHeight: number
  shadows: Record<string, unknown>[]
  strokes: Record<string, unknown>[]
  text: string
  texts: TextItem[]
  type: string
  letterSpacing: number
  [propsName: string]: unknown
}
const CLOUD_TYPE = {
  text: 'text',
  image: 'image',
}

// https://www.zhangxinxu.com/wordpress/2018/02/js-detect-suppot-font-family/
export const isSupportFontFamily = (f: string) => {
  if (typeof f != 'string') {
    return false
  }
  const h = 'Arial'
  if (f.toLowerCase() == h.toLowerCase()) {
    return true
  }
  const e = 'a'
  const d = 100
  const a = 100
  const i = 100
  const c = document.createElement('canvas')
  const b = c.getContext('2d') as CanvasRenderingContext2D

  c.width = a
  c.height = i

  b.textAlign = 'center'
  b.fillStyle = 'black'
  b.textBaseline = 'middle'

  const g = (j: string) => {
    b.clearRect(0, 0, a, i)
    b.font = d + 'px ' + j + ', ' + h
    b.fillText(e, a / 2, i / 2)
    const k = b.getImageData(0, 0, a, i).data
    return [].slice.call(k).filter((l) => {
      return l != 0
    })
  }
  return g(h).join('') !== g(f).join('')
}

// 生成字体 style
export function generateFontStyle(name: string, url: string): HTMLStyleElement {
  const el = document.createElement('style')
  el.id = name
  // el.classList.add('font-face');
  el.innerHTML = `@font-face { font-family: "${name}"; src: local("${name}"), url("${url}"); }`
  return el
}

// 找到使用到的所有字体
// export function filterSkyFonts() {
//   const fonts: string[] = []
//   // const textClouds = sky.state.clouds.filter(
//   //   (cloud) => cloud.type === CLOUD_TYPE.text,
//   // );
//   const textClouds: any = []

//   ;(textClouds as unknown as CloudText[]).forEach((cloud) => {
//     // 找到文字组件字体
//     if (cloud.fontFamily && !fonts.includes(cloud.fontFamily)) {
//       fonts.push(cloud.fontFamily)
//     }
//     // 找到文字组件子级字体
//     cloud.texts.forEach((text) => {
//       if (text.fontFamily && !fonts.includes(text.fontFamily)) {
//         fonts.push(text.fontFamily)
//       }
//     })
//   })
//   return fonts
// }

export function base642Blob(b64Data: string, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export async function blob2Base64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (blob.type === 'application/json') {
      resolve('')
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
    fileReader.onerror = reject
    fileReader.readAsDataURL(blob)
  })
}
