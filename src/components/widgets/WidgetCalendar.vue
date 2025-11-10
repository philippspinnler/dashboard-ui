<template>
  <div>
    <div v-for="day in filteredDays" :key="day.day">
      <div class="date-container">
        <div class="day">
          <h1 class="title">{{ day.day }}</h1>
        </div>
        <div class="date subtitle">{{ day.date }}</div>
      </div>
      <div class="event-container" v-for="event in day.events" :key="event.summary">
        <div class="event-special" v-if="event.special_event">
          <div>
            <h2>
              <font-awesome-icon :icon="event.special_event.type === 'birthday' ? 'gift' : 'children'" /> 
              {{ event.special_event.name }}
            </h2>
          </div>
          <div>{{ event.special_event.years }}</div>
        </div>
        <div 
          class="event" 
          v-if="!event.special_event" 
          :style="{ borderLeft: `solid #${event.color} 0.22rem` }"
        >
          <div v-if="event.all_day" class="event-all-day">
            <span>Den ganzen Tag</span>
          </div>
          <h2 v-if="!event.all_day">{{ event.start_time }}</h2>
          {{ event.summary }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const days = ref([])

const fetchCalendar = async () => {
  const data = await get('/calendar')
  if (data) {
    days.value = data
  }
}

usePolling(fetchCalendar, 900000)

const filteredDays = computed(() => {
  const MAX_SCORE = 11
  const SCORE_DAY = 0.8
  const SCORE_SPECIAL_EVENT = 0.8
  const SCORE_EVENT = 1.0
  
  let totalScore = 0
  const result = []
  
  for (const day of days.value) {
    // Check if we can add the day header
    if (totalScore + SCORE_DAY > MAX_SCORE) {
      break
    }
    
    totalScore += SCORE_DAY
    const dayData = {
      day: day.day,
      date: day.date,
      events: []
    }
    
    // Add events for this day
    for (const event of day.events) {
      const eventScore = event.special_event ? SCORE_SPECIAL_EVENT : SCORE_EVENT
      
      if (totalScore + eventScore > MAX_SCORE) {
        // Can't add this event - check if we should remove the day
        if (dayData.events.length === 0) {
          // Day header was added but no events fit - remove the day
          totalScore -= SCORE_DAY
        } else {
          // Some events were added, keep the day
          result.push(dayData)
        }
        return result
      }
      
      totalScore += eventScore
      dayData.events.push(event)
    }
    
    // All events for this day were added
    result.push(dayData)
  }
  
  return result
})
</script>

<style scoped>
.date-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.date-container .date {
  margin-bottom: 0.22rem;
}

.event-container {
  margin-bottom: 0.66rem;
}

.event-container:last-child {
  margin-bottom: 2.2rem;
}

div:last-child > .event-container:last-child {
  margin-bottom: 0;
}

.event {
  background-color: rgb(255, 255, 255, 0.2);
  padding: 1.1rem;
  border-radius: 0.66rem;
}

.event-special {
  background-color: rgb(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  padding: 1.1rem;
  align-items: center;
  border-radius: 0.66rem;
}

.event-all-day {
  margin-bottom: 0.44rem;
}

.event-all-day span {
  background-color: rgb(255, 255, 255, 0.7);
  padding: 0.22rem;
  border-radius: 0.33rem;
  color: rgb(50, 50, 50);
}
</style>
