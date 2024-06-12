<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <span>{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="calendar-days">
      <span v-for="(date, index) in days" :key="index" :class="{ 'calendar-current-day': isCurrentDay(date) }">
        {{ date }}
      </span>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed } from 'vue';
 
    const currentDate = ref(new Date());
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
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  padding: 10px;
}
.calendar-header {
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
}
</style>