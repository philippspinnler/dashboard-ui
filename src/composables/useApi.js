import { ref } from 'vue'
import axios from 'axios'

const baseURL = window.ENV?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://api.dashboard.monphi.ch'

const api = axios.create({
  baseURL,
  timeout: 30000
})

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const get = async (url, config = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(url, config)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error(`API Error (${url}):`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    get,
    loading,
    error,
    baseURL
  }
}
