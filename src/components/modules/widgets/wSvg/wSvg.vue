<!--
  TODO: 重构
-->
<template>
  <div
    :id="params.uuid"
    ref="widgetRef"
    class="w-svg"
    :style="{
      position: state.position,
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      opacity: params.opacity,
    }"
  ></div>
</template>

<script lang="ts" setup>
// svg
// const NAME = 'w-svg'
import { mapGetters, mapActions, useStore } from 'vuex'
import { TWSvgSetting } from './wSvgSetting'
import { CSSProperties, computed, nextTick, onBeforeMount, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import { useSetupMapGetters } from '@/common/hooks/mapGetters';

type TProps = {
  params: TWSvgSetting
  parent: {
    left: number
    top: number
  }
}

type TState = {
  position: CSSProperties['position'], // 'absolute'relative
  editBoxStyle: CSSProperties,
  editBoxs: Record<string, any>,
  editingKey: string,
  cropWidgetXY: Record<string, any>, // 裁剪框移动作用
  attrRecord: Record<string, any>, // 记录可更改的属性
  svgImg: Record<string, any> | null
}

const props = defineProps<TProps>()
const state = reactive<TState>({
  position: 'absolute', // 'absolute'relative
  editBoxStyle: {
    transformOrigin: 'center',
  },
  editBoxs: {},
  editingKey: '',
  cropWidgetXY: {}, // 裁剪框移动作用
  attrRecord: {}, // 记录可更改的属性
  svgImg: null
})
const store = useStore()
// ...mapGetters(['dActiveElement', 'dZoom', 'dMouseXY']),
const {
  dActiveElement, dZoom, dMouseXY
} = useSetupMapGetters(['dActiveElement', 'dZoom', 'dMouseXY'])

const widgetRef = ref<HTMLElement | null>(null)

let svgElements: Record<string, any>[] | null = null
let viewBox = { width: 0, height: 0 }

const tZoom = computed(() => {
  return props.params.zoom
})
const cropEdit = computed(() => {
  return props.params.cropEdit
})
const imgChange = computed(() => {
  return props.params.imgUrl
})

watch(
  () => props.params,
  () => {
    attrsChange()
  },
  { immediate: true, deep: true }
)

watch(
  () => tZoom.value,
  async () => {
    await nextTick()
    updateRecord()
  }
)

watch(
  () => imgChange.value,
  () => {
    if (!state.svgImg) return
    state.svgImg.attr({
      'xlink:href': props.params.imgUrl,
    })
  }
)

watch(
  () => cropEdit.value,
  (val) => {
    const el = document.getElementById(props.params.uuid)
    if (val) {
      el?.addEventListener('mousedown', touchstart, false)
    } else {
      el?.removeEventListener('mousedown', touchstart, false)
    }
  }
)

onUpdated(() => {
  updateRecord()
  store.commit('updateRect')
})

onMounted(async () => {
  await nextTick()
  await loadSvg()
  updateRecord()
  document.getElementById(props.params.uuid)?.addEventListener('mousedown', touchstart, false)
  document.addEventListener('mouseup', touchend, false)
  if (!widgetRef.value) return
  props.params.transform && (widgetRef.value.style.transform = props.params.transform)
  props.params.rotate && (widgetRef.value.style.transform += `rotate(${props.params.rotate})`)
})

onBeforeMount(() => {
  // document.removeEventListener('mouseup', touchend, false)
})

// ...mapActions(['updateWidgetData'])

function touchstart(e: MouseEvent) {
  // TODO move start
  // const imgKey = e.target.getAttribute('img-key')
  // this.editingKey = imgKey
  // this.editBoxs[this.editingKey] = {
  //   transformOrigin: 'center',
  // }
  // const editBox = this.$refs[this.params.uuid + '_ebox_' + imgKey]
  // const editBox = this.$refs[this.params.uuid + '_ebox']
  const editBox = document.getElementById(props.params.uuid + '_ebox')
  if (editBox) {
    state.cropWidgetXY = {
      x: Number(editBox.style.left.replace('px', '')) || 0,
      y: Number(editBox.style.top.replace('px', '')) || 0,
    }
  }
  // 绑定鼠标移动事件
  document.addEventListener('mousemove', handlemousemove, true)
}

function touchend() {
  // 取消鼠标移动事件
  document.removeEventListener('mousemove', handlemousemove, true)
  // document.removeEventListener('mouseup', () => {}, true)
}

function handlemousemove(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  const { left, top } = move(e)
  // TODO
  state.editBoxStyle.left = left + 'px'
  state.editBoxStyle.top = top + 'px'
  // this.editBoxs[this.editingKey].left = left + 'px'
  // this.editBoxs[this.editingKey].top = top + 'px'
  const { width, height } = props.params
  const { width: vWidth, height: vHeight } = viewBox
  const params = {
    x: left / (width / vWidth) / (props.params.zoom || 0),
    y: top / (height / vHeight) / (props.params.zoom || 0),
  }
  // this.svgImg.attr(params)
  changeFinish('x', params.x)
  changeFinish('y', params.y)
  // console.log('-----', left / (width / vWidth) / this.params.zoom)
}

function loadSvg() {
  // console.log(this.params)
  const Snap = (window as any).Snap
  return new Promise<void>((resolve) => {
    Snap.load(
      props.params.svgUrl,
      function (svg: Record<string, any>) {
        let svg2 = Snap(svg.node)
        // let item = svg2.select('circle')
        // item.attr({
        //   fill: 'rgb(255, 0, 0)',
        // })
        // console.log(item.attr('fill'))

        let items = svg2.node.childNodes
        svg2.node.removeAttribute('width')
        svg2.node.removeAttribute('height')
        svg2.node.setAttribute('style', 'height: inherit;width: inherit;')
        // svg2.node.setAttribute('height', 'inherit')
        svgElements = []
        const colorsObj = color2obj()

        deepElement(items)

        function deepElement(els: Record<string, any>) {
          // 判断是NodeList对象则继续递归，否则进入元素处理工厂
          if (els.item) {
            els.forEach((element: Record<string, any>) => {
              elementFactory(element)
              if (element.childNodes.length > 0) {
                element.childNodes.forEach((element: Record<string, any>) => {
                  deepElement(element)
                })
              }
            })
          } else {
            elementFactory(els)
          }
        }
        // 元素工厂: 遍历元素中是否存在可自定义的颜色属性
        function elementFactory(element: Record<string, any>) {
          const attrsColor: Record<string, any> = {}
          try {
            element.attributes.forEach((attr: Record<string, any>) => {
              if (colorsObj[attr.value]) {
                // console.log(attr.name, colorsObj[attr.value])
                attr.value = colorsObj[attr.value]
                attrsColor[attr.name] = props.params.colors.findIndex((x) => x == attr.value)
              }
            })
          } catch (e) {}
          if (JSON.stringify(attrsColor) !== '{}' && svgElements) {
            svgElements.push({
              item: element,
              attrsColor,
            })
          }
          // console.log(element.attributes, element.getAttribute('fill'), _this.params.colors)
        }

        // _this.viewBox = svg2.node.viewBox.baseVal
        // _this.svgImg = img

        // img.attr({
        //   width: '100%',
        //   height: '100%',
        //   transform: '',
        //   'xlink:href': _this.params.imgUrl || '',
        // })
        if (widgetRef.value) {
          // svg.node.classList.add('svg__box')
          widgetRef.value.appendChild(svg.node)
        }
        resolve()
      },
      document.getElementById(props.params.uuid),
    )
  })
}

function color2obj() {
  const obj: Record<string, any> = {}
  for (let i = 0; i < props.params.colors.length; i++) {
    obj[`{{colors[${i}]}}`] = props.params.colors[i]
  }
  return obj
}

function updateRecord() {
  if (dActiveElement.value.uuid === props.params.uuid) {
    let record = dActiveElement.value.record
    if (widgetRef.value) {
      record.width = widgetRef.value.offsetWidth
      record.height = widgetRef.value.offsetHeight
    }
  }
  updateZoom()
}

function updateZoom() {
  // TODO
  state.editBoxStyle.transform = `scale(${props.params.zoom})`
  // this.editingKey && (this.editBoxs[this.editingKey].transform = `scale(${this.params.zoom})`)
  if (state.svgImg) {
    const { x = 0, y = 0 } = props.params
    state.svgImg.attr({
      x: x ?? 0,
      y: y ?? 0,
      style: `transform-origin: center;transform: scale(${props.params.zoom})`,
    })
    // 根据图片位置设置回editBox的位置
    const { width, height } = props.params
    const { width: vWidth, height: vHeight } = viewBox
    const params = {
      left: x * (width / vWidth) * (props.params.zoom || 0),
      top: y * (height / vHeight) * (props.params.zoom || 0),
    }
    // TODO
    state.editBoxStyle.left = params.left + 'px'
    state.editBoxStyle.top = params.top + 'px'
    // if (this.editingKey) {
    //   this.editBoxs[this.editingKey].left = params.left + 'px'
    //   this.editBoxs[this.editingKey].top = params.top + 'px'
    // }
  }
}

function changeFinish(key: string, value: number) {
  store.dispatch("updateWidgetData", {
    uuid: props.params.uuid,
    key: key,
    value: value,
    pushHistory: true,
  })
  // this.updateWidgetData({
  //   uuid: this.params.uuid,
  //   key: key,
  //   value: value,
  //   pushHistory: true,
  // })
}

function move(payload: Record<string, any>) {
  // const widgetXY = { x: this.cropWidgetXY.x / this.dZoom, y: this.cropWidgetXY.y / this.dZoom }
  const widgetXY = { x: state.cropWidgetXY.x, y: state.cropWidgetXY.y }
  const dx = Number(payload.pageX) - dMouseXY.value.x
  const dy = Number(payload.pageY) - dMouseXY.value.y
  let left = Number(widgetXY.x) + Math.floor((dx * 100) / dZoom.value)
  let top = Number(widgetXY.y) + Math.floor((dy * 100) / dZoom.value)
  return { left, top }
}

function attrsChange() {
  if (dActiveElement.value.uuid === props.params.uuid && svgElements) {
    for (const element of svgElements) {
      const { item, attrsColor } = element
      for (const key in attrsColor) {
        if (Object.hasOwnProperty.call(attrsColor, key)) {
          const color = props.params.colors[attrsColor[key]]
          item.setAttribute(key, color)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.svg__edit__wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.w-svg {
  cursor: pointer;
  outline: none;
}
.edit__model {
  opacity: 0.3;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
