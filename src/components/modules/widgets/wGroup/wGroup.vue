<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-02 09:41:41
 * @Description: 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-16 00:30:03
-->
<template>
  <div
    ref="widget"
    :class="['w-group', { 'layer-lock': props.params?.lock }]"
    :style="{
      position: 'absolute',
      left: (props.params.left || 0) - (props.parent?.left || 0) + 'px',
      top: (props.params.top || 0) - (props.parent.top || 0) + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
// 组合组件
const NAME = 'w-group'
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import { useStore } from 'vuex'
import { setTransformAttribute } from '@/common/methods/handleTransform'
import { useSetupMapGetters } from '@/common/hooks/mapGetters';

type TParamsData = {
  left: number
  top: number
  width: number
  height: number
  opacity: number
  rotate: number
  uuid: string
  lock: boolean
  fontSize: number
}

type TProps = {
  params?: Partial<TParamsData>
  parent?: Partial<Pick<TParamsData, "top" | "left">>
}
const props = withDefaults(defineProps<TProps>(), {
  params: () => ({}),
  parent: () => ({})
})
const store = useStore();
const widget = ref<HTMLElement | null>(null)
const ratio = ref(0)
const temp = ref<Record<string, any>>({})
const compWidgetsRecord = ref<Record<string, any>>({})
// const setting = {
//   name: '组合',
//   type: NAME,
//   uuid: -1,
//   width: 0,
//   height: 0,
//   left: 0,
//   top: 0,
//   transform: '',
//   opacity: 1,
//   parent: '-1',
//   isContainer: true,
//   record: {
//     width: 0,
//     height: 0,
//     minWidth: 0,
//     minHeight: 0,
//     dir: 'none',
//   },
// }

const timer = ref<number | null>(null)
const { dActiveElement, dWidgets } = useSetupMapGetters(['dActiveElement', 'dWidgets'])

// watch: {
//   params: {
//     async handler(nval) {
//       this.updateRecord(nval.tempScale)
//     },
//     immediate: true,
//     deep: true,
//   },
// },

onUpdated(() => {
  updateRecord()
})

onMounted(async () => {
  await nextTick()
  touchstart()
  updateRecord()
  document.addEventListener('mousedown', touchstart, false)
  document.addEventListener('mouseup', touchend, false)
  if (props.params?.rotate && widget.value) {
    (widget.value.style.transform += `rotate(${props.params.rotate})`)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', touchstart, false)
  document.removeEventListener('mouseup', touchend, false)
})
// ...mapActions(['updateWidgetData']),

function updateRecord(tempScale ?: number) {
  if (dActiveElement.value.uuid === props.params.uuid) {
    // clearTimeout(this.timer)
    let record = dActiveElement.value.record
    if (record.width <= 0) {
      touchend()
    }
    // if (this.tempRecord && this.tempRecord.width && this.tempRecord.width != record.width) {
    //   return
    // }
    ratio.value = tempScale || (props.params.width || 0) / record.width

    if (ratio.value != 1) {
      if (record.width != 0) {
        for (let i = dWidgets.value.length - 1; i >= 0; --i) {
          if (dWidgets.value[i].parent === props.params.uuid) {
            temp.value[dWidgets.value[i].uuid] = { width: dWidgets.value[i].width * ratio.value, height: dWidgets.value[i].height * ratio.value, raw: dWidgets.value[i] }
          }
        }
      }
      // TODO DOM Change
      // this.dActiveElement.scale = this.ratio
      if (widget.value) {
        // 缩放原点在左上角，旋转原点在中心
        widget.value.style.transformOrigin = 'left top' // 设置scale的原点
        setTransformAttribute(widget.value, 'scale', ratio.value)
      }
      // this.timer = setTimeout(() => {
      //   this.touchend()
      // }, 300)
    }
  }
}

function touchstart() {
  if (dActiveElement.value.uuid !== props.params.uuid) {
    return
  }
  const tempRecord = {
    width: props.params.width,
    height: props.params.height,
  }
  for (let i = dWidgets.value.length - 1; i >= 0; --i) {
    if (dWidgets.value[i].parent === props.params.uuid) {
      const el = document.getElementById(dWidgets.value[i].uuid)
      if (el) {
        compWidgetsRecord.value[dWidgets.value[i].uuid] = {
          left: Number(el.style.left.replace('px', '')),
          top: Number(el.style.top.replace('px', '')),
          fontSize: Number(el.style.fontSize?.replace('px', '')),
        }
      }
    }
  }
}

function touchend() {
  if (dActiveElement.value.uuid !== props.params.uuid) {
    return
  }
  // const opacity = this.$refs.widget.style.opacity
  // this.$refs.widget.style.opacity = 1
  setTimeout(() => {
    if (!temp.value || !widget.value) {
      return
    }
    widget.value.style.opacity = `${0}`
    setTransformAttribute(widget.value, 'scale', 1)
    setTimeout(() => {
      if (!widget.value) return
      widget.value.style.opacity = `${props.params.opacity}`
      // widget.value.style.transformOrigin = 'center' // 设置scale的原点
    }, 100)

    // const opacity = this.$refs.widget.style.opacity
    // setTransformAttribute(this.$refs.widget, 'scale', 1)
    for (const key in temp.value) {
      if (Object.hasOwnProperty.call(temp.value, key)) {
        keyChange(key, 'width', temp.value[key].width)
        keyChange(key, 'height', temp.value[key].height)
        // 重新拿前面设定好的，实时DOM修改过了
        keySetValue(key, 'left', compWidgetsRecord.value[key].left * ratio.value)
        keySetValue(key, 'top', compWidgetsRecord.value[key].top * ratio.value)
        // this.keySetValue(key, 'left', Number(document.getElementById(key).style.left.replace('px', '')) * this.ratio)
        // this.keySetValue(key, 'top', Number(document.getElementById(key).style.top.replace('px', '')) * this.ratio)
        if (temp.value[key].raw.type === 'w-text') {
          keyChange(key, 'fontSize', compWidgetsRecord.value[key].fontSize * ratio.value)
          // this.keyChange(key, 'fontSize', this.temp[key].raw.fontSize * this.ratio)
          // this.keyChange(key, 'letterSpacing', this.temp[key].raw.letterSpacing * this.ratio)
        }
      }
    }
    // this.$refs.widget.style.opacity = opacity
    temp.value = {}

    if (dActiveElement.value.uuid === props.params.uuid) {
      let record = dActiveElement.value.record
      record.width = widget.value?.offsetWidth
      record.height = widget.value?.offsetHeight
      dActiveElement.value.width = widget.value?.offsetWidth
      dActiveElement.value.height = widget.value?.offsetHeight
    }
  }, 10)
}
function keyChange(uuid: string, key: keyof TParamsData, value: number) {
  store.dispatch('updateWidgetData', {
    uuid,
    key,
    value,
    pushHistory: false,
  })
  // updateWidgetData({
  //   uuid,
  //   key,
  //   value,
  //   pushHistory: false,
  // })
}

function keySetValue(uuid: string, key: keyof TParamsData, value: number) {
  setTimeout(() => {
    const widget = dWidgets.value.find((item: TParamsData) => item.uuid === uuid)
    widget[key] = value + Number(props.params[key] || '')
  }, 10)
}

// defineExpose({
//   setting
// })

</script>

<style lang="less" scoped>
.w-group {
  // cursor: pointer;
  outline: none;
}
</style>
