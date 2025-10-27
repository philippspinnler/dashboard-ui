<template>
  <div>
    <h1 class="title">{{ cars.length === 1 ? 'Auto' : 'Autos' }}</h1>
    <!-- Support for multiple cars using v-for loop -->
    <div v-for="car in cars" :key="car.name">
      <p class="subtitle">{{ car.name }}</p>
      <h3>
        <font-awesome-icon :icon="getBatteryIcon(car.charge_procentage)" /> {{ car.charge_procentage }} %
        <font-awesome-icon icon="charging-station" /> {{ car.range }} km
      </h3>
      <h3 v-if="car.charging_active === 'on'">
        <font-awesome-icon icon="clock" /> geladen {{ endOfChargeTime(car.end_of_charge) }}
        <font-awesome-icon icon="bolt" /> {{car.charging_power}} kw
      </h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'
import dayjs from '../../utils/datetime'

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
  if (percentage <= 20) return 'battery-empty'
  if (percentage <= 40) return 'battery-quarter'
  if (percentage <= 60) return 'battery-half'
  if (percentage <= 80) return 'battery-three-quarters'
  return 'battery-full'
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
