<template>
  <div id="app" :style="{ backgroundImage: `url(${image})` }">
    <div class="container" :style="{ backgroundColor: backgroundColor }">
      <div class="container-top">
        <div class="container-top-left">
          <div 
            v-for="widgetId in topLeftWidgets" 
            :key="widgetId" 
            class="widget" 
            :class="[`widget-${widgetId}`, { 'widget-glassmorphism': enableGlassmorphism }]"
          >
            <component :is="widgetComponents[widgetId]" v-if="widgetComponents[widgetId]" />
          </div>
        </div>
        <div class="container-top-right">
          <div 
            v-for="widgetId in topRightWidgets" 
            :key="widgetId" 
            class="widget" 
            :class="[`widget-${widgetId}`, { 'widget-glassmorphism': enableGlassmorphism }]"
          >
            <component :is="widgetComponents[widgetId]" v-if="widgetComponents[widgetId]" />
          </div>
        </div>
      </div>
      <div class="container-content">
        <div class="container-content-left">
          <div 
            v-for="widgetId in leftWidgets" 
            :key="widgetId" 
            class="widget" 
            :class="[`widget-${widgetId}`, { 'widget-glassmorphism': enableGlassmorphism }]"
          >
            <component :is="widgetComponents[widgetId]" v-if="widgetComponents[widgetId]" />
          </div>
        </div>
        <div class="container-content-right">
          <div 
            v-for="widgetId in rightWidgets" 
            :key="widgetId" 
            class="widget" 
            :class="[`widget-${widgetId}`, { 'widget-glassmorphism': enableGlassmorphism }]"
          >
            <component :is="widgetComponents[widgetId]" v-if="widgetComponents[widgetId]" />
          </div>
        </div>
      </div>
      <div class="container-bottom">
        <div 
          v-for="widgetId in bottomWidgets" 
          :key="widgetId" 
          class="widget" 
          :class="[`widget-${widgetId}`, { 'widget-glassmorphism': enableGlassmorphism }]"
        >
          <component :is="widgetComponents[widgetId]" v-if="widgetComponents[widgetId]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from './composables/useApi'
import { useWidgetConfig } from './composables/useWidgetConfig'
import WidgetClock from './components/widgets/WidgetClock.vue'
import WidgetCalendar from './components/widgets/WidgetCalendar.vue'
import WidgetSonos from './components/widgets/WidgetSonos.vue'
import WidgetPresence from './components/widgets/WidgetPresence.vue'
import WidgetInternet from './components/widgets/WidgetInternet.vue'
import WidgetNetatmo from './components/widgets/WidgetNetatmo.vue'
import WidgetPublicTransportation from './components/widgets/WidgetPublicTransportation.vue'
import WidgetEoGuide from './components/widgets/WidgetEoGuide.vue'
import WidgetWeather from './components/widgets/WidgetWeather.vue'
import WidgetCars from './components/widgets/WidgetCars.vue'
import WidgetInverter from './components/widgets/WidgetInverter.vue'

const { get } = useApi()
const { topLeftWidgets, topRightWidgets, leftWidgets, rightWidgets, bottomWidgets } = useWidgetConfig()

// Glassmorphism configuration
const enableGlassmorphism = computed(() => {
  // Try runtime config first (window.ENV from config.js)
  if (window.ENV && window.ENV.VITE_ENABLE_GLASSMORPHISM && 
      !window.ENV.VITE_ENABLE_GLASSMORPHISM.startsWith('__') && 
      !window.ENV.VITE_ENABLE_GLASSMORPHISM.startsWith('${')) {
    return window.ENV.VITE_ENABLE_GLASSMORPHISM === 'true'
  }
  // Fall back to build-time config (import.meta.env from .env)
  return import.meta.env.VITE_ENABLE_GLASSMORPHISM === 'true'
})

// Component mapping
const widgetComponents = {
  'clock': WidgetClock,
  'calendar': WidgetCalendar,
  'sonos': WidgetSonos,
  'presence': WidgetPresence,
  'internet': WidgetInternet,
  'netatmo': WidgetNetatmo,
  'public-transportation': WidgetPublicTransportation,
  'eo-guide': WidgetEoGuide,
  'weather': WidgetWeather,
  'cars': WidgetCars,
  'inverter': WidgetInverter
}

const image = ref(null)
const backgroundColor = ref('rgba(0, 0, 0, 1)')
const previousImage = ref(null)

const transitionStepSpeed = 50

// Preload image to ensure it loads before displaying
const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

const getImages = async () => {
  try {
    const data = await get('/album')
    if (data && data.images && data.images.length > 0) {
      // Try each image until one loads successfully
      const shuffledImages = [...data.images].sort(() => Math.random() - 0.5)
      
      for (const imageUrl of shuffledImages) {
        try {
          await preloadImage(imageUrl)
          // Image loaded successfully, use it
          previousImage.value = image.value
          image.value = imageUrl
          console.log('Successfully loaded image:', imageUrl)
          return true
        } catch (error) {
          console.warn('Failed to load image, trying next:', error.message)
        }
      }
      
      // If all images failed and we have a previous image, keep it
      if (previousImage.value) {
        console.warn('All images failed to load, keeping previous image')
        image.value = previousImage.value
      } else {
        console.error('All images failed to load and no previous image available')
      }
      return false
    } else {
      console.warn('No images in response from /album')
      return false
    }
  } catch (error) {
    console.error('Error fetching album images:', error)
    // Keep previous image if available
    if (previousImage.value) {
      image.value = previousImage.value
    }
    return false
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
  const initialLoad = await getImages()
  if (initialLoad) {
    await fadeToTransparent()
  } else {
    console.error('Failed to load initial image')
  }

  setInterval(async () => {
    await fadeToBlack()
    const loaded = await getImages()
    // Only fade to transparent if image loaded successfully
    if (loaded || image.value) {
      await fadeToTransparent()
    }
  }, 5 * 1000 * 60)
})
</script>
