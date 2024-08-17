/*
 * @Author: ShawnPhang
 * @Date: 2023-07-11 14:21:33
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-08-17 15:56:39
 */
import Vue, { VNode } from 'vue'

declare global {
  namespace Type {
    export interface Object {
      [propName: string]: any
    }
  }
  namespace Ajax {
    // reqposne interface
    export interface GqlResult {
      [field: string]: any
    }

    // axios return data
    export interface Gql {
      [field: string]: GqlResult
    }

    export interface Result {
      [field: string]: any
    }
  }
}

declare module '*.vue' {
  export default Vue
}

declare module '~data'
declare module 'qrcode'
declare module '@antv/f2/*'
declare module 'dayjs'
declare module 'fontfaceobserver'
declare module 'throttle-debounce'
declare module 'html2canvas'
declare module 'psd.js'

declare module 'vue/types/vue' {
  interface Vue {
    $utils: Type.Object
    $nextTick: any
  }
}
