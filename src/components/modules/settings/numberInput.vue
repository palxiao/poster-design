<template>
  <!-- <div class="number-input">
    <p v-if="label" class="input-label">
      {{ label }}
    </p>
    <div :class="{ 'input-wrap': true, active: inputBorder }">
      <input :class="{ 'real-input': true, disable: !editable }" type="text" :value="modelValue" :readonly="editable ? false : 'readonly'" @input="updateValue($event.target.value)" @focus="focusInput" @blur="blurInput" @keyup="verifyNumber" @keydown="(e) => opNumber(e)" />
      <div v-if="editable" class="op-btn">
        <div class="up" @click="up"><i class="iconfont icon-up" /></div>
        <div class="down" @click="down"><i class="iconfont icon-down" /></div>
      </div>
    </div>
  </div> -->
  <div v-if="type === 'simple'">
    <span class="prepend">{{ prepend }}</span>
    <input
      :class="{ 'small-input': true, disable: !editable }" type="text" :value="modelValue"
      :readonly="!props.editable" 
      @input="updateValue($event && $event.target ? ($event.target as HTMLInputElement).value : '')"
      @focus="focusInput"
      @blur="blurInput"
      @keyup="verifyNumber"
      @keydown="(e) => opNumber(e)" />
  </div>
  <div v-else class="number-input2">
    <div class="input-wrap">
      <input
        :class="{ 'real-input': true, disable: !editable }"
        type="text" :value="modelValue" :readonly="!props.editable"
        @input="updateValue($event && $event.target ? ($event.target as HTMLInputElement).value : '')"
        @focus="focusInput"
        @blur="blurInput"
        @keyup="verifyNumber"
        @keydown="(e) => opNumber(e)"
      />
    </div>
    <span style="color: rgba(0, 0, 0, 0.45)">{{ label }}</span>
    <!-- <div :class="{ 'input-wrap': true, active: inputBorder }">
      <input :class="{ 'real-input': true, disable: !editable }" type="text" :value="modelValue" :readonly="editable ? false : 'readonly'" @input="updateValue($event.target.value)" @focus="focusInput" @blur="blurInput" @keyup="verifyNumber" @keydown="(e) => opNumber(e)" />
      <div v-if="editable" class="op-btn">
        <div class="up" @click="up"><i class="iconfont icon-up" /></div>
        <div class="down" @click="down"><i class="iconfont icon-down" /></div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
// 数字输入组件
// const NAME = 'number-input'

type TProps = {
  label?: string
  modelValue?: string | number
  editable?: boolean
  step?: number
  maxValue?: string | number
  minValue?: string | number
  type?: string
  prepend?: string
}

type TEmits = {
  (event: 'finish', data: number | string): void
  (event: 'update:modelValue', data: number | string): void
}

const props = withDefaults(defineProps<TProps>(), {
  label: '',
  modelValue: '',
  editable: true,
  step: 1
})

const emit = defineEmits<TEmits>()

const inputBorder = ref<boolean>(false)
const tagText = ref<string | number>('')
const showEdit = ref<boolean>(false)

watch(
  () => props.modelValue,
  () => fixedNum()
)


onMounted(() => {
  fixedNum()
})

function fixedNum() {
  // 小数点过长时
  const decimal = String(props.modelValue).split('.')[1]
  if (decimal && decimal.length > 2) {
    setTimeout(() => {
      updateValue(Number(props.modelValue).toFixed(2))
    }, 10)
  }
  // 限定数字范围
  if (props.maxValue && props.modelValue > props.maxValue) {
    setTimeout(() => {
      updateValue(Number(props.maxValue))
    }, 10)
  } else if (typeof props.minValue === 'number' && Number(props.modelValue) < Number(props.minValue)) {
    setTimeout(() => {
      updateValue(Number(props.minValue))
    }, 10)
  }
}

function updateValue(value: string | number) {
  emit('update:modelValue', value === '-' ? '-' : Number(value))
}

function up() {
  updateValue(parseInt(`${props.modelValue}` ?? '0', 10) + props.step)
}
function down() {
  let value = parseInt(`${props.modelValue}` ?? '0', 10) - props.step
  updateValue(value)
}

function opNumber(e: KeyboardEvent) {
  e.stopPropagation()
  switch (e.keyCode) {
    case 38:
      up()
      return
    case 40:
      down()
      return
  }
}
function verifyNumber() {
  let value = String(props.modelValue)
  let len = value.length
  let newValue = ''
  let isNegative = value[0] === '-'
  // 判断是否连续字符，否则置为0
  for (let i = isNegative ? 1 : 0; i < len; ++i) {
    let c = value[i]
    if (c == '.' || (c >= '0' && c <= '9')) {
      newValue += c
    } else {
      break
    }
  }
  if (newValue === '') {
    newValue = '0'
  }
  if (isNegative) {
    newValue = '-' + (newValue === '0' ? '' : newValue)
  }
  updateValue(newValue)
  // this.updateValue(parseInt(newValue, 10))
}

function focusInput() {
  inputBorder.value = true
  tagText.value = props.modelValue
}

function blurInput() {
  if (props.modelValue === '-') {
    updateValue(0)
  }
  inputBorder.value = false
  if (props.modelValue !== tagText.value) {
    emit('finish', props.modelValue)
  }
}
</script>

<style lang="less" scoped>
@color0: #e1e1e1; // Appears 2 times
@color1: #d1d1d1; // Appears 2 times

.number-input {
  height: 60px;
  line-height: 1.15;
  width: 60px;
  .input-label {
    user-select: none;
    font-size: 12px;
    line-height: 12px;
    padding: 8px 0;
  }
  .input-wrap {
    border-radius: 3px;
    border: 1px solid @color0;
    display: flex;
    flex-direction: row;
    width: 60px;
    .real-input {
      border-radius: 3px;
      border: 0px;
      font-size: 12px;
      height: 30px;
      outline: none;
      padding: 5px;
      text-align: center;
      width: 100%;
    }
    .real-input.disable {
      color: #666666;
      cursor: not-allowed;
    }
    .op-btn {
      border-left: 1px solid @color0;
      display: flex;
      flex-direction: column;
      height: 30px;
      width: 14px;
      .up,
      .down {
        width: 13px;
        transform: scale(0.8);
        .iconfont {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
        }
        .iconfont:hover {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.9);
        }
      }
      // .down {

      // }
    }
  }
  .input-wrap.active {
    border: 1px solid rgba(59, 116, 241, 0.7);
    box-shadow: 1px 1px 5px 2px rgba(59, 116, 241, 0.1);
  }
}

.number-input2 {
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 45%;
  height: 40px;
  background: #f3f5f7;
  border-radius: 4px;
  font-size: 14px;
  color: #33383e;
  padding: 0 16px 0 11px;
  cursor: pointer;
  .input-wrap {
    display: flex;
  }
  .real-input {
    background: transparent;
    border-radius: 3px;
    border: 0px;
    font-size: 12px;
    height: 30px;
    outline: none;
    padding: 5px;
    text-align: left;
    width: 100%;
  }
}
.small-input {
  font-size: 12px;
  width: 100%;
  padding: 4px 7px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: text;
}
.prepend {
  font-size: 12px;
  position: absolute;
  margin: -14px 0 0 3px;
  transform: scale(0.85);
  transform-origin: left;
  color: #888888;
}
</style>
