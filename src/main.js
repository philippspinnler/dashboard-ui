import { createApp } from 'vue'
import App from './App.vue'

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faGift,
  faChevronDown,
  faChevronUp,
  faStar,
  faStarHalfStroke,
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudSunRain,
  faBolt,
  faSnowflake,
  faSmog,
  faChargingStation,
  faClock,
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryHalf,
  faBatteryThreeQuarters,
  faBatteryFull
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'

// Add icons to the library
library.add(
  faGift,
  faChevronDown,
  faChevronUp,
  faStar,
  faStarHalfStroke,
  faStarRegular,
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudSunRain,
  faBolt,
  faSnowflake,
  faSmog,
  faChargingStation,
  faClock,
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryHalf,
  faBatteryThreeQuarters,
  faBatteryFull
)

// Import global styles
import './styles/main.css'

const app = createApp(App)

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
