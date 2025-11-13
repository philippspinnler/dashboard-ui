<template>
  <div>
    <h1 class="title">{{ cars.length === 1 ? 'Auto' : 'Autos' }}</h1>
    <!-- Support for multiple cars using v-for loop -->
    <div v-for="car in cars" :key="car.name">
      <p class="subtitle">{{ car.name }}</p>
      <h3>
        <component :is="getBatteryIcon(car.charge_procentage)" /> {{ car.charge_procentage }} %
        <EvPlugCharging /> {{ car.range }} km
      </h3>
      <h3 v-if="car.charging">
        <Clock /> geladen {{ endOfChargeTime(car.end_of_charge) }}
        <Flash /> {{car.charging_power}} kw
      </h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'
import dayjs from '../../utils/datetime'
import BatteryEmpty from 'iconoir-vue/regular/BatteryEmpty'
import BatteryWarning from 'iconoir-vue/regular/BatteryWarning'
import Battery50 from 'iconoir-vue/regular/Battery50'
import Battery75 from 'iconoir-vue/regular/Battery75'
import BatteryFull from 'iconoir-vue/regular/BatteryFull'
import EvPlugCharging from 'iconoir-vue/regular/EvPlugCharging'
import Clock from 'iconoir-vue/regular/Clock'
import Flash from 'iconoir-vue/regular/Flash'

const { get } = useApi()
const cars = ref([])

const fetchCars = async () => {
  const data = await get('/cars')
  if (data && Array.isArray(data)) {
    cars.value = data
  }
}

const endOfChargeTime = (endTime) => {
  return dayjs().to(endTime)
}

const getBatteryIcon = (percentage) => {
  if (percentage <= 20) return BatteryEmpty
  if (percentage <= 40) return BatteryWarning
  if (percentage <= 60) return Battery50
  if (percentage <= 80) return Battery75
  return BatteryFull
}

usePolling(fetchCars, 300000) // Poll every 5 minutes
</script>

<style scoped>
.car-item {
  margin-bottom: 1rem;
}

.car-item:last-child {
  margin-bottom: 0;
}

.car-details p {
  margin-bottom: 0.3rem;
}

.charging-status {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.charging-indicator {
  color: #4ade80;
  font-size: 0.9em;
}

.time-label {
  color: rgba(255, 255, 255, 0.7);
}
</style>
