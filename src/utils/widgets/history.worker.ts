/*
 * @Author: ShawnPhang
 * @Date: 2023-09-14 11:33:44
 * @Description: 历史记录处理（无效
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-18 20:06:51
 */
import diff from 'microdiff'
import { produce, applyPatches, enablePatches } from 'immer'
enablePatches()
const ops: any = {
  CHANGE: 'replace',
  CREATE: 'add',
  REMOVE: 'remove',
}
let cloneData = ''
onmessage = async (e) => {
  if (!e.data) {
    return
  }
  if (e.data.op === 'done') {
    if (!cloneData) return
    let fork = JSON.parse(cloneData)
    let curArray = JSON.parse(e.data.data)
    // 比较数据差异
    let diffData: any = diff(fork, curArray)
    // 生成差分补丁
    fork = produce(
      fork,
      (draft) => {
        for (const d of diffData) {
          d.op = ops[d.type]
        }
        draft = applyPatches(draft, diffData)
      },
      (patches, inversePatches) => {
        self.postMessage({ patches, inversePatches })
      },
    )
    cloneData = ''
  } else cloneData = e.data.data
}
