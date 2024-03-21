<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 14:00:23
 * @Description: 图片容器
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 17:53:39
-->
<template>
  <el-card class="box-card" shadow="hover" :body-style="{ padding: state.effectSelect ? '20px' : 0 }">
    <template #header>
      <div class="card-header">
        <template v-if="state.effectSelect">
          <component :is="state.effectSelect" class="demo" />
        </template>
        <div v-show="!state.effectSelect">无</div>
        <span class="title">图片容器</span>
        <el-popover :visible="state.visiable" placement="bottom-end" :width="260" trigger="click">
          <div class="box__header">
            <el-radio-group v-model="state.type" size="small">
              <el-radio-button label="160">形状</el-radio-button>
              <el-radio-button label="166">框架</el-radio-button>
            </el-radio-group>
          </div>
          <div class="select__box">
            <div class="select__box__select-item" @click="select()">无</div>
            <el-image v-for="(item, i) in state.list" :key="i + 'l'" class="select__box__select-item" :src="item.thumbUrl" fit="contain" @click="select(item.imgUrl)"></el-image>
          </div>
          <template #reference>
            <el-button class="button" link @click="state.visiable = !state.visiable">{{ state.visiable ? '取消' : '选择' }}</el-button>
          </template>
        </el-popover>
      </div>
    </template>
    <!-- <div v-show="effectSelect" class="text item">
      <span class="strength">强度</span>
      <el-slider v-model="strength" show-input input-size="small" :show-input-controls="false"> </el-slider>
    </div> -->
  </el-card>
</template>

<script lang="ts" setup>
import api from '@/api'
import { toRefs, reactive, watch, onMounted, nextTick } from 'vue'
import { ElRadioGroup, ElRadioButton } from 'element-plus'
// import wSvg from '@/components/modules/widgets/wSvg/wSvg.vue'
import {wSvgSetting} from '@/components/modules/widgets/wSvg/wSvgSetting'
import { TGetListResult } from '@/api/material';

type TProps = {
  modelValue?: string
  degree?: number
}

type TEmits = {
  (event: 'change', data: Record<string, any>): void
}

type TState = {
  effectSelect: string
  visiable: boolean
  type: string
  list: {thumbUrl: string, imgUrl: string}[]
}

const props = defineProps<TProps>()

const emit = defineEmits<TEmits>()

const state = reactive<TState>({
  // strength: 20, // 强度
  effectSelect: '', // 选择的模板
  visiable: false, // 弹出选择层控制
  type: '166', // 类型
  list: [],
})

const select = (value: string = '') => {
  state.visiable = false
  const setting = JSON.parse(JSON.stringify(wSvgSetting))
  setting.svgUrl = value
  emit('change', setting)
}


onMounted(async () => {
  await nextTick()
  state.effectSelect = props?.modelValue || ''
  // state.strength = props?.degree || state.strength
  getList()
})

async function getList() {
  const res = await api.material.getList({
    first_id: 2,
    second_id: state.type,
  })
  state.list = res.list.map(({ thumbUrl, imgUrl }) => {
    return { thumbUrl, imgUrl }
  })
}

watch(
  () => state.type,
  (value) => {
    getList()
  },
)
defineExpose({
  select,
})
</script>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  display: flex;
  align-items: center;
}

.box-card {
  margin-top: 24px;
  width: 100%;
}

.demo {
  margin: -1.5rem 0 0 1rem;
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
  max-height: 220px;
  overflow-y: auto;
  &__select-item {
    cursor: pointer;
    position: relative;
    height: 80px;
    width: 50%;
    margin: 4px 0;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  &__select-item:hover {
    background: rgba(0, 0, 0, 0.07);
  }
}
.select__box ::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.box__header {
  width: 100%;
  text-align: center;
  padding-bottom: 12px;
}
</style>
