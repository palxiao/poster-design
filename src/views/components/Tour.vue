<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-04 03:05:45
 * @Description: 漫游导航
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-05 05:31:01
-->
<template>
  <el-tour v-model="isShow">
    <el-tour-step :target="steps[0]?.$el" title="文件管理">
      <div>点击文件菜单，管理你的设计，设置页面视图等操作。</div>
    </el-tour-step>
    <el-tour-step placement="right" :target="steps[1]?.$el" title="左侧工具栏" description="在这里可以选择模板开始设计，或是挑选文字、图片等素材拖拽至画布中。" />
    <el-tour-step placement="left" :target="steps[2]?.$el" title="右侧属性栏" description="当选中画布中的元素时，在此处会显示相应的编辑界面；同时也可以切换到“图层”管理。" />
    <el-tour-step :target="steps[3]?.$el" title="下载作品" description="点击此处即可导出当前作品，赶紧试试吧。" />
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
