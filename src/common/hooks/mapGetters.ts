import { ComputedRef, computed } from 'vue'
import { useStore } from 'vuex'

export function useSetupMapGetters<T extends string>(strList: T[]) {
  const mapData: Partial<{[x in T]: ComputedRef}> = {}
  const getters = useStore().getters

  strList.forEach(val => {
    mapData[val] = computed(() => getters[val])
  })

  return mapData as {[x in T]: ComputedRef}
}
