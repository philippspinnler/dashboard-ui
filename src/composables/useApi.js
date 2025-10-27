import { ref } from 'vue'
import axios from 'axios'

const baseURL = window.ENV?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://api.dashboard.monphi.ch'
const useMockData = window.ENV?.VITE_USE_MOCK_DATA === 'true' || import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Dynamically import mock data only if enabled and available (development only)
let getMockData = null
if (useMockData) {
  try {
    const mockModule = await import('../mocks/index.js')
    getMockData = mockModule.getMockData
    console.log('[MOCK MODE] Mock data system enabled')
  } catch (err) {
    console.warn('[MOCK MODE] Mock data files not found - falling back to real API')
  }
}

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
      // Use mock data if enabled
      if (useMockData) {
        console.log(`[MOCK MODE] Fetching mock data for: ${url}`)
        
        // Simulate network delay for more realistic behavior
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const mockResponse = getMockData(url)
        if (mockResponse) {
          return mockResponse
        } else {
          console.warn(`[MOCK MODE] No mock data found for: ${url}`)
          return null
        }
      }
      
      // Otherwise, make real API call
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
    baseURL,
    useMockData
  }
}
