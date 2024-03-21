/*
 * @Author: ShawnPhang
 * @Date: 2021-12-16 16:20:16
 * @Description: 同步操作 store.commit() 调用
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-13 18:29:13
 */

// import { Toast } from 'vant'

export default {
  loading(state: Type.Object, data: any) {
    // Toast.clear();
    // let msg = ''
    // if (typeof data === 'string') {
    //     msg = data
    // } else {
    //     Toast.clear();
    //     return false
    // }
    // Toast.loading({
    //     duration: 0,       // 持续展示 toast
    //     loadingType: 'spinner',
    //     message: msg
    // });
  },
  changeRoute(state: Type.Object, from: string) {
    state.routeFrom = from
  },
  changeOnline(state: Type.Object, status: string) {
    state.online = status
  },
  changeUser(state: Type.Object, name: string) {
    state.user.name = name
    // state.user = Object.assign({}, state.user)
    state.user = { ...state.user }
    localStorage.setItem('username', name)
  },
  managerEdit(state: Type.Object, status: string) {
    state.tempEditing = status
  }
}
