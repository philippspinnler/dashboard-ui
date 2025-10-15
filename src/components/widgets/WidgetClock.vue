<template>
  <div class="widget-clock">
    <div class="clock-container">
      <div class="time">{{ hours }}:{{ minutes }}</div>
      <div class="seconds">{{ seconds }}</div>
    </div>
    <div class="date-container">{{ date }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePolling } from '../../composables/usePolling'
import dayjs from '../../utils/datetime'

const hours = ref('')
const minutes = ref('')
const seconds = ref('')
const date = ref('')

const updateTime = () => {
  const now = new Date()
  date.value = dayjs(now).format('dddd, D. MMMM YYYY')
  hours.value = dayjs(now).format('HH')
  minutes.value = dayjs(now).format('mm')
  seconds.value = dayjs(now).format('ss')
}

usePolling(updateTime, 1000)
</script>

<style scoped>
.widget-clock .clock-container {
  display: flex;
  margin-bottom: -30px;
}

.widget-clock .time {
  font-size: 400%;
}

.widget-clock .seconds {
  margin-top: 30px;
  font-size: 150%;
  margin-left: 10px;
}

.widget-clock .date-container {
  font-size: 120%;
}
</style>
