<template>
  <div>
    <div v-for="day in days" :key="day.day">
      <div class="date-container">
        <div class="day">
          <h1 class="title">{{ day.day }}</h1>
        </div>
        <div class="date subtitle">{{ day.date }}</div>
      </div>
      <div class="event-container" v-for="event in day.events" :key="event.summary || event.birthday?.name">
        <div class="event-birthday" v-if="event.birthday">
          <div>
            <h2>
              <font-awesome-icon icon="gift" /> {{ event.birthday.name }}
            </h2>
          </div>
          <div>{{ event.birthday.age }}</div>
        </div>
        <div 
          class="event" 
          v-if="!event.birthday" 
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
import { ref } from 'vue'
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

.event {
  background-color: rgb(255, 255, 255, 0.2);
  padding: 1.1rem;
  border-radius: 0.66rem;
}

.event-birthday {
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
