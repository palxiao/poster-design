/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-17 15:00:00
 * @Description: User全局状态管理
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-17 15:00:00
 */

import { defineStore } from "pinia"

type TUserStoreState = {
  /** 登录状态 */
  online: boolean
  /** 储存用户信息 */
  user: {
    name: string | null
  }
  /**是否为管理员模式 */
  manager: string
  /** 管理员是否正在编辑模板 */
  tempEditing: boolean
}

type TUserAction = {
  /** 修改登录状态 */
  changeOnline: (state: boolean) => void
  /** 修改登录用户 */
  changeUser: (userName: string) => void
  managerEdit: (status: boolean) => void
}

const useUserStore = defineStore<'userStore', TUserStoreState, {}, TUserAction>('userStore', {
  state: () => ({
    online: true, // 登录状态，
    user: {
      name: localStorage.getItem('username'),
    }, // 储存用户信息
    manager: '', // 是否为管理员模式
    tempEditing: false, // 管理员是否正在编辑模板
  }),
  actions: {
    changeOnline(status: boolean) {
      this.online = status
    },
    changeUser(name: string) {
      this.user.name = name
      // state.user = Object.assign({}, state.user)
      // state.user = { ...state.user }
      localStorage.setItem('username', name)
    },
    managerEdit(status: boolean) {
      this.tempEditing = status
    },
    
  }
})

export default useUserStore
