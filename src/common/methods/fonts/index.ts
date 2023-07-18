/*
 * @Author: ShawnPhang
 * @Date: 2022-01-08 09:43:37
 * @Description: 字体处理
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-30 14:13:26
 */

// import { getFonts } from '@/api/gaoding'
// import { isSupportFontFamily, blob2Base64 } from './utils'
import { getFonts } from '@/api/material'
// import store from '@/store'

const fontList: any = []
// const download: any = {}
export const useFontStore = {
  list: fontList,
  // download,
  async init() {
    this.list = []
    const localFonts: any = localStorage.getItem('FONTS') ? JSON.parse(localStorage.getItem('FONTS') || '') : []
    if (localFonts.length > 0) {
      this.list.push(...localFonts)
    }

    if (this.list.length === 0) {
      const res = await getFonts({ pageSize: 400 })
      this.list.unshift(
        ...res.list.map((x: any) => {
          const { alias, oid, value, preview, woff, lang } = x
          return { id: oid, value, preview, alias, url: woff, lang }
        }),
      )
      localStorage.setItem('FONTS', JSON.stringify(this.list))
    }
    // store.dispatch('setFonts', this.list)
  },
}

// export const useFontStore = () => {
//   return {
//     list: fontList,
//     download,
//     async init() {
//       this.list = []
//       const localFonts: any = localStorage.getItem('FONTS') ? JSON.parse(localStorage.getItem('FONTS') || '') : []
//       if (localFonts.length > 0) {
//         this.list.push(...localFonts)
//       }

//       if (this.list.length === 0) {
//         const res = await getFonts({ pageSize: 400 })
//         this.list.unshift(
//           ...res.map((x: any) => {
//             const { content, id, name, preview } = x
//             return { id, name, preview: preview.url, alias: content.alias, family: content.family, lang: content.lang, ttf: content.ttf, url: content.woff }
//           }),
//         )
//         localStorage.setItem('FONTS', JSON.stringify(this.list))
//       }
//       console.log(this.list)
//     },
//     getList() {
//       return fontList
//     },
//   }
// }

// export const useFontStore = () => {
//   return {
//     list: fontList,
//     download,
//     async init() {
//       this.list = []
//       const localFonts: any = localStorage.getItem('FONTS') ? JSON.parse(localStorage.getItem('FONTS') || '') : []
//       if (localFonts.length > 0) {
//         this.list.push(...localFonts)
//       }

//       if (this.list.length === 0) {
//         for (let i = 1; i < 99; i += 1) {
//           const res = await getFonts(i)
//           this.list.unshift(
//             ...res.map((x: any) => {
//               const { content, id, name, preview } = x
//               return { id, name, preview: preview.url, alias: content.alias, family: content.family, lang: content.lang, ttf: content.ttf, url: content.woff }
//             }),
//           )
//           if (res.length < 100) break
//         }
//         localStorage.setItem('FONTS', JSON.stringify(this.list))
//       }
//     },
//     async addFont2Style(name: string, url: string) {
//       // if (this.download[name]) return;
//       if (isSupportFontFamily(name)) return

//       const response = await fetch(url, { headers: { responseType: 'blob' } })
//       const blob = await response.blob()
//       const ff = new FontFace(name, `url(${URL.createObjectURL(blob)})`)
//       const f = await ff.load()
//       ;(document.fonts as FontFaceSet).add(f)

//       const b64 = await blob2Base64(blob)
//       // 使用 base64 是为了方便将 DOM 生成图片
//       this.download[name] = b64
//       // document.head.appendChild(generateFontStyle(name, b64));
//     },
//   }
// }
