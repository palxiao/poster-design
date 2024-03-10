<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 14:00:23
 * @Description: 文字特效选择框组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-30 10:14:30
-->
<template>
  <el-card class="box-card" shadow="hover" :body-style="{ padding: '20px' }">
    <template #header>
      <div class="card-header">
        <div
          :style="{
            position: 'relative',
            width: '27px',
            fontSize: '27px',
            color: data.color,
            fontWeight: data.fontWeight,
            fontStyle: data.fontStyle,
            textDecoration: data.textDecoration,
            opacity: data.opacity,
            backgroundColor: data.backgroundColor,
          }"
        >
          <div
            v-for="(ef, efi) in modelValue"
            :key="efi + 'effect'"
            :style="{
              color: ef.filling && ef.filling.enable && ef.filling.type === 0 ? ef.filling.color : 'transparent',
              webkitTextStroke: ef.stroke && ef.stroke.enable ? `${ef.stroke.width / coefficient}px ${ef.stroke.color}` : '',
              textShadow: ef.shadow && ef.shadow.enable ? `${ef.shadow.offsetX / coefficient}px ${ef.shadow.offsetY / coefficient}px ${ef.shadow.blur / coefficient}px ${ef.shadow.color}` : undefined,
              backgroundImage: ef.filling && ef.filling.enable ? (ef.filling.type === 0 ? undefined : getGradientOrImg(ef)) : undefined,
              webkitBackgroundClip: ef.filling && ef.filling.enable ? (ef.filling.type === 0 ? undefined : 'text') : undefined,
            }"
            class="demo"
          >
            A
          </div>
          A
        </div>
        <span class="title">文字特效</span>
        <el-popover :visible="state.visiable" placement="left" :width="220" trigger="click">
          <div class="select__box">
            <div class="select__box__select-item" @click="selectEffect()">无</div>
            <div v-for="(l, li) in state.list" :key="'list' + li" class="select__box__select-item" @click="selectEffect(l.id)">
              <img :src="l.cover" />
            </div>
          </div>
          <template #reference>
            <el-button class="button" link @click="openSet">{{ state.visiable ? '取消' : '选择' }}</el-button>
          </template>
        </el-popover>
      </div>
    </template>
    <!-- filling 描边 stroke 阴影 shadow -->
    <div v-show="state.layers && state.layers.length > 0" class="text item"><span style="width: 65px">强度</span> <el-slider v-model="state.strength" show-input :maxValue="100" input-size="small" :show-input-controls="false" @input="strengthChange"> </el-slider></div>
    <el-collapse-item>
      <template #title>
        <b>高级编辑</b>
      </template>
      <div class="line"></div>
      <div style="display: flex; justify-content: space-between">
        <el-button
          class="add-layer" size="small" type="primary" link
          @click="addLayer">
           + 新建特效层
        </el-button>
        <el-button
          v-show="state.layers && state.layers.length > 0" class="add-layer" size="small"
          type="primary" link @click="state.unfold = !state.unfold">
          {{ state.unfold ? '收起' : '展开' }}全部
        </el-button>
      </div>
      <div class="line"></div>
      <draggable v-model="state.layers" handle=".sd-yidong" item-key="uuid" v-bind="dragOptions">
        <template #item="{ element, index }">
          <div class="feature__grab-wrap">
            <div class="layer__title">
              <i class="icon sd-yidong" /><span style="font-size: 12px"><b>特效层</b> {{ index + 1 }}</span>
              <i class="icon sd-delete" @click="removeLayer(index)" />
            </div>
            <div v-if="element.filling && [0, 2, '0', '2'].includes(element.filling.type)" v-show="state.unfold" class="feature__item">
              <el-checkbox v-model="element.filling.enable" label="填充" class="feature__header" />
              <color-select v-model="element.filling.color" width="28px" :modes="['纯色', '渐变']" label="" @change="colorChange($event, element.filling)" />
            </div>
            <div v-if="element.stroke" v-show="state.unfold" class="feature__item">
              <el-checkbox v-model="element.stroke.enable" label="描边" class="feature__header" />
              <el-input-number v-model="element.stroke.width" style="width: 65px; margin-right: 0.5rem" :min="0" size="small" controls-position="right" />
              <color-select v-model="element.stroke.color" width="28px" label="" @finish="(value) => finish('color', value)" />
            </div>
            <div v-if="element.offset" v-show="state.unfold" class="feature__item">
              <el-checkbox v-model="element.offset.enable" label="偏移" class="feature__header" />
              <numberInput v-model="element.offset.x" style="width: 49.5px; margin-right: 2px" prepend="x" type="simple" />
              <numberInput v-model="element.offset.y" style="width: 49.5px" prepend="y" type="simple" />
            </div>
            <div v-if="element.shadow" v-show="state.unfold" class="feature__item">
              <el-checkbox v-model="element.shadow.enable" label="阴影" class="feature__header" />
              <numberInput v-model="element.shadow.blur" prepend="blur" :minValue="0" style="width: 30px; margin-right: 2px" type="simple" />
              <numberInput v-model="element.shadow.offsetX" prepend="x" style="width: 30px; margin-right: 2px" type="simple" />
              <numberInput v-model="element.shadow.offsetY" prepend="y" style="width: 30px; margin-right: 0.5rem" type="simple" />
              <color-select v-model="element.shadow.color" width="28px" label="" @finish="(value) => finish('color', value)" />
            </div>
          </div>
        </template>
      </draggable>
    </el-collapse-item>
  </el-card>
</template>

<script lang="ts" setup>
import { 
  reactive, watch, onMounted, nextTick, computed,
  defineProps, defineEmits, defineExpose
} from 'vue'
import colorSelect from '../colorSelect.vue'
import { ElInputNumber, ElCheckbox } from 'element-plus'
import numberInput from '../numberInput.vue'
import draggable from 'vuedraggable'
import api from '@/api'
import getGradientOrImg from '../../widgets/wText/getGradientOrImg'
let froze_font_effect_list: Record<string, any>[] = []

type TProps = {
  modelValue?: Record<string, any>
  degree?: string | number
  data: Record<string, any>
}

type TEmits = {
  (event: 'update:modelValue', data: Record<string, any>[]): void
}

type TState = {
  strength: number
  visiable: boolean
  list: Record<string,any>[]
  layers: Record<string, any>[]
  draging: boolean
  unfold: boolean
}

const props = withDefaults(defineProps<TProps>(), {
  modelValue: () => ({}),
  data: () => ({})
})

const emit = defineEmits<TEmits>()

const state = reactive<TState>({
  strength: 50, // 强度
  visiable: false, // 弹出选择层控制
  list: [],
  layers: [],
  draging: false,
  unfold: true,
})

const dragOptions = {
  animation: 300,
  ghostClass: 'ghost',
  chosenClass: 'choose',
}
const coefficient = computed(() => Math.round(160 / 27))
let rawData: Record<string, any>[] = [] // 初始化记录数据，用于强度修改

onMounted(async () => {
  await nextTick()
  // console.log(props.data)
  if (!props.data.textEffects) {
    return
  }
  const clone = JSON.parse(JSON.stringify(props.data.textEffects)) || []
  state.layers = clone
    .map((x: any) => {
      x.uuid = String(Math.random())
      return x
    })
    .reverse()
  rawData = JSON.parse(JSON.stringify(state.layers))
})

watch(
  () => state.layers,
  (v) => {
    const newEffect = v.map((x) => {
      delete x.uuid
      return x
    })
    emit('update:modelValue', newEffect.reverse())
  },
  { deep: true },
)

// 选中加载特效预设
const selectEffect = async (id?: number) => {
  state.visiable = false
  if (id) {
    const { data } = await api.home.getTempDetail({ id, type: 1 })
    state.layers = JSON.parse(data)
      .textEffects.map((x: Record<string, any>) => {
        x.uuid = String(Math.random())
        return x
      })
      .reverse()
  } else state.layers = []
}

// 删除效果层
const removeLayer = (i: number) => {
  state.layers.splice(i, 1)
  rawData = JSON.parse(JSON.stringify(state.layers))
}

// 添加效果层
const addLayer = () => {
  const filling = { enable: false, type: 0, color: '#000000ff' }
  const stroke = { enable: false, width: 0, color: '#000000ff', type: 'outer' }
  const offset = { enable: false, x: 0, y: 0 }
  const shadow = { enable: false, color: '#000000ff', offsetX: 0, offsetY: 0, blur: 0, opacity: 0 }
  state.layers.unshift({ filling, stroke, shadow, offset, uuid: String(Math.random()) })
  rawData = JSON.parse(JSON.stringify(state.layers))
}

const finish = (type?: string, value?: string) => {}

const colorChange = (e: Record<string, any>, item: Record<string, any>) => {
  const modeStr: Record<string, number> = {
    渐变: 2,
    纯色: 0,
  }
  item.gradient = {
    angle: e.angle,
    stops: e.stops,
  }
  setTimeout(() => {
    item.type = modeStr[e.mode] || 0
  }, 100)
}

    // const onMove = ({ relatedContext, draggedContext }: any) => {
    //   const relatedElement = relatedContext.element
    //   const draggedElement = draggedContext.element
    //   return (!relatedElement || relatedElement.parent == -1) && draggedElement.parent == -1
    // }
    const onDone = () => {
      state.draging = false
    }

    const strengthChange = (x: any) => {
      const effectScale = 1 + (x - 50) / 50
      state.layers.forEach((item: any, index) => {
        if (item.stroke) {
          item.stroke.width = rawData[index].stroke.width * effectScale
        }
        if (item.shadow) {
          item.shadow.blur = rawData[index].shadow.blur * effectScale
        }
      })
    }

// 打开特效字体集
const openSet = async () => {
  state.visiable = !state.visiable
  if (froze_font_effect_list.length <= 0) {
    const { list } = await api.home.getCompList({
      cate: 12,
      type: 1,
      pageSize: 30,
    })
    state.list = list
    froze_font_effect_list = list
  } else state.list = froze_font_effect_list
}

defineExpose({
  selectEffect,
  finish,
  coefficient,
  removeLayer,
  addLayer,
  dragOptions,
  onDone,
  strengthChange,
  openSet,
  colorChange,
  getGradientOrImg,
})
</script>

<style lang="less" scoped>
:deep(.el-input-group__prepend) {
  padding: 0 8px;
}
:deep(.el-input-number__decrease) {
  width: 18px;
}
:deep(.el-input-number__increase) {
  width: 18px;
}
:deep(.el-input-number.is-controls-right .el-input__wrapper) {
  padding-right: 32px;
}
:deep(.el-input-group__prepend) {
  background: #ffffff;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #333333;
}
:deep(.el-collapse-item__header) {
  border-bottom: none;
}
:deep(.el-collapse-item__wrap) {
  border-bottom: none;
}
.feature {
  &__item {
    display: flex;
    align-items: center;
    margin-top: 6px;
  }
  &__header {
    font-size: 14px;
    flex: 1;
    padding: 12px 0 2px 0;
    color: #333333;
  }
  &__header:first-of-type {
    padding: 0 0 2px 0;
  }
  &__grab-wrap {
    position: relative;
    padding: 10px 0;
  }
  &__grab-wrap:first-of-type {
    padding-top: 0;
  }
  &__grab-wrap:last-of-type {
    padding-bottom: 0;
  }
  &__wrap {
    position: relative;
    padding-top: 32px;
  }
  &__wrap::after {
    position: absolute;
    content: '';
    height: 1px;
    width: 100%;
    background: #e9e9e9;
    top: 16px;
  }
  &__wrap:first-of-type {
    padding: 0;
  }
  &__wrap:first-of-type::after {
    height: 0;
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
  font-size: 27px;
  color: #ffffff;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.title {
  font-size: 14px;
  font-weight: 600;
  color: #33383e;
}
.select__box {
  display: flex;
  flex-wrap: wrap;
  // height: 60px;
  &__select-item {
    cursor: pointer;
    position: relative;
    height: 40px;
    width: 33%;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  &__select-item:hover {
    background: rgba(0, 0, 0, 0.07);
  }
}

.layer {
  &__title {
    display: flex;
    align-items: center;
    span {
      flex: 1;
    }
    .sd-yidong {
      cursor: grab !important;
      margin-right: 6px;
    }
    .icon {
      // display: none;
      cursor: pointer;
    }
    .icon:hover {
      transform: scale(1.1);
      color: @active-text-color;
    }
  }
  // &__title:hover > .icon {
  //   display: block;
  // }
}

.add-layer {
  // margin-top: 12px;
  margin-bottom: 10px;
  // width: 100%;
}

// dragable
.choose {
  border: 1px dashed #999999 !important;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
.disable {
  opacity: 0.3;
}
.ghost {
  opacity: 0.3;
  background: @main-color;
}
.line {
  margin-top: 8px;
  height: 18px;
  border-top: 1px solid #e9e9e9;
}
</style>
