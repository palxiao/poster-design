/*
 * @Author: ShawnPhang
 * @Date: 2021-12-16 16:20:16
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-17 15:00:00
 */

import { defineStore } from 'pinia'

// import actions from './actions'
// import _config from '@/config'

type TStoreBaseState = {
  loading: boolean | null
  scroll: boolean
  /** fonts */
  fonts: string[]
  /** 抠图服务 */
  app: string | null
}

type TUserAction = {
  hideLoading: () => void
  setFonts: (list: string[]) => void
}

const useBaseStore = defineStore<'base', TStoreBaseState, {}, TUserAction>('base', {
  state: () => ({
    loading: null,
    scroll: true,
    fonts: [], // 缓存字体列表
    app: null, // 抠图服务
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

export default useBaseStore

// const all = {
//   state: {
//     loading: null,
//     online: true, // 登录状态，
//     user: {
//       name: localStorage.getItem('username'),
//     }, // 储存用户信息
//     scroll: true,
//     manager: '', // 是否为管理员模式
//     tempEditing: false, // 管理员是否正在编辑模板
//     fonts: [], // 缓存字体列表
//     app: null, // 抠图服务
//   },
//   getters: {
//     online: (state: Type.Object) => {
//       return state.online
//     },
//     user: (state: Type.Object) => {
//       return state.user
//     },
//     manager: (state: Type.Object) => {
//       return state.manager
//     },
//     tempEditing: (state: Type.Object) => {
//       return state.tempEditing
//     },
//     fonts: (state: Type.Object) => {
//       return state.fonts
//     },
//   },
//   mutations: {
//     ...mutations,
//   },
//   actions: {
//     ...actions,
//   },
// }

