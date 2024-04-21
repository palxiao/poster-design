<template>
  <el-form
    ref="transitionRef"
    style="width: 700px"
    :model="params.transition"
    :rules="rules"
    label-width="auto"
    class="demo-transition"
    :size="formSize"
    status-icon
  >
    <el-form-item label="动画效果" prop="animate">
      <div @click="$emit('openDrawer')">{{params.transition.animateName || '请选择'}}</div>
    </el-form-item>
    <el-form-item label="播放速度" prop="speed">
      <el-radio-group v-model="params.transition.speed" size="small">
        <el-radio-button v-for="(item, i) in speedOptions" :key="i" :label="item.label" :value="item.value" />
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="Activity zone" prop="region">
      <el-select v-model="params.transition.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item> -->
    <el-form-item label="循环播放" prop="isRepeat">
      <el-switch v-model="params.transition.isRepeat" />
    </el-form-item>
    <el-form-item label="循环次数" v-if="params.transition.isRepeat" prop="repeatTime">
      <el-input-number v-model="params.transition.repeatTime" :min="1" :max="999" @change='getParams' />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElInputNumber,ElRadioGroup, ElRadioButton } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

type TProps = {
    params: any,
  }
  const props = withDefaults(defineProps<TProps>(), {
    params: {},
  })
interface transition {
  animate: String,
  animateName: String,
  duration: Number, 
  delay: Number, 
  speed: String, 
  isRepeat: Boolean, 
  repeatTime: Number, // 循环次数，1表示一次之后就停止
  isPreview: Boolean, // 是否预览，一次之后就停止
}

const formSize = ref<ComponentSize>('default')
const transitionRef = ref<FormInstance>()
const defaultTransition = reactive<transition>({
  animate: '',
  animateName: '',
  duration: 0, 
  delay: 0, 
  speed: 'fast', 
  isRepeat: false, 
  repeatTime: 1, // 循环次数，1表示一次之后就停止
})
let transition = reactive(props.params?.transition || defaultTransition)

// params.transition.value = props.params.transition;
const speedOptions = [
  {value: 'slower', label: '最慢'},
  {value: 'slow', label: '慢速'},
  {value: 'fast', label: '快速'},
  {value: 'faster', label: '最快'}
]

const rules = reactive<FormRules<transition>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  location: [
    {
      required: true,
      message: 'Please select a location',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
function getParams(){
  
console.log(props)
console.log(props.params)
  console.log(params.transition.value)
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }

</script>
