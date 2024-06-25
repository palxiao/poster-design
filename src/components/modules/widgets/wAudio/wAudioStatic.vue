<!--
 * @Author: ShawnPhang
 * @Date: 2024-04-12 17:47:19
 * @Description: 静态组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-16 16:25:35
-->
<template>
  <div
    ref="widgetRef"
    :style="{
      position: state.position,
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <div :style="{ transform: params.flip ? `rotate${params.flip}(180deg)` : undefined, borderRadius: params.radius + 'px', '-webkit-mask-image': `${params.mask ? `url('${params.mask}')` : 'initial'}` }" :class="['img__box', { mask: params.mask }]">
      <div v-if="params.isNinePatch" ref="targetRef" class="target" :style="{ border: `${(params.height * params.sliceData.ratio) / 2}px solid transparent`, borderImage: `url('${params.imgUrl}') ${params.sliceData.left} round` }"></div>
      <img v-else ref="targetRef" class="target" style="transform-origin: center" :src="params.imgUrl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties, reactive, ref } from 'vue'
import setting from "./wAudioSetting"

type TProps = {
  params: typeof setting
  parent: {
    left: number
    top: number
  }
}

type TState = {
  position: 'absolute' | 'relative', // 'absolute'relative
  editBoxStyle: CSSProperties,
  cropWidgetXY: {
    x: number
    y: number
  }
  holdPosition: {
    left: number
    top: number
  }
}

const props = defineProps<TProps>()
const state = reactive<TState>({
  position: 'absolute', // 'absolute'relative
  editBoxStyle: {
    transformOrigin: 'center',
    transform: '',
  },
  cropWidgetXY: {
    x: 0,
    y: 0,
  },
  holdPosition: {
    left: 0,
    top: 0,
  }
})

const widgetRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLImageElement | null>(null)

</script>

<style lang="less" scoped>
.mask {
  -webkit-mask-size: 100% 100%;
  -webkit-mask-position: center;
}
.img__box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    display: block;
  }
}
.target {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
