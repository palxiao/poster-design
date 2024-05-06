<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-09 11:24:57
 * @Description: 创建/编辑画布尺寸
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 17:11:59
-->
<template>
  <div>
    <el-dialog v-model="dialogVisible" center destroy-on-close :align-center="false" :title="params ? '编辑尺寸' : '新建空白设计'" width="380" draggable>
      <!-- <el-divider content-position="left">自定义尺寸</el-divider> -->
      <el-checkbox v-if="params" v-model="isAdaptive" label="自动调整元素大小位置" size="large" />
      <sizeEditor :params="page" :class="params ? 'editor-mode' : 'add-mode'">
        <el-button @click="finish" plain size="large" type="primary">{{ params ? '应用' : '创建' }}</el-button>
      </sizeEditor>
      <el-divider content-position="left">使用推荐尺寸</el-divider>
      <ul class="pre-list">
        <li @click="applySize(s)" class="item" v-for="(s, si) in sizes" :key="'s' + si">
          <i :class="['icon', s.icon]" /> {{ s.name }} <span class="info">{{ s.width }} × {{ s.height }} px</span>
        </li>
      </ul>
      <!-- <template #footer>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </template> -->
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { ElCheckbox } from 'element-plus'
import { useRouter } from 'vue-router'
import sizeEditor from './sizeEditor.vue'
import sizes from '@/assets/data/PageSizeData'
import { useWidgetStore, useControlStore } from '@/store';

const router = useRouter()
const controlStore = useControlStore()
const widgetStore = useWidgetStore()
const props = withDefaults(
  defineProps<{
    params?: any
  }>(),
  {
    params: undefined,
  },
)
const dialogVisible: Ref<boolean> = ref(false)
const isAdaptive: Ref<boolean> = ref(true)
const page: any = ref({ width: 100, height: 100 })

const applySize = ({ width, height }: any) => {
  page.value.width = width
  page.value.height = height
}

const open = () => {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  if (props.params) {
    page.value.width = props.params.width
    page.value.height = props.params.height
  }
  dialogVisible.value = true
}

function finish() {
  const { width, height } = page.value
  if (props.params) {
    const lastPageData = JSON.parse(JSON.stringify(props.params))
    props.params.width = width
    props.params.height = height
    isAdaptive.value && widgetStore.autoResizeAll(lastPageData)
  } else window.open(router.resolve(`/home?mode=create&w_h=${width}*${height}`).href, '_blank')
}

defineExpose({
  open,
})
</script>

<style lang="less" scoped>
:deep(.el-dialog__header) {
  padding-bottom: 7px !important;
}
.editor-mode {
  padding: 0 0 0.5rem 0;
}
.add-mode {
  padding: 1rem 0 0.5rem 0;
}
.pre-list {
  margin: 1rem 0;
  height: 245px;
  overflow-y: scroll;
  .item {
    padding: 10px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    color: #333;
    .icon {
      margin-right: 0.2rem;
    }
    .info {
      margin-left: 0.4rem;
      font-size: 12px;
      color: #b4b8bf;
    }
  }
  .item:hover {
    background-color: #f6f7f9;
  }
}
</style>
