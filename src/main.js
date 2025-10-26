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
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudSunRain,
  faBolt,
  faSnowflake,
  faSmog,
  faGauge
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faGift,
  faChevronDown,
  faChevronUp,
  faStar,
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudSunRain,
  faBolt,
  faSnowflake,
  faSmog,
  faGauge
)

// Import global styles
import './styles/main.css'

const app = createApp(App)

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
