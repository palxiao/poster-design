/*
 * @Author: ShawnPhang
 * @Date: 2022-03-10 23:05:03
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-11 10:13:42
 */
// export default function handleHistory(store: any, action: any) {
//   store.commit('setShowMoveable', false) // 清理掉上一次的选择框
//   const history = store.state.dHistory
//   const pageHistory = store.state.dPageHistory
//   const historyParams = store.state.dHistoryParams
//   if (action === 'undo') {
//     historyParams.index -= 1 // 下标向前移1 撤销
//     console.log(historyParams.index)
//     if (historyParams.index > -1) {
//       store.state.dWidgets = JSON.parse(history[historyParams.index])
//       store.state.dPage = JSON.parse(pageHistory[historyParams.index])
//     }
//   } else if (action === 'redo') {
//     historyParams.index += 1 // 下标向后移1 重做
//     // 如果下标小于历史记录列表长度，直接取出历史记录
//     // if (historyParams.index < historyParams.length) {
//     store.state.dWidgets = JSON.parse(history[historyParams.index])
//     store.state.dPage = JSON.parse(pageHistory[historyParams.index])
//     // } else {
//     //   // 否则设置下标为列表最后一项
//     //   historyParams.index = historyParams.length - 1
//     //   store.state.dWidgets = JSON.parse(history[historyParams.index])
//     //   store.state.dPage = JSON.parse(pageHistory[historyParams.index + 1])
//     // }
//   }
// }

// function handleHistory_old(store: any, action: any) {
//   store.commit('setShowMoveable', false) // 清理掉上一次的选择框
//   const history = store.state.dHistory
//   // const uuidHistory = store.state.dActiveUuidHistory
//   const pageHistory = store.state.dPageHistory
//   const historyParams = store.state.dHistoryParams

//   // let uuid = '-1'
//   console.log(action, historyParams)

//   if (action === 'undo') {
//     // 下标向前移1 撤销
//     historyParams.index -= 1
//     // 如果下表大于等于0，直接取出历史记录
//     if (historyParams.index >= 0) {
//       console.log(1, history)
//       console.log(2, pageHistory)

//       store.state.dWidgets = JSON.parse(history[historyParams.index])
//       store.state.dPage = JSON.parse(pageHistory[historyParams.index + 1])
//       // uuid = uuidHistory[historyParams.index]
//     } else if (historyParams.length < 10) {
//       // 否则如果历史记录长度小于10，则设置组件为空
//       historyParams.index = -1
//       store.state.dWidgets = []
//       store.state.dPage = JSON.parse(pageHistory[0])
//     } else {
//       historyParams.index = -1
//     }
//   } else if (action === 'redo') {
//     // 下标向后移1 重做
//     historyParams.index += 1
//     // 如果下标小于历史记录列表长度，直接取出历史记录
//     if (historyParams.index < historyParams.length) {
//       console.log(1, history)
//       console.log(2, pageHistory)
//       store.state.dWidgets = JSON.parse(history[historyParams.index])
//       store.state.dPage = JSON.parse(pageHistory[historyParams.index + 1] || pageHistory[historyParams.index])
//       // uuid = uuidHistory[historyParams.index]
//     } else {
//       // 否则设置下标为列表最后一项
//       historyParams.index = historyParams.length - 1
//       store.state.dWidgets = JSON.parse(history[historyParams.index])
//       store.state.dPage = JSON.parse(pageHistory[historyParams.index + 1])
//       // uuid = uuidHistory[historyParams.index]
//     }
//   }
//   // 激活组件默认为page
//   // let element = store.state.dPage
//   // if (uuid !== '-1') {
//   //   element = store.state.dWidgets.find((item) => item.uuid === uuid)
//   // }
//   // store.state.dActiveElement = element
// }
