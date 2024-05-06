<template>
  <el-dialog
    v-model="show"
    title="新增作品"
    width="500"
    destroy-on-close
    center
  >
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
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElForm, ElFormItem, ElOption, ElSelect } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
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
type TProps = {
  visible: Boolean
}
const {visible} = defineProps<TProps>()
console.log(visible);

let show = ref(visible);
console.log(show);

function cancel(){
  show.value = !show.value
  emits('cb', show.value)
}
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(formEl);
  
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(ruleForm);
      emits('cb', ruleForm)
      cancel()
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>
