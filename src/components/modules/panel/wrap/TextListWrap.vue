<template>
  <div id="text-list-wrap" style="margin-top: 0.5rem">
    <ul class="basic-text-wrap">
      <div
        v-for="(item, index) in basicTextList"
        :key="index"
        class="basic-text-item"
        :style="{
          fontSize: 14 + 'px',
          fontWeight: item.fontWeight,
        }"
        draggable="true"
        @click="selectBasicText(item)"
        @dragstart="dragStart($event, item)"
      >
        {{ item.text }}
      </div>
    </ul>
    <div class="other-text-wrap">
      <comp-list-wrap />
    </div>
  </div>
</template>

<script lang="ts" setup>
// const NAME = 'text-list-wrap'

import wText from '../../widgets/wText/wText.vue'

import { useStore } from 'vuex'

type TBasicTextData = {
  text: string
  fontSize: number
  fontWeight: string
}

const store = useStore()


const selectBasicText = (item: TBasicTextData) => {
  store.commit('setShowMoveable', false) // 清理掉上一次的选择
  let setting = JSON.parse(JSON.stringify(wText.setting))
  setting.text = '双击编辑文字' // item.text
  setting.width = item.fontSize * setting.text.length
  setting.fontSize = item.fontSize
  setting.fontWeight = item.fontWeight
  const { width: pW, height: pH } = store.getters.dPage
  setting.left = pW / 2 - item.fontSize * 3
  setting.top = pH / 2 - item.fontSize / 2
  store.dispatch('addWidget', setting)
  // addWidget(setting)
}

const dragStart = (_: MouseEvent, item: any) => {
  store.commit('setDraging', true)
  store.commit('selectItem', { data: { value: item }, type: 'text' })
}

const basicTextList: TBasicTextData[] = [
  // {
  //   text: '大标题',
  //   fontSize: 96,
  //   fontWeight: 'bold',
  // },
  {
    text: '+ 添加文字',
    fontSize: 60,
    fontWeight: 'normal',
  },
  // {
  //   text: '+ 添加文字',
  //   fontSize: 40,
  //   fontWeight: 'normal',
  // },
  // {
  //   text: '小标题',
  //   fontSize: 36,
  //   fontWeight: 'normal',
  // },
  // {
  //   text: '正文内容',
  //   fontSize: 28,
  //   fontWeight: 'normal',
  // },
]
defineExpose({
  selectBasicText,
  dragStart,
})

// ...mapActions(['addWidget'])
</script>

<style lang="less" scoped>
// @color0: #3b74f1;

#text-list-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .basic-text-wrap {
    padding: 10px 0;
    width: 100%;
    .basic-text-item {
      color: #33383e;
      background-color: #f1f2f4;
      cursor: grab;
      user-select: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      border-top: 1px solid rgba(255, 255, 255, 0);
      // color: @color-black;
      padding: 12px 0;
      margin: 0 5%;
      text-align: center;
      width: 90%;
      &:hover {
        // background-color: rgba(0, 0, 0, 0.07);
        // border-bottom: 1px solid @color0;
        // border-top: 1px solid @color0;
      }
    }
  }
  .other-text-wrap {
    flex: 1;
    overflow: auto;
    width: 100%;
  }
}
</style>
