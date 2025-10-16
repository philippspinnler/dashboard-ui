<template>
  <div>
    <h1 class="title">Sonos</h1>
    <div v-if="!currentlyPlaying">
      <p class="subtitle">Zurzeit wird nichts abgespielt</p>
    </div>
    <div v-if="currentlyPlaying" class="sonos-container">
      <div>
        <h2>{{ truncatedName }}</h2>
        <p>{{ detail }}</p>
      </div>
      <div v-if="image" class="artwork">
        <img :src="image" alt="Album artwork" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const name = ref('')
const detail = ref('')
const image = ref('')
const currentlyPlaying = ref(false)

const truncatedName = computed(() => {
  if (name.value.length > 20) {
    return name.value.slice(0, 20) + '...'
  }
  return name.value
})

const fetchSonos = async () => {
  const data = await get('/sonos')
  if (data) {
    currentlyPlaying.value = data.playing
    name.value = data.artist
    detail.value = data.song
    image.value = data.image
  }
}

usePolling(fetchSonos, 10000)
</script>

<style scoped>
.sonos-container {
  display: flex;
}

.sonos-container .artwork > img {
  height: 3.52rem;
  width: 3.52rem;
}

.sonos-container .artwork {
  margin-left: 1.1rem;
}
</style>
