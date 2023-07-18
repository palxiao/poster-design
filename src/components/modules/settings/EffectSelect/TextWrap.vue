<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 14:00:23
 * @Description: 文字特效选择框组件
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 17:52:31
-->
<template>
  <el-card class="box-card" shadow="hover" :body-style="{ padding: effectSelect ? '20px' : 0 }">
    <template #header>
      <div class="card-header">
        <!-- <template v-if="effectSelect">
          <component :is="effectSelect" class="demo" />
        </template> -->
        <div v-show="effectSelect" style="position: relative; margin-right: 24px">
          <div
            v-for="(ef, efi) in data"
            :key="efi + 'effect'"
            :style="{
              color: ef.filling && ef.filling.type === 2 ? 'transparent' : ef.filling ? ef.filling.color : undefined,
              webkitTextStroke: ef.stroke ? `${ef.stroke.width}px ${ef.stroke.color}` : undefined,
              textShadow: ef.shadow ? `${ef.shadow.offsetX}px ${ef.shadow.offsetY}px ${ef.shadow.blur}px ${ef.shadow.color}` : undefined,
              backgroundImage: ef.filling && ef.filling.type === 2 ? `linear-gradient(${ef.filling.gradient.angle}deg, ${ef.filling.gradient.stops[0].color} ${Number(ef.filling.gradient.stops[0].offset) * 100}%, ${ef.filling.gradient.stops[1].color} ${Number(ef.filling.gradient.stops[1].offset) * 100}%)` : undefined,
              webkitBackgroundClip: ef.filling && ef.filling.type === 2 ? 'text' : undefined,
            }"
            class="demo"
          >
            A
          </div>
        </div>
        <div v-show="!effectSelect">A</div>
        <span class="title">文字特效</span>
        <el-popover :visible="visiable" placement="left" :width="220" trigger="click">
          <div class="select__box">
            <div class="select__box__select-item" @click="select(null, { color: '' })">无</div>
            <div class="select__box__select-item">
              <div class="e-box" @click="select('effect', { color: '#ffffff' })" />
            </div>
          </div>
          <template #reference>
            <el-button class="button" link @click="visiable = !visiable">{{ visiable ? '取消' : '选择' }}</el-button>
          </template>
        </el-popover>
      </div>
    </template>
    <!-- filling 描边 stroke 阴影 shadow -->
    <div v-for="(f, fi) in data" v-show="effectSelect" :key="'f' + fi" class="feature__wrap">
      <template v-if="f.filling && f.filling.type == 0">
        <div class="feature__header">填充</div>
        <color-select v-model="f.filling.color" class="feature__color" label="" @finish="(value) => finish('color', value)" />
      </template>
      <template v-if="f.stroke">
        <div class="feature__header">描边</div>
        <color-select v-model="f.stroke.color" class="feature__color" label="" @finish="(value) => finish('color', value)" />
        <div class="text item"><span class="strength">强度</span> <el-slider v-model="f.stroke.width" show-input input-size="small" :show-input-controls="false"> </el-slider></div>
      </template>
      <template v-if="f.shadow">
        <div class="feature__header">阴影</div>
        <color-select v-model="f.shadow.color" class="feature__color" label="" @finish="(value) => finish('color', value)" />
        <div class="text item"><span class="strength">模糊</span> <el-slider v-model="f.shadow.blur" show-input input-size="small" :show-input-controls="false"> </el-slider></div>
      </template>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch, onMounted, nextTick } from 'vue'
import colorSelect from '../colorSelect.vue'

export default defineComponent({
  components: { colorSelect },
  props: ['modelValue', 'degree', 'data'],
  emits: ['select'],
  setup(props, context) {
    const state = reactive({
      strength: 20, // 强度
      effectSelect: '', // 选择的模板
      visiable: false, // 弹出选择层控制
    })
    const select = (value: string = '', style: any) => {
      state.effectSelect = value
      state.visiable = false
      context.emit('select', { key: 'isEffect', value, style })
      context.emit('select', { key: 'degree', value: 20 })
    }
    onMounted(async () => {
      await nextTick()
      // state.effectSelect = props?.modelValue || ''
      if (props.data && props.data.length > 0) {
        state.effectSelect = 'true'
      }
      // state.strength = props?.degree || state.strength
    })
    // watch(
    //   () => props.degree,
    //   (value) => {
    //     state.strength = props?.degree || state.strength
    //   },
    // )
    watch(
      () => props.modelValue,
      (value) => {
        state.effectSelect = value || ''
      },
    )
    // watch(
    //   () => state.strength,
    //   (strength) => {
    //     context.emit('select', { key: 'degree', value: strength }) // 组件改变强度
    //   },
    // )
    watch(
      () => props.data,
      () => {
        state.effectSelect = props.data ? 'true' : ''
      },
    )

    const finish = () => {}
    return {
      ...toRefs(state),
      select,
      finish,
    }
  },
  methods: {},
})
</script>

<style lang="less" scoped>
.feature {
  &__header {
    font-size: 14px;
    padding: 12px 0 2px 0;
    font-weight: 600;
    color: #333333;
  }
  &__header:first-of-type {
    padding: 0 0 2px 0;
  }
  &__wrap {
    position: relative;
    padding-top: 20px;
  }
  &__wrap::after {
    position: absolute;
    content: '';
    height: 1px;
    width: 100%;
    background: #e9e9e9;
    top: 2px;
  }
  &__wrap:first-of-type {
    padding: 0;
  }
  &__wrap:first-of-type::after {
    height: 0;
  }
  &__color {
    margin: 8px 0 0 0;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
}

.box-card {
  width: 100%;
}

.demo {
  margin: 0 0 0 0.15rem;
  font-size: 27px;
  color: #ffffff;
  outline: none;
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  height: 100%;
}
.title {
  font-size: 14px;
  font-weight: 600;
  color: #33383e;
}
.strength {
  width: 80px;
}
.select__box {
  display: flex;
  flex-wrap: wrap;
  // height: 60px;
  &__select-item {
    cursor: pointer;
    position: relative;
    height: 40px;
    width: 25%;
    align-items: center;
    justify-content: center;
    display: flex;
    .e-box {
      font-size: 21px;
      color: #ffffff;
    }
  }
  &__select-item:hover {
    background: rgba(0, 0, 0, 0.07);
  }
}
</style>
