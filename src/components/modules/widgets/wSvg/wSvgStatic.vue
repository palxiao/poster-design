<!--
  TODO: 重构
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
  ></div>
</template>

<script lang="ts" setup>
import { TWSvgSetting } from './wSvgSetting'
import { CSSProperties, computed, nextTick, onBeforeMount, onMounted, onUpdated, reactive, ref, watch } from 'vue';

type TProps = {
  params: TWSvgSetting
  parent: {
    left: number
    top: number
  }
}

type TState = {
  position: CSSProperties['position'], // 'absolute'relative
}

const props = defineProps<TProps>()
const state = reactive<TState>({
  position: 'absolute', // 'absolute'relative
})

const widgetRef = ref<HTMLElement | null>(null)

let svgElements: Record<string, any>[] | null = null
onMounted(async () => {
  await nextTick()
  await loadSvg()
})

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

</script>
