<template>
  <div>
    <h1 class="title">EO-Guide</h1>
    <p class="subtitle">Total Downloads</p>
    <h2>{{ total }}</h2>
    <p class="subtitle">Letzte Bewertung</p>
    <h3>
      {{ review }}<br />
      <font-awesome-icon v-for="star in starsArray" :key="star" icon="star" />
    </h3>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const total = ref('')
const review = ref('')
const stars = ref('')
const starsArray = ref([])

const fetchEoGuide = async () => {
  const data = await get('/eo-guide')
  if (data) {
    total.value = data.total_formatted
    review.value = data.latest_review.review_formatted
    stars.value = data.latest_review.stars
    starsArray.value = []
    for (let x = 0; x < stars.value; x++) {
      starsArray.value.push(x)
    }
  }
}

usePolling(fetchEoGuide, 21600000)
</script>
