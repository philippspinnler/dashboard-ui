<template>
  <div>
    <h1 class="title">Internet</h1>
    <div v-for="speedtest in speedtests" :key="speedtest.provider">
      <p class="subtitle">{{ speedtest.provider }}</p>
      <h2>
        {{ speedtest.download }} <Download />
        {{ speedtest.upload }} <Upload />
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'
import Download from 'iconoir-vue/regular/Download'
import Upload from 'iconoir-vue/regular/Upload'

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
