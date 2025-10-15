<template>
  <div>
    <h1 class="title">Netatmo</h1>
    <p class="subtitle">Innen</p>
    <h2>{{ inside }} °C</h2>
    <p class="subtitle">Aussen</p>
    <h2>{{ outside }} °C</h2>
    <p class="subtitle">CO2</p>
    <h2>{{ co2 }} ppm</h2>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const inside = ref('')
const co2 = ref('')
const outside = ref('')

const fetchNetatmo = async () => {
  const data = await get('/netatmo')
  if (data) {
    inside.value = data.indoor_temperature
    co2.value = data.indoor_co2
    outside.value = data.outdoor_temperature
  }
}

usePolling(fetchNetatmo, 5000)
</script>
