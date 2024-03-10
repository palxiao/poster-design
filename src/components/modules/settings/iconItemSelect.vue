<!--
 * @Author: ShawnPhang
 * @Date: 2021-07-29 18:31:27
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-07 23:26:51
-->
<template>
  <div class="icon-item-select">
    <span v-if="label" class="label">{{ label }}</span>
    <ul class="list btn__bar flex">
      <el-tooltip v-for="(item, index) in data" :key="index" class="item" effect="dark" :content="item.tip" placement="top" :auto-close="400">
        <li :class="{ 'list-item': true, active: item.select }" @click="selectItem(item)">
          <i :class="`${item.extraIcon ? 'icon' : 'iconfont'} ${item.icon}`"></i>
        </li>
      </el-tooltip>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// 图标按钮选择组件
// const NAME = 'icon-item-select'

type TPropData = {
  select: boolean,
  extraIcon: boolean,
  tip: string
  icon?: string
}

type TProps = {
  label?: string
  data: TPropData[]
}

type TEmits = {
  (event: 'finish', data: TPropData): void
}

const props = withDefaults(defineProps<TProps>(), {
  label: ''
})

const emit = defineEmits<TEmits>()


function selectItem(item: TPropData) {
  if (typeof item.select !== 'undefined') {
    item.select = !item.select
  }
  emit('finish', item)
}

</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
}
.btn__bar {
  margin-bottom: 12px;
  padding: 0 12px;
  background: #f3f5f7;
  border: none;
  border-radius: 6px;
  height: 40px;
}
</style>
<style lang="less" scoped>
.icon-item-select {
  // display: flex;
  width: 100%;
  .label {
    margin-right: 10px;
  }
  .list {
    line-height: 1;
    .list-item {
      color: #444950;
      cursor: pointer;
      padding: 5px;
      margin: 4px 0;
      height: 32px;
      width: 32px;
      i {
        font-size: 21px;
      }
      &:hover {
        background-color: #e3e4e5;
        border-radius: 7px;
      }
    }
    .list-item.active {
      color: @main-color;
      font-weight: bold;
      // color: #ffffff;
    }
  }
}
</style>
