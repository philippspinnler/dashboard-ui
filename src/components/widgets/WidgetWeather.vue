<template>
  <div class="weather-container">
    <div class="current-container">
      <h1>
        <font-awesome-icon :icon="current.weather.faIcon" />
      </h1>
      <h2>{{ current.temperature }} °C</h2>
    </div>
    <div class="daily-container" v-for="day in daily" :key="day.dateDay">
      <h2>{{ day.dateDay }}</h2>
      <h2>
        <font-awesome-icon :icon="day.weather.faIcon" />
      </h2>
      <h3>{{ day.temperature.max }} °C</h3>
      <h3>{{ day.temperature.min }} °C</h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'
import dayjs from '../../utils/datetime'

const { get } = useApi()

const current = ref({
  temperature: '',
  temperatureFeelsLike: '',
  weather: { faIcon: ['fas', 'sun'] }
})
const daily = ref([])

const iconMap = {
  '01d': ['fas', 'sun'],
  '02d': ['fas', 'cloud-sun'],
  '03d': ['fas', 'cloud'],
  '04d': ['fas', 'cloud'],
  '09d': ['fas', 'cloud-showers-heavy'],
  '10d': ['fas', 'cloud-sun-rain'],
  '11d': ['fas', 'bolt'],
  '13d': ['fas', 'snowflake'],
  '50d': ['fas', 'smog'],
  '01n': ['fas', 'sun'],
  '02n': ['fas', 'cloud-sun'],
  '03n': ['fas', 'cloud'],
  '04n': ['fas', 'cloud'],
  '09n': ['fas', 'cloud-showers-heavy'],
  '10n': ['fas', 'cloud-sun-rain'],
  '11n': ['fas', 'bolt'],
  '13n': ['fas', 'snowflake'],
  '50n': ['fas', 'smog']
}

const fetchWeather = async () => {
  const data = await get('/weather')
  if (data) {
    current.value.temperature = Math.round(data.current.temperature * 10) / 10
    current.value.temperatureFeelsLike = Math.round(data.current.temperatureFeelsLike * 10) / 10
    current.value.weather = data.current.weather[0]
    current.value.weather.faIcon = iconMap[current.value.weather.icon] || ['fas', 'sun']
    
    daily.value = data.daily.map(day => {
      return {
        dateDay: dayjs(day.date).format('dd'),
        temperature: {
          min: Math.round(day.temperature.min * 10) / 10,
          max: Math.round(day.temperature.max * 10) / 10
        },
        weather: {
          ...day.weather[0],
          faIcon: iconMap[day.weather[0].icon] || ['fas', 'sun']
        }
      }
    }).slice(1, 5)
  }
}

usePolling(fetchWeather, 5000)
</script>

<style scoped>
.weather-container {
  display: flex;
  justify-content: space-between;
}

.current-container h1 {
  font-size: 400%;
}
</style>
