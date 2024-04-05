<template>
  <div class="line-layout">
    <number-input :modelValue="loc.x" label="X" @update:modelValue="(value) => change('x', value)" />
    <number-input :modelValue="loc.y" label="Y" @update:modelValue="(value) => change('y', value)" />
    <number-input :modelValue="width" style="margin-top: 0.5rem" label="宽" :editable="true" @update:modelValue="(value) => change('width', value)" />
    <number-input :modelValue="height" style="margin-top: 0.5rem" label="高" :editable="true" @update:modelValue="(value) => change('height', value)" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import numberInput from '../../modules/settings/numberInput.vue'
import { useWidgetStore } from '../../../store'
import { getOffsetFromTransform, removeTranslate } from '../../../utils/widgets/transferTranslate'
import { TUpdateWidgetPayload } from '../../../store/design/widget/actions/widget'
const widgetStore = useWidgetStore()
const dActiveElement = computed(() => widgetStore.dActiveElement)
const loc = computed(() => getOffsetFromTransform(dActiveElement.value?.transform))
const transformNLoc = computed(() => removeTranslate(dActiveElement.value?.transform))
const width = computed(() => dActiveElement.value?.width)
const height = computed(() => dActiveElement.value?.height)


function change(key: string, value: number | Record<string, any> | string) {
  console.log(key, value, 'change===')
  const uuid = dActiveElement.value?.uuid ?? ''
  let transform = transformNLoc.value
  let _key = key
  let _value = value
  if (key === 'x') {
    transform = `translate(${value}px, ${loc.value.y}px) ${transform}`
    _key = 'transform'
    _value = transform
  } else if (key === 'y') {
    transform = `translate(${loc.value.x}px, ${value}px) ${transform}`
    _key = 'transform'
    _value = transform
  }
  widgetStore.updateWidgetData({
    uuid,
    key: _key as TUpdateWidgetPayload['key'],
    value: _value,
    pushHistory: false,
  })
}
</script>
