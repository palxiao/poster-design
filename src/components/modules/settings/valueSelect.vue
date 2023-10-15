<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-02 19:10:06
 * @Description: 选项选择（未拆分字体选择器）
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-14 21:03:17
-->
<template>
  <div id="value-select" ref="select" :style="{ width: inputWidth }">
    <p v-if="label" class="input-label">
      {{ label }}
    </p>
    <el-popover placement="bottom-end" width="auto">
      <!-- 单列表 -->
      <ul v-if="data && Array.isArray(data)" class="list-ul">
        <li v-for="listItem in data" :key="typeof listItem === 'object' ? listItem.alias : listItem" :class="{ active: listItem == innerValue }" @click="selectItem(listItem)">
          <img v-if="listItem.preview" class="preview" :src="listItem.preview" />
          <span v-else>{{ (typeof listItem === 'object' ? listItem.alias : listItem) + suffix }}</span>
        </li>
      </ul>
      <!-- tab分类列表 -->
      <div v-else class="tabs-wrap">
        <el-tabs v-model="activeTab">
          <el-tab-pane v-for="(val, key, i) in data" :key="'tab' + i" :label="key" :name="key">
            <ul class="list-ul">
              <li v-for="listItem in data[key]" :key="typeof listItem === 'object' ? listItem.alias : listItem" :class="{ active: listItem == innerValue }" @click="selectItem(listItem)">
                <img v-if="listItem.preview" class="preview" :src="listItem.preview" />
                <span v-else :style="{ fontFamily: `'${listItem.value}'` }">{{ (typeof listItem === 'object' ? listItem.alias : listItem) + suffix }}</span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #reference>
        <div :class="['input-wrap', { active: inputBorder }]" :style="{ width: inputWidth }">
          <!-- <img v-if="innerPreview" class="preview" :src="innerPreview" /> -->
          <input :style="{ fontFamily: modelValue.value }" :class="['real-input', { disable: !disable }]" :readonly="readonly ? 'readonly' : false" type="text" :value="showValue" @input="inputText" @focus="inputBorder = true" @blur="inputBorder = false" @keydown="(e) => opNumber(e)" />
          <!-- <span class="input-unit">{{ suffix }}</span> -->
          <div class="op-btn">
            <!-- <div class="down" @click="inputBorder = !inputBorder"></div> -->
            <i class="iconfont icon-down1"></i>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
// 下拉选择框
const NAME = 'value-input'
import { ElTabPane, ElTabs } from 'element-plus'

export default {
  name: NAME,
  components: { ElTabPane, ElTabs },
  props: {
    label: {
      default: '',
    },
    modelValue: {
      default: '',
    },
    suffix: {
      default: '',
    },
    data: {
      required: true,
    },
    disable: {
      default: true,
    },
    inputWidth: {
      default: '80px',
    },
    // textAlign: {
    //   default: 'center',
    // },
    readonly: {
      default: false,
    },
    step: {
      default: 1,
    },
  },
  emits: ['finish', 'update:modelValue'],
  data() {
    return {
      inputBorder: false,
      tagText: '',
      width: '0',
      innerValue: '',
      innerPreview: '',
      activeTab: '中文',
    }
  },
  computed: {
    showValue() {
      // return this.innerValue + this.suffix
      return this.innerValue
    },
  },
  watch: {
    modelValue(value) {
      this.innerValue = typeof this.modelValue === 'object' ? this.modelValue.alias : this.modelValue
    },
    inputBorder(value) {
      if (value) {
        this.tagText = this.innerValue
      } else {
        if (this.innerValue !== this.tagText) {
          this.$emit('finish', this.innerValue)
        }
      }
    },
  },
  created() {
    this.innerValue = typeof this.modelValue === 'object' ? this.modelValue.alias : this.modelValue
  },
  mounted() {
    this.width = this.$refs.select.offsetWidth
    // if (Object.prototype.toString.call(this.data) === '[Object Object]') {
    //   for (const key in this.data) {
    //     console.log(key)
    //     break
    //   }
    // }
  },
  methods: {
    selectItem(item) {
      let value = typeof item === 'object' ? item.alias : item
      if (this.innerValue !== value) {
        this.innerValue = value
        this.innerPreview = item.preview
        this.$emit('finish', item)
      }
    },
    inputText(e) {
      // this.innerValue = e.target.value.replace(RegExp(this.suffix), '')
      this.innerValue = e.target.value
      setTimeout(() => {
        this.$emit('finish', this.innerValue)
      }, 100)
    },
    opNumber(e) {
      e.stopPropagation()
      switch (e.keyCode) {
        case 38:
          typeof this.innerValue === 'number' && this.up()
          return
        case 40:
          typeof this.innerValue === 'number' && this.down()
          return
      }
    },
    up() {
      this.$emit('update:modelValue', parseInt(this.modelValue || 0, 10) + this.step)
    },
    down() {
      let value = parseInt(this.modelValue || 0, 10) - this.step
      if (value < 0) {
        value = 0
      }
      this.$emit('update:modelValue', value)
    },
  },
}
</script>

<style lang="less">
.value-select-list {
  min-width: 10px !important;
  padding: 5px !important;
}
</style>

<style lang="less" scoped>
// Color variables (appears count calculates by raw css)
@color0: #e1e1e1; // Appears 2 times
@color1: #d1d1d1; // Appears 2 times

#value-select {
  // height: 60px;
  line-height: 1.15;
  width: 80px;
  .input-label {
    user-select: none;
    // font-size: 12px;
    line-height: 22px;
    padding: 12px 0 10px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .input-unit {
    font-size: 14px;
    margin-right: 5px;
    line-height: 30px;
    color: #777;
  }
  .input-wrap {
    border-radius: 6px;
    // border: 1px solid @color0;
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 80px;
    background: #f3f5f7;
    height: 40px;
    .preview {
      overflow: hidden;
    }
    .real-input {
      background: transparent;
      border-radius: 3px;
      border: 0px;
      font-size: 14px;
      height: 40px;
      outline: none;
      padding: 6px;
      text-align: center;
      width: 100%;
    }
    .real-input.disable {
      color: #666666;
      cursor: not-allowed;
    }
    .op-btn {
      // border-left: 1px solid @color0;
      display: flex;
      align-items: center;
      // flex-direction: column;
      height: 40px;
      .icon-down1 {
        font-size: 24px;
        margin-right: 6px;
        color: @color1;
        line-height: 32px;
      }
      // .down {
      //   border-bottom-right-radius: 3px;
      //   flex: 1;
      //   position: relative;
      //   width: 13px;
      //   &:hover {
      //     background-color: @color1;
      //   }
      //   &:before {
      //     content: '';
      //     left: 50%;
      //     position: absolute;
      //     top: 50%;
      //     transform: translateY(-50%) translateX(-50%);
      //   }
      // }
    }
  }
  .input-wrap.active {
    // border: 1px solid rgba(59, 116, 241, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 1px 1px 5px 2px rgba(59, 116, 241, 0.1);
  }
}
.list-ul {
  max-height: 240px;
  overflow-y: auto;
  li {
    display: flex;
    align-items: center;
    color: #000000;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    padding: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background-color: @color1;
    }
  }
  li.active {
    color: #3b74f1;
  }
  .preview {
    // transform: scaleY(-1);
    height: 1.6em;
  }
}

.tabs-wrap {
  width: 210px;
}
</style>
