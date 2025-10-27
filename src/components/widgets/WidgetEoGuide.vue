<template>
  <div>
    <h1 class="title">EO-Guide</h1>
    <p class="subtitle">Downloads</p>
    <div class="downloads-grid">
      <div class="downloads-header">24 Stunden</div>
      <div class="downloads-header">30 Tage</div>
      <div class="downloads-header">Total</div>
      <div class="downloads-value"><h2>{{ formatNumber(downloads_last_24h) }}</h2></div>
      <div class="downloads-value"><h2>{{ formatNumber(downloads_last_30_days) }}</h2></div>
      <div class="downloads-value"><h2>{{ formatNumber(downloads_total) }}</h2></div>
    </div>
    <p class="subtitle">Bewertung</p>
    <h3>
      <font-awesome-icon
        v-for="(star, index) in starsArray"
        :key="index"
        :icon="star.icon"
        :class="star.class"
      /> {{ overall_rating }}
    </h3>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const downloads_last_24h = ref('')
const downloads_last_30_days = ref('')
const downloads_total = ref('')
const overall_rating = ref(0)

const fetchEoGuide = async () => {
  const data = await get('/eo-guide')
  if (data) {
    downloads_last_24h.value = data.net_downloads.last_24h
    downloads_last_30_days.value = data.net_downloads.last_30_days
    downloads_total.value = data.net_downloads.total
    overall_rating.value = data.overall_rating
  }
}

// Format number with apostrophe as thousand separator
const formatNumber = (num) => {
  if (num === '' || num === null || num === undefined) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
}

// Generate stars array based on rating
const starsArray = computed(() => {
  const rating = overall_rating.value
  if (!rating) return []
  
  // Round to nearest half
  const roundedRating = Math.round(rating * 2) / 2
  const stars = []
  
  // Full stars
  const fullStars = Math.floor(roundedRating)
  for (let i = 0; i < fullStars; i++) {
    stars.push({ icon: ['fas', 'star'], class: 'filled' })
  }
  
  // Half star
  if (roundedRating % 1 !== 0) {
    stars.push({ icon: ['fas', 'star-half-stroke'], class: 'filled' })
  }
  
  // Empty stars
  const emptyStars = 5 - Math.ceil(roundedRating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push({ icon: ['far', 'star'], class: 'outline' })
  }
  
  return stars
})

usePolling(fetchEoGuide, 21600000)
</script>

<style scoped>
.downloads-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: right;
}
</style>
