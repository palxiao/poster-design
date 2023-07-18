/*
 * @Author: ShawnPhang
 * @Date: 2022-03-04 19:36:00
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-11 10:12:50
 */
export default function pushHistory(store: any, msg: string) {
  console.log('history压栈', '来源: ' + msg)
  const history = store.state.dHistory
  const pageHistory = store.state.dPageHistory
  const historyParams = store.state.dHistoryParams // index = length - 1
  // 如果有上一次记录，并且与新纪录相同，那么不继续操作
  if (history[history.length - 1] && history[history.length - 1] === JSON.stringify(store.state.dWidgets)) {
    return
  }
  if (historyParams.index < history.length - 1) {
    const index = historyParams.index + 1
    const len = history.length - index
    history.splice(index, len)
    pageHistory.splice(index, len)
    historyParams.length = history.length
    historyParams.index = history.length - 1
  }
  history.push(JSON.stringify(store.state.dWidgets))
  pageHistory.push(JSON.stringify(store.state.dPage))
  historyParams.index = history.length - 1
  historyParams.length = history.length
}

function pushHistory_old(store: any) {
  // 历史记录列表
  const history = store.state.dHistory
  // 历史激活组件记录列表
  // const uuidHistory = store.state.dActiveUuidHistory
  // 历史page记录列表
  const pageHistory = store.state.dPageHistory
  // 历史记录列表参数（长度和下标）
  const historyParams = store.state.dHistoryParams

  // 下标不等于-1表示已经存在历史操作记录
  // 下标小于历史列表长度-1，则说明不是在末尾添加记录，需要先删除掉下标之后的数据，否则会出现错乱
  if (historyParams.index < history.length - 1) {
    const index = historyParams.index + 1
    const len = history.length - index
    // 删除下标之后的所有历史记录
    history.splice(index, len)
    // 删除下标之后的所有uuid记录
    // uuidHistory.splice(index, len)
    // 删除下标之后的所有page记录
    pageHistory.splice(index + 1, len - 1)
    historyParams.length = history.length
  }
  // 保存当前操作进历史记录
  if (history[history.length - 1] !== JSON.stringify(store.state.dWidgets)) {
    history.push(JSON.stringify(store.state.dWidgets))
    // uuidHistory.push(store.state.dActiveElement.uuid)
    pageHistory.push(JSON.stringify(store.state.dPage))
    historyParams.index = history.length - 1
    historyParams.length = history.length
  }
  // 历史记录最多n条，如果超过则从头部开始删，因为每次都是一条一条加的，所以只需删一条就行
  if (history.length > 20) {
    history.splice(0, 1)
    // uuidHistory.splice(0, 1)
    pageHistory.splice(0, 1)
  }
  if (pageHistory.length - 1 > history.length) {
    pageHistory.splice(0, 1)
  }
  // historyParams.index = history.length - 1
  // historyParams.length = history.length
}
