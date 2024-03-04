<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-16 09:15:52
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @Date: 2024-03-04 09:50:00
-->
<template>
  <div ref="qrCodeDom" class="qrcode__wrap"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, nextTick, defineProps } from 'vue'
import QRCodeStyling, { DrawType, TypeNumber, Mode, ErrorCorrectionLevel, DotType, CornerSquareType, CornerDotType, } from 'qr-code-styling'
import { debounce } from 'throttle-debounce'

type TProps = {
  width?: number
  height?: number
  image?: string
  value?: string
  dotsOptions: {
    color: string,
    type: DotType,
  }
}

const props = withDefaults(defineProps<TProps>(), {
  width: 300,
  height: 300,
  dotsOptions: () => ({
    color: '#41b583',
    type: 'rounded',
  })
})

let options = {}
watch(
  () => [props.width, props.height, props.dotsOptions],
  () => {
    render()
  },
)

const render = debounce(300, false, async () => {
  options = {
    width: props.width,
    height: props.height,
    type: 'canvas' as DrawType, // canvas svg
    data: props.value,
    image: props.image, // /favicon.svg
    margin: 0,
    qrOptions: {
      typeNumber: 3 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 6,
      crossOrigin: 'anonymous',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    dotsOptions: {
      // color: '#41b583',
      // type: 'rounded' as DotType,
      ...props.dotsOptions,
    },
    cornersSquareOptions: {
      color: props.dotsOptions.color,
      type: '',
      // type: 'extra-rounded' as CornerSquareType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
      // },
    },
    cornersDotOptions: {
      color: props.dotsOptions.color,
      type: 'square' as CornerDotType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
      // },
    },
  }
  if (props.value) {
    qrCode.update(options)
    await nextTick()
    if (!qrCodeDom.value || !qrCodeDom.value.firstChild) return
    (qrCodeDom.value.firstChild as HTMLElement).setAttribute('style', "width: 100%;") // 强制其适应缩放
  }
})

const qrCode = new QRCodeStyling(options)
const qrCodeDom = ref<HTMLElement>()

onMounted(() => {
  render()
  qrCode.append(qrCodeDom.value)
})

</script>
