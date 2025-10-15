<template>
  <div>
    <h1 class="title">ÖV</h1>
    <p class="subtitle">WB nach Liestal</p>
    <h2>
      <small style="font-size: 50%; margin-right: 50px">{{ hoelstein }} Uhr</small>
      {{ hoelsteinInMinutes }}
    </h2>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'
import dayjs from '../../utils/datetime'

const { get } = useApi()
const hoelstein = ref('')
const hoelsteinInMinutes = ref('')

const fetchPublicTransportation = async () => {
  const data = await get('/public-transportation?connections=[["Hölstein, Süd", "Liestal, Bahnhof", "direct"]]')
  if (data && data.connections && data.connections[0]) {
    hoelstein.value = dayjs(data.connections[0].departure).format('HH:mm')
    hoelsteinInMinutes.value = dayjs().to(data.connections[0].departure)
  }
}

usePolling(fetchPublicTransportation, 5000)
</script>
