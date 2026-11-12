<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-04 03:05:45
 * @Description: 漫游导航
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-05 05:31:01
-->
<template>
  <el-tour v-model="isShow">
    <el-tour-step :target="steps[0]?.$el" :title="$t('editor.tour.fileTitle')">
      <div>{{ $t('editor.tour.fileDesc') }}</div>
    </el-tour-step>
    <el-tour-step placement="right" :target="steps[1]?.$el" :title="$t('editor.tour.leftTitle')" :description="$t('editor.tour.leftDesc')" />
    <el-tour-step placement="left" :target="steps[2]?.$el" :title="$t('editor.tour.rightTitle')" :description="$t('editor.tour.rightDesc')" />
    <el-tour-step :target="steps[3]?.$el" :title="$t('editor.tour.downloadTitle')" :description="$t('editor.tour.downloadDesc')" />
  </el-tour>
</template>

<script setup lang="ts">
import { ElTour, ElTourStep } from 'element-plus'
import { ref } from 'vue'

type TProps = {
  steps: any,
}

const props = withDefaults(defineProps<TProps>(), {
  steps: [],
})

const isShow = ref(false)

const open = () => {
  isShow.value = true
}

defineExpose({
  open
})
</script>
