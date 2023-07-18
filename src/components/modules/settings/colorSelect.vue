<template>
  <div class="color__select">
    <p v-if="label" class="input-label">
      {{ label }}
    </p>
    <div class="content">
      <el-popover placement="left-end" width="auto">
        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <color-picker v-model:value="innerColor" :modes="['纯色']" @nativePick="dropColor" />
        <template #reference>
          <div class="color__bar" :style="{ background: innerColor }"></div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts">
const NAME = 'color-select'
import { defineComponent, toRefs, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'throttle-debounce'
import { toolTip } from '@/common/methods/helper'
// import colorPicker from '@/utils/plugins/color-picker/index.vue'
import colorPicker from '@palxp/color-picker'

export default defineComponent({
  name: NAME,
  components: { colorPicker },
  inheritAttrs: false,
  props: {
    label: {
      default: '',
    },
    modelValue: {
      default: '',
    },
  },
  emits: ['finish', 'update:modelValue'],
  setup(props, context) {
    const store = useStore()
    const state: any = reactive({
      innerColor: '#ffffffff',
      // colorLength: 0,
      // hasEyeDrop: 'EyeDropper' in window,
    })
    let first = true
    // const dColorHistory = computed(() => {
    //   return store.getters.dColorHistory
    // })

    onMounted(() => {
      state.innerColor = props.modelValue + (props.modelValue.length === 7 ? 'ff' : '')
    })
    const dropColor = async (e: any) => {
      console.log('取色: ', e)
    }

    watch(
      () => state.innerColor,
      (value) => {
        activeChange(value)
        if (first) {
          first = false
          return
        }
        // addHistory(value)
      },
    )
    watch(
      () => props.modelValue,
      (val) => {
        val !== state.innerColor && (state.innerColor = val)
      },
    )

    const updateValue = (value: any) => {
      context.emit('update:modelValue', value)
    }
    const activeChange = (value: any) => {
      updateValue(value)
    }
    const onChange = () => {
      context.emit('finish', state.innerColor)
    }
    // const addHistory = debounce(300, false, async (value) => {
    //   store.dispatch('pushColorToHistory', value)
    // })
    // const colorChange = debounce(150, false, async (e) => {
    //   state.innerColor = e + (e.length === 7 ? 'ff' : '')
    // })

    return {
      ...toRefs(state),
      // dColorHistory,
      activeChange,
      onChange,
      dropColor,
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.el-color-picker--small .el-color-picker__trigger) {
  width: 100%;
}
.color {
  &__bar {
    border-radius: 3px;
    width: 100%;
    height: 28px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  &__bar:hover {
    border: 1px solid#bdbfc5;
  }
}
.color__select {
  width: 100%;
  .content {
    width: 100%;
    align-items: center;
    display: flex;
  }
  .label {
    margin-right: 10px;
  }
  .input-label {
    user-select: none;
    // font-size: 12px;
    line-height: 22px;
    padding: 0px 0 10px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
}
.native {
  position: relative;
  margin-left: 4px;
  .input {
    width: 20px;
    height: 31px;
    opacity: 0;
    cursor: pointer;
  }
  .sd-xggj {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 9;
    pointer-events: none;
    color: #666666;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    line-height: 28px;
  }
}
.native:hover {
  background: rgba(0, 0, 0, 0.04);
}
</style>
