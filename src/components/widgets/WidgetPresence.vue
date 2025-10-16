<template>
  <div>
    <h1 class="title">Anwesend</h1>
    <div v-if="persons" class="presence-container">
      <div v-for="person in persons" :key="person.name" class="presence-person">
        <h2 :class="{ muted: person.state === 'not_home' }">{{ person.name }}</h2>
        <img
          v-if="person.avatar_url"
          :src="person.avatar_url"
          class="presence-avatar"
          :class="{ muted: person.state === 'not_home' }"
          :alt="person.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { usePolling } from '../../composables/usePolling'

const { get } = useApi()
const persons = ref([])

const fetchPresence = async () => {
  const data = await get('/presence')
  if (data && data.persons) {
    persons.value = data.persons
  }
}

usePolling(fetchPresence, 120000)
</script>

<style scoped>
.presence-person {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 1.1rem;
  margin-bottom: 0.53rem;
}

.presence-person h2 {
  margin: 0;
}

.presence-avatar {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.presence-person:last-child {
  margin-bottom: 0;
}

.muted {
  opacity: 0.5;
  filter: grayscale(80%);
  transition: opacity 0.3s, filter 0.3s;
}
</style>
