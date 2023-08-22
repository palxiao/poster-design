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
  <div class="number-input2">
    <div class="input-wrap" @click="edit">
      <input :class="{ 'real-input': true, disable: !editable }" type="text" :value="modelValue" :readonly="editable ? false : 'readonly'" @input="updateValue($event.target.value)" @focus="focusInput" @blur="blurInput" @keyup="verifyNumber" @keydown="(e) => opNumber(e)" />
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

<script>
// 数字输入组件
const NAME = 'number-input'

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
    step: {
      default: 1,
    },
    maxValue: {},
  },
  emits: ['finish', 'update:modelValue'],
  data() {
    return {
      inputBorder: false,
      tagText: '',
      showEdit: false,
    }
  },
  computed: {},
  watch: {
    modelValue() {
      this.fixedNum()
    },
  },
  mounted() {
    this.fixedNum()
  },
  methods: {
    fixedNum() {
      // 小数点过长时
      const decimal = String(this.modelValue).split('.')[1]
      if (decimal && decimal.length > 2) {
        setTimeout(() => {
          this.updateValue(Number(this.modelValue).toFixed(2))
        }, 10)
      }
      // 超过阈值时
      if (this.maxValue && this.modelValue > this.maxValue) {
        setTimeout(() => {
          this.updateValue(Number(this.maxValue))
        }, 10)
      }
    },
    updateValue(value) {
      this.$emit('update:modelValue', value)
    },
    up() {
      this.updateValue(parseInt(this.modelValue || 0, 10) + this.step)
    },
    down() {
      let value = parseInt(this.modelValue || 0, 10) - this.step
      if (value < 0) {
        value = 0
      }
      this.updateValue(value)
    },
    opNumber(e) {
      e.stopPropagation()
      switch (e.keyCode) {
        case 38:
          this.up()
          return
        case 40:
          this.down()
          return
      }
    },
    verifyNumber() {
      let value = String(this.modelValue)
      let len = value.length
      let newValue = ''
      for (let i = 0; i < len; ++i) {
        let c = value[i]
        if (c >= '0' && c <= '9') {
          newValue += c
        } else {
          break
        }
      }
      if (newValue === '') {
        newValue = '0'
      }
      this.updateValue(parseInt(newValue, 10))
    },
    focusInput() {
      this.inputBorder = true
      this.tagText = this.modelValue
    },
    blurInput() {
      this.inputBorder = false
      if (this.modelValue !== this.tagText) {
        this.$emit('finish', this.modelValue)
      }
    },
  },
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
</style>
