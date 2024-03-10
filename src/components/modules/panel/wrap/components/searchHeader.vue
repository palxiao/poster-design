<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-27 11:05:48
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-06 21:16:00
-->
<template>
  <div class="search__wrap">
    <el-dropdown v-if="type !== 'none'" placement="bottom-start">
      <div class="search__type"><i class="iconfont icon-ego-caidan" /></div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="type in state.materialCates" :key="type.id"
            @click="action('change', type, type.id)"
          >
            <span :class="['cate__text', { 'cate--select': + state.currentIndex === type.id }]">{{ type.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span v-else style="width: 1rem"></span>

    <el-input v-model="state.searchValue" size="large" placeholder="输入关键词搜索" class="input-with-select">
      <template #append>
        <el-button><i class="iconfont icon-search"></i></el-button>
      </template>
    </el-input>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRefs, watch } from 'vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { useRoute } from 'vue-router'
import api from '@/api'

type TProps = {
  type?: string
  modelValue?: string
}

type TEmits = {
  (event: 'update:modelValue', data: string): void
  (event: 'change', data: TMaterialCatesData): void
}

type TMaterialCatesData = {id: string | number, name: string}

type TState = {
  searchValue: string
  materialCates: TMaterialCatesData[]
  currentIndex: number | string
}

const props = defineProps<TProps>()

const emit = defineEmits<TEmits>()

const route = useRoute()
const state = reactive<TState>({
  searchValue: '',
  materialCates: [],
  currentIndex: 1,
})

if (props.type != 'none') {
  api.home.getCategories({ type: 1 }).then((list: any) => {
    list.unshift({ id: 0, name: '全部' })
    state.materialCates = list
    const { cate } = route.query
    cate && (state.currentIndex = cate as string)
    cate && action('change', state.materialCates[Number(cate)], Number(cate))
  })
}

watch(
  () => state.searchValue,
  () => {
    emit('update:modelValue', state.searchValue)
  },
)

function action(fn: 'change', type: TMaterialCatesData, currentIndex: number | string) {
  currentIndex && (state.currentIndex = currentIndex)
  emit(fn, type)
}

defineExpose({
  action
})

</script>

<style lang="less" scoped>
:deep(.el-input__suffix) {
  padding-top: 9px;
}
.search__wrap {
  padding: 16px 1rem 0rem 0rem;
  display: flex;
  cursor: pointer;
}
.search {
  &__type {
    border: 1px solid #e8eaec;
    color: #666666;
    width: 44px;
    margin: 0 0.6rem 0 1rem;
    border-radius: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    .iconfont {
      font-size: 20px;
    }
  }
  &__type:hover {
    color: @active-text-color;
  }
}

.cate {
  &__text {
    font-weight: bold;
  }
  &--select {
    color: @main-color;
  }
}
</style>
