/*
 * @Author: Jeremy-Yu
 * @Date: 2024-02-14 14:58:48
 * @Description: 同意处理vue3 Mapgetters 已废弃
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-22 18:11:15
 */

// import { ComputedRef, computed } from 'vue'


// export function useSetupMapGetters<T extends string>(strList: T[]) {
//   const mapData: Partial<{[x in T]: ComputedRef}> = {}
//   const getters = useStore().getters

//   strList.forEach(val => {
//     mapData[val] = computed(() => getters[val])
//   })

//   return mapData as {[x in T]: ComputedRef}
// }
