<template>
  <el-form
    ref="transitionRef"
    style="max-width: 600px"
    :model="transition"
    :rules="rules"
    label-width="auto"
    class="demo-transition"
    :size="formSize"
    status-icon
  >
    <el-form-item label="动画" prop="animate">
      <div @click="drawer = true">click me</div>
    </el-form-item>
    <el-form-item label="播放速度" prop="speed">
      <el-segmented v-model="transition.speed" :options="speedOptions" />
    </el-form-item>
    <!-- <el-form-item label="Activity zone" prop="region">
      <el-select v-model="transition.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item> -->
    <el-form-item label="循环播放" prop="isRepeat">
      <el-switch v-model="transition.isRepeat" />
    </el-form-item>
    <el-form-item label="循环次数" prop="repeatTime">
      <el-input-number v-model="transition.repeatTime" :min="1" :max="999" @change='getParams' />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElInputNumber } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

type TProps = {
    transition: any,
    drawer: Boolean,
  }
  const props = withDefaults(defineProps<TProps>(), {
    transition: {},
    drawer: false,
  })
// interface transition {
//   animate: String,
//   animateName: String,
//   duration: Number, 
//   delay: Number, 
//   speed: String, 
//   isRepeat: Boolean, 
//   repeatTime: Number, // 循环次数，1表示一次之后就停止
//   isPreview: Boolean, // 是否预览，一次之后就停止
// }

const formSize = ref<ComponentSize>('default')
const transitionRef = ref<FormInstance>()
// const transition = reactive<transition>({
//   animate: '',
//   animateName: '',
//   duration: 0, 
//   delay: 0, 
//   speed: 'fast', 
//   isRepeat: false, 
//   repeatTime: 1, // 循环次数，1表示一次之后就停止
// })
// transition.value = props.params.transition;
const speedOptions = ['slow', 'slower', 'fast', 'faster']

// const rules = reactive<FormRules<transition>>({
//   name: [
//     { required: true, message: 'Please input Activity name', trigger: 'blur' },
//     { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
//   ],
//   region: [
//     {
//       required: true,
//       message: 'Please select Activity zone',
//       trigger: 'change',
//     },
//   ],
//   count: [
//     {
//       required: true,
//       message: 'Please select Activity count',
//       trigger: 'change',
//     },
//   ],
//   date1: [
//     {
//       type: 'date',
//       required: true,
//       message: 'Please pick a date',
//       trigger: 'change',
//     },
//   ],
//   date2: [
//     {
//       type: 'date',
//       required: true,
//       message: 'Please pick a time',
//       trigger: 'change',
//     },
//   ],
//   location: [
//     {
//       required: true,
//       message: 'Please select a location',
//       trigger: 'change',
//     },
//   ],
//   type: [
//     {
//       type: 'array',
//       required: true,
//       message: 'Please select at least one activity type',
//       trigger: 'change',
//     },
//   ],
//   resource: [
//     {
//       required: true,
//       message: 'Please select activity resource',
//       trigger: 'change',
//     },
//   ],
//   desc: [
//     { required: true, message: 'Please input activity form', trigger: 'blur' },
//   ],
// })

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
  console.log(props.transition.value)
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }

</script>
