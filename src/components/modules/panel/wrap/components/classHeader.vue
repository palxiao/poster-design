<!--
 * @Author: ShawnPhang
 * @Date: 2023-10-04 02:04:04
 * @Description: 列表分类头部
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @Date: 2024-03-06 21:16:00
-->
<template>
  <div v-if="!isBack" class="content__wrap">
    <div v-for="(t, ti) in types" :key="ti + 't'">
      <div class="types__header" @click="select(t)">
        <span style="flex: 1">{{ t.name }}</span>
        <span class="types__header-more">全部<i class="iconfont icon-right"></i></span>
      </div>
      <slot :index="ti" />
    </div>
  </div>
  <span v-else class="types__header-back" @click="back">
    <i class="iconfont icon-right"></i>
    <slot />
  </span>
</template>

<script lang="ts" setup>
export type TClassHeaderTypeData = {
  name: string
}

type TProps = {
  types?: TClassHeaderTypeData[]
  isBack?: boolean
}

type TEmits = {
  (event: 'select', data: string[]): void
  (event: 'back'): void
}

const { types, isBack } = defineProps<TProps>()
const emit = defineEmits<TEmits>()

const select = (item: any) => {
  emit('select', item)
}
const back = () => {
  emit('back')
}

defineExpose({ select, back })
</script>

<style lang="less" scoped>
.content {
  &__wrap {
    padding: 0.5rem 1rem;
    height: 100%;
    overflow: auto;
    padding-bottom: 100px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  &__wrap::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
.types {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 6px;
  &__item {
    position: relative;
    width: 64px;
    // height: 44px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    border-radius: 4px;
    cursor: pointer;
    margin: 8px 4px 0 4px;
    background-size: cover;
    background-repeat: no-repeat;
    text-shadow: 0 1px 0 rgb(0 0 0 / 25%);
    opacity: 0.5;
  }
  &--select {
    opacity: 1;
  }
  &__header {
    user-select: none;
    cursor: pointer;
    margin-bottom: 12px;
    font-size: 13px;
    color: #333333;
    display: flex;
    align-items: center;
    &-more {
      display: flex;
      align-items: center;
      color: #a0a0a0;
      font-size: 13px;
    }
    &-back {
      cursor: pointer;
      padding: 0 0 0 0.6rem;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 16px;
      height: 2.9rem;
      position: absolute;
      z-index: 2;
      background: #ffffff;
      width: 320px;
      .icon-right {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
