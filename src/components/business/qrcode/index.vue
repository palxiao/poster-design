<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-16 09:15:52
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-01-31 15:43:10
-->
<template>
  <div ref="qrCodeDom" class="qrcode__wrap"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, nextTick } from 'vue'
import QRCodeStyling, { DrawType, TypeNumber, Mode, ErrorCorrectionLevel, DotType, CornerSquareType, CornerDotType, Extension } from 'qr-code-styling'
import { debounce } from 'throttle-debounce'

export default defineComponent({
  props: {
    width: {
      default: 300,
    },
    height: {
      default: 300,
    },
    image: {},
    value: {},
    dotsOptions: {
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
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
          color: '#41b583',
          type: 'rounded' as DotType,
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
        qrCodeDom.value.firstChild.style = 'width: 100%;' // 强制其适应缩放
      }
    })

    const qrCode = new QRCodeStyling(options)
    const qrCodeDom = ref<HTMLElement>()

    onMounted(() => {
      render()
      qrCode.append(qrCodeDom.value)
    })

    return {
      qrCodeDom,
    }
  },
})
</script>
