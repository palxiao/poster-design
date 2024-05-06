<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-09 11:24:57
 * @Description: 创建/编辑画布尺寸
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 17:11:59
-->
<template>
  <div>
    <el-dialog v-model="dialogVisible" top="30px" center destroy-on-close :align-center="false" :title="params ? '编辑尺寸' : '新建空白设计'" width="380" draggable>
      <el-form :model="ruleForm" label-width="auto" style="max-width: 600px" :rules="rules" ref="ruleFormRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="类型" prop="page_type">
          <el-select v-model="ruleForm.page_type" placeholder="请选择">
            <el-option label="长页" value="longPage" />
            <el-option label="翻页" value="turnPage" />
          </el-select>
        </el-form-item>
        <el-form-item label="宽度" prop="width">
          <el-input v-model="ruleForm.width" />
        </el-form-item>
        <el-form-item label="高度" prop="height">
          <el-input v-model="ruleForm.height" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </div>
      </template>
      <!-- <el-checkbox v-if="params" v-model="isAdaptive" label="自动调整元素大小位置" size="large" />
      <sizeEditor :params="page" :class="params ? 'editor-mode' : 'add-mode'">
        <el-button @click="finish" plain size="large" type="primary">{{ params ? '应用' : '创建' }}</el-button>
      </sizeEditor> -->
      <el-divider content-position="left">使用推荐尺寸</el-divider>
      <ul class="pre-list">
        <li @click="applySize(s)" class="item" v-for="(s, si) in sizes" :key="'s' + si">
          <i :class="['icon', s.icon]" /> {{ s.name }} <span class="info">{{ s.width }} × {{ s.height }} px</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, reactive } from 'vue'
import { ElForm, ElFormItem, ElOption, ElSelect, ElCheckbox } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import sizeEditor from './sizeEditor.vue'
import sizes from '@/assets/data/PageSizeData'
import { useWidgetStore, useControlStore } from '@/store';
interface FormType {
  name: String, // 名称
  page_type: String, // 类型
  height: Number, // 高
  width: Number, // 宽
}
// 表单参数
const ruleForm = reactive<FormType>({
  name: '', // 名称
  page_type: 'turnPage', // 类型
  width: 430, // 宽
  height: 932, // 高
})
// 表单校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<FormType>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  page_type: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  width: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  height: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
type TEmits = (event: 'cb', data: Object) => void
const emits = defineEmits<TEmits>()

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
  ruleForm.width = width
  ruleForm.height = height
}

const open = () => {
  controlStore.setShowMoveable(false) // 清理掉上一次的选择框
  if (props.params) {
    ruleForm.width = props.params.width
    ruleForm.height = props.params.height
  }
  dialogVisible.value = true
}

function finish() {
  const { width, height, name, page_type } = ruleForm
  if (props.params) {
    const lastPageData = JSON.parse(JSON.stringify(props.params))
    params.width = width
    params.height = height
    isAdaptive.value && widgetStore.autoResizeAll(lastPageData)
  } else window.open(router.resolve(`/home?mode=create&w_h=${width}*${height}&name=${name}&page_type=${page_type}`).href, '_blank')
}

const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(formEl);
  
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(ruleForm);
      finish()
    } else {
      console.log('error submit!', fields)
    }
  })
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
  height: 150px;
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
