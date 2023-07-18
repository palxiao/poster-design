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
      <textarea :maxlength="max" :class="{ 'real-input': true, disable: !editable }" type="text" rows="3" :value="dealValue" :readonly="editable ? false : 'readonly'" @input="updateValue($event.target.value)" @focus="focusInput" @blur="blurInput" />
    </div>
  </div>
</template>

<script>
// 文本域输入组件
const NAME = 'text-input-area'

export default {
  name: NAME,
  props: {
    label: {
      default: '',
    },
    modelValue: {
      default: '',
    },
    editable: {
      default: true,
    },
    max: {},
  },
  emits: ['update:modelValue', 'finish'],
  data() {
    return {
      inputBorder: false,
      tagText: '',
    }
  },
  computed: {
    dealValue() {
      return this.modelValue
      // return this.modelValue.replace(/<br\/>/g, '\r\n').replace(/&nbsp;/g, ' ')
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('update:modelValue', this.getValue(value))
    },
    focusInput() {
      this.inputBorder = true
      this.tagText = this.modelValue
    },
    blurInput() {
      this.inputBorder = false
      let v = this.getValue(this.modelValue)
      if (v !== this.tagText) {
        this.$emit('finish', v)
      }
    },
    getValue(value) {
      return value.replace(/\n|\r\n/g, '<br/>').replace(/ /g, '&nbsp;')
    },
  },
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
