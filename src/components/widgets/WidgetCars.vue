<template>
  <div>
    <h1 class="title">Autos</h1>
    <!-- Support for multiple cars using v-for loop -->
    <div v-for="car in cars" :key="car.name" class="car-item">
      <p class="subtitle">{{ car.name }}</p>
      <div class="car-details">
        <div class="car-info">
          <span class="charge-percentage">{{ car.charge_procentage }}%</span>
          <span class="range">{{ car.range }} km</span>
          <span v-if="car.charging_status === '1'" class="charging-indicator">⚡ Lädt</span>
        </div>
        <div v-if="car.charging_status === '1' && car.end_of_charge" class="charge-time">
          <small class="time-label">Fertig {{ endOfChargeTime(car.end_of_charge) }}</small>
        </div>
      </div>
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

usePolling(fetchCars, 300000) // Poll every 5 minutes
</script>

<style scoped>
.car-item {
  margin-bottom: 1rem;
}

.car-item:last-child {
  margin-bottom: 0;
}

.car-details {
  margin-top: 0.5rem;
}

.car-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.charge-percentage {
  font-weight: bold;
  font-size: 1.2em;
}

.range {
  color: rgba(255, 255, 255, 0.8);
}

.charging-indicator {
  color: #4ade80;
  font-size: 0.9em;
}

.charge-time {
  margin-top: 0.5rem;
}

.time-label {
  color: rgba(255, 255, 255, 0.7);
}
</style>
