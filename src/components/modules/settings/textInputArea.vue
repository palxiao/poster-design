<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-07 14:29:35
-->
<template>
  <div id="text-input-area">
    <p v-if="label" class="input-label">{{ label }}</p>
    <div :class="{ 'input-wrap': true, active: inputBorder }">
      <textarea
        :maxlength="max" :class="{ 'real-input': true, disable: !editable }" 
        type="text" rows="3" :value="dealValue" 
        :readonly="!editable" @input="updateValue(($event.target as HTMLTextAreaElement).value)"
        @focus="focusInput" @blur="blurInput"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
// 文本域输入组件
// const NAME = 'text-input-area'

type TProps = {
  label?: string
  modelValue?: string
  editable?: boolean
  max?: string | number
}

type TEmits = {
  (event:'update:modelValue', data: string): void
  (event: 'finish', data: string): void
}

const props = withDefaults(defineProps<TProps>(), {
  label: '',
  modelValue: '',
  editable: true,
})

const emit = defineEmits<TEmits>()
const inputBorder = ref(false)
const tagText = ref<string>('')

const dealValue = computed(() => {
  return props.modelValue
})

function updateValue(value: string) {
  emit('update:modelValue', getValue(value))
}

function focusInput() {
  inputBorder.value = true
  tagText.value = props.modelValue
}

function blurInput() {
  inputBorder.value = false
  let v = getValue(props.modelValue)
  if (v !== tagText.value) {
    emit('finish', v)
  }
}
function getValue(value: string) {
  return value
  // return value.replace(/\n|\r\n/g, '<br/>').replace(/ /g, '&nbsp;')
}
</script>

<style lang="less" scoped>
#text-input-area {
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  font-size: 12px;
  line-height: 12px;
  width: 100%;
  .input-label {
    user-select: none;
    padding-right: 14px;
    line-height: 28px;
    font-size: 14px;
    color: #9da3ac;
  }
  .input-wrap {
    border-radius: 3px;
    border: 1px solid #e1e1e1;
    flex: 1;
    padding: 5px;
    .real-input {
      border-radius: 3px;
      border: 0px;
      outline: none;
      resize: none;
      width: 100%;
    }
    .real-input.disable {
      color: #666666;
      cursor: not-allowed;
    }
  }
  .input-wrap.active {
    border: 1px solid rgba(59, 116, 241, 0.7);
    box-shadow: 1px 1px 5px 2px rgba(59, 116, 241, 0.1);
  }
}
</style>
