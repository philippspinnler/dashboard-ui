<template>
  <div>
    <h1 class="title">Internet</h1>
    <div v-for="speedtest in speedtests" :key="speedtest.provider">
      <p class="subtitle">{{ speedtest.provider }}</p>
      <h2>
        {{ speedtest.download }} <font-awesome-icon icon="chevron-down" />
        {{ speedtest.upload }} <font-awesome-icon icon="chevron-up" />
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const speedtests = ref([])

const fetchSpeedtest = async () => {
  const data = await get('/speedtest')
  if (data) {
    speedtests.value = data
  }
}

usePolling(fetchSpeedtest, 1800000)
</script>
