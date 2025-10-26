<template>
  <div>
    <h1 class="title">Autos</h1>
    <!-- Support for multiple cars using v-for loop -->
    <div v-for="car in cars" :key="car.name" class="car-item">
      <h2>{{ car.name }}</h2>
      <div class="car-details">
        <p class="subtitle">
          <font-awesome-icon icon="bolt" /> {{ car.charge_procentage }}%
        </p>
        <p class="subtitle">
          <font-awesome-icon icon="gauge" /> {{ car.range }} km
        </p>
        <div v-if="car.charging_status === '1'" class="charging-status">
          <span class="charging-indicator">⚡ Lädt</span>
          <small v-if="car.end_of_charge" class="time-label">Fertig {{ endOfChargeTime(car.end_of_charge) }}</small>
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
