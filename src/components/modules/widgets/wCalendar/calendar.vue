<template>
  <vue-hash-calendar class="calendar-view" :show-action="false" :show-not-current-month-day="false" :checked-day-class-name="`checked-day-class-name-${params.icon}`" :disabled-week-view="true"
    v-loading="isLoading"
    :style="{
      border: `${params.border.size}px ${params.border.style} ${params.border.color}`,
      borderRadius: `${params.border.radius}px`,
      padding: `${params.padding}px`,
    }"
    :theme-color="{ 
      'main-font-color': params.date.color, 
      }">
    <!-- 星期插槽 -->
    <template v-slot:week="scope">
      <div
        :style="{
          color: params.week.color,
          fontSize: params.week.fontSize + 'px',
          fontFamily: `'${params.week.fontClass.value}'`,
        }">{{ `${scope?.week}` }}</div>
    </template>

    <!-- 日期插槽 -->
    <template v-slot:day="scope">
      <div class="lunar-content">
        <div
         class="calendar-date"
        :style="{
          color: params.date.color,
          fontSize: params.date.fontSize + 'px',
          fontFamily: `'${params.date.fontClass.value}'`,
        }">
          <svg v-if="scope?.date.day === params.value" t="1718205560071" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8022" width="200" height="200"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z" fill="#000000" p-id="8023"></path></svg>
          {{ scope?.date.day || '' }}
        </div>
        <div class="lunar"
        :style="{
          color: params.lunarDate.color,
          fontSize: params.lunarDate.fontSize + 'px',
          fontFamily: `'${params.lunarDate.fontClass.value}'`,
        }">
          {{ showLunar(scope?.date) }}
        </div>
      </div>
    </template>
  </vue-hash-calendar>
</template>

 
<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { fontWithDraw } from '@/utils/widgets/loadFontRule'
import VueHashCalendar from 'vue3-hash-calendar';
import 'vue3-hash-calendar/es/index.css';
import { lunar } from './lunar.js';
import { useForceStore, useHistoryStore, useWidgetStore } from '@/store'
type TProps = {
  params: any
}
const props = defineProps<TProps>()
const widgetStore = useWidgetStore()
const showLunar = (date) => {
  if (!date || !date.day) return;

  const lunarObj = lunar.solar2lunar(date.year, date.month + 1, date.day);

  return lunarObj.festival || lunarObj.lunarFestival || lunarObj.IDayCn;
};
const route = useRoute()
let isLoading = ref(false)
let loadedFontList = ref([]); // 已加载好的字体
const isDraw = computed(() => route.name === 'Draw' && fontWithDraw)
watch(
  () => props.params,
  async (nval) => {
    console.log(nval)
    updateText()
    if (isLoading.value) {
      return
    }
    console.log(isLoading.value);
    
    const promises = []
    let isNeedRefresh = false;
      for (const key of ['week', 'date', 'lunarDate']) { 
        // 页面找不到已加载的字体文件时再进行处理
        if(!loadedFontList.value.includes(nval[key].fontClass.value)){
          promises.push(getFonts(nval[key].fontClass))
          isNeedRefresh = true;
        } else {
          isNeedRefresh = false;
        }
        console.log('isNeedRefresh', isNeedRefresh);
        
        if(isNeedRefresh){
          console.log(promises);
          
          isLoading.value = true
        }
      }
        await Promise.all(promises)
        console.log(isLoading.value);
        isLoading.value = false
        console.log(isLoading.value);
    
  },
  { immediate: true, deep: true },
)
async function getFonts(font) {
  const loadFont = new window.FontFace(font.value, `url(${font.url})`)
  await loadFont.load()
  document.fonts.add(loadFont)
  if(!loadedFontList.value.includes(font.value)){
    loadedFontList.value.push(font.value)
  }
  console.log(loadedFontList.value);
  
}
function updateText(e?: Event) {
  const value = e && e.target ? (e.target as HTMLElement).innerHTML : props.params.text//.replace(/\n/g, '<br/>')
  if (value !== props.params.text) {
    widgetStore.updateWidgetData({
      uuid: String(props.params.uuid),
      key: 'text',
      value,
      pushHistory: false,
    })
    // store.dispatch('updateWidgetData', {
    //   uuid: props.params.uuid,
    //   key: 'text',
    //   value,
    //   pushHistory: false,
    // })
  }
}
async function setFontStyle(){
  // 异步加载字体
  // const fontFamily = props.params.week.fontClass.value; // 替换为你想要的字体名称
  // const fontUrl = props.params.week.fontClass.url;
  // const res = await fetch(fontUrl);
  // console.log('res');
  
  // console.log(res);
  
  // if (res.ok) {
  //   const style = document.createElement('style');
  //   style.innerHTML = await res.text();
  //   console.log(style.innerHTML);
    
  //   document.head.appendChild(style);
  // }
  const font = new FontFace(props.params.date.fontClass.value, props.params.date.fontClass.url);
  await font.load();
    document.fonts.add(font);
};
</script>
<style lang="less" scoped>
.lunar-content {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.lunar {
  font-size: 12px;
  transform: scale(0.8);
  width: max-content;
  text-align: center;
}
.calendar-view{
  width: inherit;
  height: inherit;
  &:deep(.calendar_content){
    height: inherit !important;
  }
  &:deep(.calendar_week){
    top: 1vw !important;
  }
  &:deep(.calendar_group){
    height: inherit !important;
    top: 4.5vw !important;
  }
  &:deep(.calendar_day) {
    // font-size: 1.5vw !important;
    // width: 5.5vw !important;
    // height: 5.5vw !important;
  }
  &:deep(.calendar_day_today) {
    background-color: unset;
  }
  &:deep(.checked-day-class-name-love){
    background-image: url(@/assets/svg/love.svg) !important;
    background-size: 75%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>

