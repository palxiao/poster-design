/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-17 15:00:00
 * @Description: Base全局状态管理
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-08 17:00:12
 */

import { Store, defineStore } from 'pinia'

// import actions from './actions'
// import _config from '@/config'

type TStoreBaseState = {
  loading: boolean | null
  watermark: string | string[]
  /** fonts */
  fonts: string[]
}

type TUserAction = {
  hideLoading: () => void
  setFonts: (list: string[]) => void
  changeWatermark: (e: string[] | string) => void
}

/** Base全局状态管理 */
const useBaseStore = defineStore<'base', TStoreBaseState, {}, TUserAction>('base', {
  state: () => ({
    loading: null,
    watermark: ['阿仁邀请函', 'aren-design'],
    fonts: [], // 缓存字体列表
  }),
  actions: {
    /** 隐藏loading */
    hideLoading() {
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
    setFonts(list: string[]) {
      this.fonts = list
    },
    changeWatermark(wm: any) {
      this.watermark = wm
    }
  }
})

export type TBaseStore = Store<'base', TStoreBaseState, {}, TUserAction>

export default useBaseStore

