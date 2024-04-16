<template>
  <div
    ref="widget"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      minWidth: params.fontSize + 'px',
      minHeight: params.fontSize * params.lineHeight + 'px',
      height: params.height + 'px',
      lineHeight: params.fontSize * params.lineHeight + 'px',
      letterSpacing: (params.fontSize * params.letterSpacing) / 100 + 'px',
      fontSize: params.fontSize + 'px',
      color: params.color,
      textAlign: params.textAlign,
      fontWeight: params.fontWeight,
      fontStyle: params.fontStyle,
      textDecoration: params.textDecoration,
      opacity: params.opacity,
      backgroundColor: params.backgroundColor,
      writingMode: params.writingMode,
      fontFamily: `'${params.fontClass.value}'`,
    }"
  >
    <template v-if="params.textEffects">
      <div
        v-for="(ef, efi) in params.textEffects"
        :key="efi + 'effect'"
        :style="{
          fontFamily: `'${params.fontClass.value}'`,
          color: ef.filling && ef.filling.enable && ef.filling.type === 0 ? ef.filling.color : 'transparent',
          WebkitTextStroke: ef.stroke && ef.stroke.enable ? `${ef.stroke.width}px ${ef.stroke.color}` : undefined,
          textShadow: ef.shadow && ef.shadow.enable ? `${ef.shadow.offsetX}px ${ef.shadow.offsetY}px ${ef.shadow.blur}px ${ef.shadow.color}` : undefined,
          backgroundImage: ef.filling && ef.filling.enable ? (ef.filling.type === 0 ? undefined : getGradientOrImg(ef)) : undefined,
          WebkitBackgroundClip: ef.filling && ef.filling.enable ? (ef.filling.type === 0 ? undefined : 'text') : undefined,
          transform: ef.offset && ef.offset.enable ? `translate(${ef.offset.x}px, ${ef.offset.y}px)` : undefined,
        }"
        class="edit-text effect-text"
        spellcheck="false"
        v-html="params.text"
      ></div>
    </template>
    <div
      :style="{ fontFamily: `'${params.fontClass.value}'` }"
      class="edit-text" spellcheck="false" 
      v-html="params.text"></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import getGradientOrImg from './getGradientOrImg'
import { wTextSetting } from './wTextSetting'

export type TwTextParams = {
  rotate?: number
  lock?: boolean
  width?: number
  height?: number
} & typeof wTextSetting

type TProps = {
  params: TwTextParams
  parent: {
    left: number
    top: number
  }
}

const props = defineProps<TProps>()
const widget = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!widget.value) return
  props.params.transform && (widget.value.style.transform = props.params.transform)
  props.params.rotate && (widget.value.style.transform += `translate(0px, 0px) rotate(${props.params.rotate}) scale(1, 1)`)
})

defineExpose({
  getGradientOrImg,
  widget,
})
</script>

<style lang="less" scoped>
.edit-text {
  outline: none;
  word-break: break-word;
  white-space: pre-wrap;
  margin: 0;
}
.effect-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
