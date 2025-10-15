<template>
  <div id="app" :style="{ backgroundImage: `url(${image})` }">
    <div class="container" :style="{ backgroundColor: backgroundColor }">
      <div class="container-content">
        <div class="container-content-left">
          <div class="widget widget-clock">
            <WidgetClock />
          </div>
          <div class="widget widget-calendar">
            <WidgetCalendar />
          </div>
        </div>
        <div class="container-content-right">
          <div class="widget widget-sonos">
            <WidgetSonos />
          </div>
          <div class="widget widget-presence">
            <WidgetPresence />
          </div>
          <div class="widget widget-internet">
            <WidgetInternet />
          </div>
          <div class="widget widget-netatmo">
            <WidgetNetatmo />
          </div>
          <div class="widget widget-public-transportation">
            <WidgetPublicTransportation />
          </div>
          <div class="widget widget-eo-guide">
            <WidgetEoGuide />
          </div>
        </div>
      </div>
      <div class="container-bottom">
        <div class="widget widget-weather">
          <WidgetWeather />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from './composables/useApi'
import WidgetClock from './components/widgets/WidgetClock.vue'
import WidgetCalendar from './components/widgets/WidgetCalendar.vue'
import WidgetSonos from './components/widgets/WidgetSonos.vue'
import WidgetPresence from './components/widgets/WidgetPresence.vue'
import WidgetInternet from './components/widgets/WidgetInternet.vue'
import WidgetNetatmo from './components/widgets/WidgetNetatmo.vue'
import WidgetPublicTransportation from './components/widgets/WidgetPublicTransportation.vue'
import WidgetEoGuide from './components/widgets/WidgetEoGuide.vue'
import WidgetWeather from './components/widgets/WidgetWeather.vue'

const { get } = useApi()
const image = ref(null)
const backgroundColor = ref('rgba(0, 0, 0, 1)')

const transitionStepSpeed = 50

const getImages = async () => {
  const data = await get('/album')
  if (data && data.images && data.images.length > 0) {
    image.value = data.images[Math.floor(Math.random() * data.images.length)]
  }
}

const fadeToBlack = async () => {
  for (let x = 0.55; x <= 1.05; x = x + 0.05) {
    backgroundColor.value = `rgba(0, 0, 0, ${x})`
    await new Promise(r => setTimeout(r, transitionStepSpeed))
  }
}

const fadeToTransparent = async () => {
  await new Promise(r => setTimeout(r, 1000))
  for (let x = 0.9; x >= 0.5; x = x - 0.05) {
    backgroundColor.value = `rgba(0, 0, 0, ${x})`
    await new Promise(r => setTimeout(r, transitionStepSpeed))
  }
}

onMounted(async () => {
  await getImages()
  await fadeToTransparent()

  setInterval(async () => {
    await fadeToBlack()
    await getImages()
    await fadeToTransparent()
  }, 5 * 1000 * 60)
})
</script>
