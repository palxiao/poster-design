<template>
  <div class="calendar u-flex u-flex-wrap">
    <div class="u-flex u-row-around row week-th">
      <span
        class="item th"
        :style="{
          color: params.week.color,
          fontSize: params.week.fontSize + 'px',
          fontFamily: `'${params.week.fontClass.value}'`,
        }"
        v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="u-flex u-row-around row">
        <div class="item" v-for="(date, index) in days" :key="index" :class="{ 'calendar-current-day': isCurrentDay(date) }">
          <div class="day">
            {{ date }}
          </div>
          <div class="lunar-day">
            {{ date }}
          </div>
    </div>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import { ref, computed } from 'vue';
import VueHashCalendar from 'vue3-hash-calendar';
import 'vue3-hash-calendar/es/index.css';
type TProps = {
  params: any
}
const props = defineProps<TProps>()
    console.log(props)
    const currentDate = ref(new Date());
     // 初始化日历
    const date = new Date();
    const curYear = date.getFullYear(); // 当前年份
    const curMonth = date.getMonth() + 1; // 当前月份
    const curDay = date.getDate(); // 当前日期

    const lunarDate = getLunar(curYear, curMonth, curDay);
    console.log(lunarDate)
    const currentYear = computed(() => currentDate.value.getFullYear());
    const currentMonth = computed(() => currentDate.value.getMonth());
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const days = computed(() => {
      let daysInMonth = [];
      let daysInLastMonth = getDaysInLastMonth();
      for (let i = 1; i <= daysInLastMonth; i++) {
        daysInMonth.push(i);
      }
      let daysInCurrentMonth = getDaysInCurrentMonth();
      for (let i = 1; i <= daysInCurrentMonth; i++) {
        daysInMonth.push(i);
      }
      return daysInMonth;
    });
 
    function getDaysInLastMonth() {
      let lastMonth = new Date(currentYear.value, currentMonth.value, 0);
      return lastMonth.getDate();
    }
 
    function getDaysInCurrentMonth() {
      let currentMonth2 = new Date(currentYear.value, currentMonth.value + 1, 0);
      return currentMonth2.getDate();
    }
 
    function isCurrentDay(date) {
      return date === currentDate.value.getDate();
    }
 
    function prevMonth() {
      currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
    }
 
    function nextMonth() {
      currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
    }
 
</script>
 
<style scoped>
.calendar {
  width: inherit;
  height: inherit;
  border: 1px solid #000;
  padding: 10px;
}
/* .calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calendar-weekdays span,
.calendar-days span {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
}
.calendar-current-day {
  background-color: #f0f0f0;
} */
.u-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.u-flex-wrap {
    flex-wrap: wrap;
}
.box .row {
    width: 100%;
}
.week-th{
  display: flex;
  width: 100%;
  flex-direction: row;
}
.u-row-around {
    justify-content: space-around;
}
.item {
  width: 14.28%;
  text-align: center;
  position: relative;
}
</style>