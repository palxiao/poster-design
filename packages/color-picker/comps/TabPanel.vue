<template>
  <div class="tab-panel" :style="rootStyle">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TabPanel',
}
</script>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'

const vm = getCurrentInstance()
vm.parent.exposed.tabs.value.push(vm)

defineProps({
  // Tabs 会用到 label
  label: {
    type: String,
    required: true,
  },
  // Giá trị định danh tab; bỏ trống thì dùng label
  name: {
    type: String,
    default: '',
  },
})

const active = ref(false)
const rootStyle = computed(() => ({
  display: active.value ? 'block' : 'none',
}))

function changeActive(value) {
  active.value = value
}

defineExpose({
  changeActive,
})
</script>
