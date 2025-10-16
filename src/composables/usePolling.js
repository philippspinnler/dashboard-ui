import { onMounted, onUnmounted } from 'vue'

export function usePolling(callback, interval = 30000) {
  let intervalId = null

  onMounted(() => {
    // Call immediately on mount
    callback()
    
    // Set up interval
    intervalId = setInterval(() => {
      callback()
    }, interval)
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }
}
