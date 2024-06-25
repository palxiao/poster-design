<template>
  <vue-hash-calendar class="calendar-view layer-lock" 
    :show-action="false" 
    :show-not-current-month-day="false" 
    :checked-day-class-name="`checked-day-class-name-${params.icon}`" 
    :disabled-week-view="true"
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
          <div v-if="(`${scope?.date.year}-${scope?.date.month < 10 ? 0 : ''}${scope?.date.month}-${scope?.date.day < 10 ? 0 : ''}${scope?.date.day}`) === params.value">
            <svg class="date-svg" v-if="params.icon === 'love'" t="1718205560071" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8022" width="200" height="200"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z" :fill="params.iconColor" p-id="8023"></path></svg>
            <svg class="date-svg" v-if="params.icon === 'right'" t="1719245974575" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1767" width="200" height="200"><path d="M997.888 70.144C686.592 261.12 460.8 502.272 358.912 623.104L110.08 428.032 0 516.608l429.568 437.248C503.296 764.416 737.792 394.24 1024 131.072l-26.112-60.928m0 0z"  :fill="params.iconColor" p-id="1768"></path></svg>
            <svg class="date-svg" v-if="params.icon === 'double'" t="1719246061186" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1962" width="200" height="200"><path d="M510.2 62.2c59.4 0 117 11.6 171.2 34.6 52.4 22.2 99.4 53.8 139.8 94.4 40.4 40.4 72.2 87.4 94.4 139.8 23 54.2 34.6 111.8 34.6 171.2s-11.6 117-34.6 171.2c-22.2 52.4-53.8 99.4-94.4 139.8-40.4 40.4-87.4 72.2-139.8 94.4-54.2 23-111.8 34.6-171.2 34.6s-117-11.6-171.2-34.6c-52.4-22.2-99.4-53.8-139.8-94.4-40.4-40.4-72.2-87.4-94.4-139.8-23-54.2-34.6-111.8-34.6-171.2s11.6-117 34.6-171.2c22.2-52.4 53.8-99.4 94.4-139.8 40.4-40.4 87.4-72.2 139.8-94.4C393.2 73.8 450.8 62.2 510.2 62.2M510.2 22.2c-265 0-480 215-480 480s215 480 480 480 480-215 480-480S775.4 22.2 510.2 22.2L510.2 22.2z" p-id="1963" :fill="params.iconColor"></path><path d="M202.8 626.4l0-46 71.8 0-23-46 38.4-7.6-61.4 0 0-123 251 0 0 123L418 526.8l38.4 7.6c-1.8 5.2-6 12.8-12.8 23-5.2 10.2-9.4 18-12.8 23l66.6 0 0 46L202.8 626.4zM205.4 288.4l0-46 120.4 0L325.8 198.8l59 0 0 43.6 112.6 0 0 46-112.6 0 0 41 99.8 0 0 41L220.8 370.4l0-41 105 0 0-41L205.4 288.4zM228.4 805.8l0-146 251 0 0 146-53.8 0 0-23-143.4 0 0 23L228.4 805.8zM282.2 444.6l0 41 143.4 0 0-41L282.2 444.6zM282.2 700.8l0 41 143.4 0 0-41L282.2 700.8zM302.8 526.6c12 24 20.4 41.8 25.6 53.8l48.6 0c10.2-18.8 18.8-36.6 25.6-53.8L302.8 526.6zM517.8 288.4l0-43.6 115.2 0 0-46L692 198.8l0 46 123 0 0 43.6L692 288.4l0 41 107.6 0 0 41L528.2 370.4l0-41 105 0 0-41L517.8 288.4zM517.8 626.4l0-46 66.6 0-18-38.4 48.6-10.2c3.4 10.2 9.4 23 18 38.4 1.6 3.4 3.4 6.8 5.2 10.2l51.2 0c8.6-15.4 15.4-31.6 20.4-48.6l51.2 7.6c-1.8 3.4-4.2 10.2-7.6 20.4-5.2 8.6-8.6 15.4-10.2 20.4l74.2 0 0 46L517.8 626.2zM533.2 529.2l0-125.4L792 403.8l0 125.4L533.2 529.2zM533.2 805.8l0-146L792 659.8l0 146-53.8 0 0-23-148.6 0 0 23L533.2 805.8zM589.6 447.2l0 38.4 146 0 0-38.4L589.6 447.2zM589.6 700.8l0 41 148.6 0 0-41L589.6 700.8z" p-id="1964"  :fill="params.iconColor"></path></svg>
          </div>
          <span v-else>{{ scope?.date.day || '' }}</span>
        </div>
        <div class="lunar"
        :style="{
          color: params.lunarDate.color,
          fontSize: params.lunarDate.fontSize + 'px',
          fontFamily: `'${params.lunarDate.fontClass.value}'`,
        }">
          <div v-if="(`${scope?.date.year}-${scope?.date.month < 10 ? 0 : ''}${scope?.date.month}-${scope?.date.day < 10 ? 0 : ''}${scope?.date.day}`) !== params.value">
            {{ showLunar(scope?.date) }}
          </div>
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
import { wCalendarSetting } from './wCalendarSetting'
import { TUpdateWidgetPayload } from '@/store/design/widget/actions/widget';
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
    if (isLoading.value) {
      return
    }
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
  height: 100%;
  &:deep(.calendar_content){
    height: inherit !important;
  }
  &:deep(.calendar_week){
    top: 1vw !important;
  }
  &:deep(.calendar_group){
    height: inherit !important;
    top: 110px !important;
  }
  &:deep(.calendar_day) {
    width: 100px;
    height: 100px;
    color: unset !important;
  }
  
  &:deep(.calendar_first_today span) {
    font-size: unset !important;
  } 
  &:deep(.calendar_day_today) {
    background-color: unset;
  }
  &:deep(.checked-day-class-name-love){
    // background-image: url(@/assets/svg/love.svg) !important;
    // background-size: 75%;
    // background-position: center;
    // background-repeat: no-repeat;
  }
  &:deep(.date-svg){
    width: 70px;
    height: 70px;
  }
}
</style>

