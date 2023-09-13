/*
 * @Author: ShawnPhang
 * @Date: 2021-12-16 16:20:16
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-13 10:05:03
 */
import mutations from './mutations'
import actions from './actions'
import { client } from '@gradio/client'

const all = {
  state: {
    loading: null,
    online: true, // 登录状态，
    user: {
      name: localStorage.getItem('username'),
    }, // 储存用户信息
    scroll: true,
    manager: '', // 是否为管理员模式
    tempEditing: false, // 管理员是否正在编辑模板
    fonts: [], // 缓存字体列表
    app: null, // 抠图服务
  },
  getters: {
    online: (state: Type.Object) => {
      return state.online
    },
    user: (state: Type.Object) => {
      return state.user
    },
    manager: (state: Type.Object) => {
      return state.manager
    },
    tempEditing: (state: Type.Object) => {
      return state.tempEditing
    },
    fonts: (state: Type.Object) => {
      return state.fonts
    },
    app: async (state: Type.Object) => {
      !state.app && (state.app = await client('https://kt.palxp.com'))
      return state.app
    },
  },
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
  },
}
export default all
