<template>
  <div class="inverter-container">
    <h1 class="title">Inverter</h1>
    
    <div class="energy-flow">
      <!-- Solar PV Section -->
      <div class="energy-node pv-node">
        <div class="icon-wrapper">
          <SunLight class="node-icon pv-icon" />
        </div>
        <div class="node-label">Solar</div>
        <div class="node-value">{{ pvPowerFormatted }}</div>
      </div>

      <!-- Flow Container -->
      <div class="flow-container">
        <!-- Middle Section: Battery and Home -->
        <div class="center-nodes">
          <!-- Battery -->
          <div class="energy-node battery-node">
            <div class="icon-wrapper">
              <component :is="getBatteryIcon" class="node-icon battery-icon" :class="getBatteryClass()" />
            </div>
            <div class="battery-level">
              <div class="battery-fill" :style="{ width: batterySOC + '%' }"></div>
            </div>
            <div class="node-label">Battery</div>
            <div class="node-value">{{ batterySOCFormatted }}%</div>
          </div>

          <!-- Home/Consumption -->
          <div class="energy-node home-node">
            <div class="icon-wrapper">
              <Home class="node-icon home-icon" />
            </div>
            <div class="node-label">Home</div>
            <div class="node-value">{{ powerConsumptionFormatted }}</div>
          </div>
        </div>
      </div>

      <!-- Grid Section -->
      <div class="energy-node grid-node">
        <div class="icon-wrapper">
          <Cloud class="node-icon grid-icon" />
        </div>
        <div class="node-label">Grid</div>
        <div class="grid-values">
          <div class="node-value consumption">
            ↓ {{ gridConsumptionFormatted }}
          </div>
          <div class="node-value feedin">
            ↑ {{ gridFeedinFormatted }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'
import SunLight from 'iconoir-vue/regular/SunLight'
import BatteryEmpty from 'iconoir-vue/regular/BatteryEmpty'
import Battery25 from 'iconoir-vue/regular/Battery25'
import Battery50 from 'iconoir-vue/regular/Battery50'
import Battery75 from 'iconoir-vue/regular/Battery75'
import BatteryFull from 'iconoir-vue/regular/BatteryFull'
import Home from 'iconoir-vue/regular/Home'
import Cloud from 'iconoir-vue/regular/Cloud'

const { get } = useApi()

const pvPower = ref(0)
const gridConsumption = ref(0)
const gridFeedin = ref(0)
const powerConsumption = ref(0)
const batterySOC = ref(0)

// Format power values: show kW with 1 decimal if >= 1000W, otherwise W with no decimals
const formatPower = (watts) => {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(1)} kW`
  }
  return `${Math.round(watts)} W`
}

const pvPowerFormatted = computed(() => formatPower(pvPower.value))
const gridConsumptionFormatted = computed(() => formatPower(gridConsumption.value))
const gridFeedinFormatted = computed(() => formatPower(gridFeedin.value))
const powerConsumptionFormatted = computed(() => formatPower(powerConsumption.value))
const batterySOCFormatted = computed(() => Math.round(batterySOC.value))

const getBatteryIcon = computed(() => {
  if (batterySOC.value > 80) return BatteryFull
  if (batterySOC.value > 60) return Battery75
  if (batterySOC.value > 40) return Battery50
  if (batterySOC.value > 20) return Battery25
  return BatteryEmpty
})

const getBatteryClass = () => {
  if (batterySOC.value > 80) return 'battery-full'
  if (batterySOC.value > 50) return 'battery-good'
  if (batterySOC.value > 20) return 'battery-medium'
  return 'battery-low'
}

const fetchInverter = async () => {
  const data = await get('/inverter')
  if (data) {
    pvPower.value = parseFloat(data.pv_power) || 0
    gridConsumption.value = parseFloat(data.grid_consumption) || 0
    gridFeedin.value = parseFloat(data.grid_feedin) || 0
    powerConsumption.value = parseFloat(data.power_consumption) || 0
    batterySOC.value = parseFloat(data.battery_state_of_charge) || 0
  }
}

// Poll every 10 seconds for real-time updates
usePolling(fetchInverter, 10000)
</script>

<style scoped>

.inverter-container {
  display: flex;
  flex-direction: column;
}

.energy-flow {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1rem;
}

.energy-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  min-width: 100px;
}

/* Align all icon wrappers at the same height */
.energy-node .icon-wrapper {
  margin-top: 0;
}

.icon-wrapper {
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.node-icon {
  width: 2rem;
  height: 2rem;
}

.pv-icon {
  color: #fbbf24;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
}

.battery-icon {
  color: #60a5fa;
}

.battery-icon.battery-full {
  color: #22c55e;
  filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
}

.battery-icon.battery-good {
  color: #84cc16;
}

.battery-icon.battery-medium {
  color: #eab308;
}

.battery-icon.battery-low {
  color: #ef4444;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
}

.home-icon {
  color: #f97316;
  filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.6));
}

.grid-icon {
  color: #8b5cf6;
}

.node-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.node-value {
  font-size: 1.3rem;
  font-weight: 500;
  color: white;
}

.node-value.consumption {
  color: #ef4444;
}

.node-value.feedin {
  color: #22c55e;
}

.node-value.neutral {
  color: rgba(255, 255, 255, 0.5);
}

.battery-level {
  width: 60px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0.3rem 0;
}

.battery-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #84cc16);
  transition: width 0.5s ease;
  border-radius: 4px;
}

.flow-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 0 1 auto;
  justify-content: flex-start;
}

.center-nodes {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: flex-start;
}

.grid-values {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .energy-flow {
    flex-direction: column;
    gap: 2rem;
  }
  
  .flow-container {
    width: 100%;
  }
  
  .center-nodes {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
  }
}
</style>
