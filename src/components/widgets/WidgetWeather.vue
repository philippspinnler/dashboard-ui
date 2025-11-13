<template>
  <div class="weather-container">
    <div class="current-container">
      <h1>
        <component :is="current.weather.iconComponent" />
      </h1>
      <h2>{{ current.temperature }} °C</h2>
    </div>
    <div class="daily-container" v-for="day in daily" :key="day.dateDay">
      <h2>{{ day.dateDay }}</h2>
      <h2>
        <component :is="day.weather.iconComponent" />
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
import SunLight from 'iconoir-vue/regular/SunLight'
import CloudSunny from 'iconoir-vue/regular/CloudSunny'
import Cloud from 'iconoir-vue/regular/Cloud'
import Rain from 'iconoir-vue/regular/Rain'
import Flash from 'iconoir-vue/regular/Flash'
import Snow from 'iconoir-vue/regular/Snow'
import Fog from 'iconoir-vue/regular/Fog'

const { get } = useApi()

const current = ref({
  temperature: '',
  temperatureFeelsLike: '',
  weather: { iconComponent: SunLight }
})
const daily = ref([])

const iconMap = {
  '01d': SunLight,
  '02d': CloudSunny,
  '03d': Cloud,
  '04d': Cloud,
  '09d': Rain,
  '10d': Rain,
  '11d': Flash,
  '13d': Snow,
  '50d': Fog,
  '01n': SunLight,
  '02n': CloudSunny,
  '03n': Cloud,
  '04n': Cloud,
  '09n': Rain,
  '10n': Rain,
  '11n': Flash,
  '13n': Snow,
  '50n': Fog
}

const fetchWeather = async () => {
  const data = await get('/weather')
  if (data) {
    current.value.temperature = Math.round(data.current.temperature * 10) / 10
    current.value.temperatureFeelsLike = Math.round(data.current.temperatureFeelsLike * 10) / 10
    current.value.weather = data.current.weather[0]
    current.value.weather.iconComponent = iconMap[current.value.weather.icon] || SunLight
    
    daily.value = data.daily.map(day => {
      return {
        dateDay: dayjs(day.date).format('dd'),
        temperature: {
          min: Math.round(day.temperature.min * 10) / 10,
          max: Math.round(day.temperature.max * 10) / 10
        },
        weather: {
          ...day.weather[0],
          iconComponent: iconMap[day.weather[0].icon] || SunLight
        }
      }
    }).slice(1, 5)
  }
}

usePolling(fetchWeather, 3600000)
</script>

<style scoped>
.weather-container {
  display: flex;
  justify-content: space-between;
}

.current-container h1 {
  font-size: 4rem;
}
</style>
