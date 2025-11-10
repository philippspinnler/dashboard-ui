<template>
  <div class="presence-container" v-if="persons">
    <div v-for="person in persons" :key="person.name" class="presence-person">
      <img
        v-if="person.avatar_url"
        :src="person.avatar_url"
        class="presence-avatar"
        :class="{ muted: person.state === 'not_home' }"
        :alt="person.name"
      />
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
.presence-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.1rem;
}

.presence-person {
  display: flex;
}

.presence-avatar {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.muted {
  opacity: 0.5;
  filter: grayscale(80%);
  transition: opacity 0.3s, filter 0.3s;
}
</style>
