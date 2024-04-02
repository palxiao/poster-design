/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-17 15:00:00
 * @Description: Base全局状态管理
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-18 21:00:00
 */

import { Store, defineStore } from 'pinia'

// import actions from './actions'
// import _config from '@/config'

type TStoreBaseState = {
  loading: boolean | null
  scroll: boolean
  /** fonts */
  fonts: string[]
}

type TUserAction = {
  hideLoading: () => void
  setFonts: (list: string[]) => void
}

/** Base全局状态管理 */
const useBaseStore = defineStore<'base', TStoreBaseState, {}, TUserAction>('base', {
  state: () => ({
    loading: null,
    scroll: true,
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
  }
})

export type TBaseStore = Store<'base', TStoreBaseState, {}, TUserAction>

export default useBaseStore

