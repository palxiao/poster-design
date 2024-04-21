<template>
  <el-form
    ref="transitionRef"
    style="width: 700px"
    :model="transition"
    label-width="90px"
    class="demo-transition"
    :size="formSize"
    status-icon
  >
    <el-form-item label="动画效果" prop="animate">
      <div style="width: 100%;cursor: pointer;" @click="$emit('openDrawer')">{{transition.animateName || '请选择'}}</div>
    </el-form-item>
    <el-form-item label="播放速度" prop="speed">
      <el-radio-group v-model="transition.speed" size="small">
        <el-radio-button v-for="(item, i) in speedOptions" :key="i" :label="item.label" :value="item.value" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="延时播放" prop="delay">
      <el-input-number v-model="transition.delay" :min="0" :max="999" />
    </el-form-item>
    <el-form-item label="播放时长" prop="duration">
      <el-input-number v-model="transition.duration" :min="0" :max="999" />
    </el-form-item>
    <el-form-item label="循环播放" prop="isRepeat">
      <el-switch v-model="transition.isRepeat" />
    </el-form-item>
    <el-form-item label="循环次数" v-if="transition.isRepeat" prop="repeatTime">
      <el-input-number v-model="transition.repeatTime" :min="0" :max="999"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { ElForm, ElFormItem, ElInputNumber,ElRadioGroup, ElRadioButton } from 'element-plus'
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

  type TProps = {
      transition: any,
    }
  const props = withDefaults(defineProps<TProps>(), {
    transition: {
      animate: '',
      animateName: '',
      duration: 0, 
      delay: 0, 
      speed: 'fast', 
      isRepeat: false, 
      repeatTime: 1, // 循环次数，1表示一次之后就停止
    },
  })

  const formSize = ref<ComponentSize>('default')
  // 定义速度集合
  const speedOptions = [
    {value: 'slower', label: '最慢'},
    {value: 'slow', label: '慢速'},
    {value: 'fast', label: '快速'},
    {value: 'faster', label: '最快'}
  ]
  
  function getParams(){
    console.log(props)
    console.log(props.transition.value)
  }
  console.log(props.transition)
</script>
