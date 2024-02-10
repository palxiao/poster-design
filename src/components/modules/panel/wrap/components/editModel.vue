<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-11 17:54:14
 * @Description: 模板编辑组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-02-11 00:07:36
-->
<template>
  <div class="wrap">
    <slot />
    <div class="showMask" @click.stop="">
      <el-dropdown placement="bottom-end" :show-arrow="false">
        <i class="iconfont icon-more"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(op, oi) in options" :key="oi + 'o'" @click="op.fn(data)">{{ op.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import useConfirm from '@/common/methods/confirm'

export default defineComponent({
  components: { ElDropdown, ElDropdownItem, ElDropdownMenu },
  props: {
    options: {
      default: () => [],
    },
    data: {},
  },
  emits: ['action'],
  setup(props, context) {
    async function action(name: string, value: any) {
      if (name === 'del') {
        const isDel = await useConfirm('警告', '删除后不可恢复,是否继续', 'warning')
        if (!isDel) {
          return false
        }
      }
      context.emit('action', { name, value })
    }
    return {
      action,
    }
  },
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.wrap:hover > .showMask {
  opacity: 1;
}
.showMask {
  cursor: grab;
  opacity: 0;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  z-index: 2;
  border-radius: 0.7rem;
  top: 0;
  right: 0;

  .iconfont {
    color: #ffffff;
    margin: 2px 10px;
  }
}
</style>
