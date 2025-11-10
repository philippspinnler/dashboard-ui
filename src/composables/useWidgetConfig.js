export function useWidgetConfig() {
  // Get environment variable with fallback: runtime config (Docker) -> build-time config (local dev)
  const getEnvValue = (key) => {
    // Try runtime config first (window.ENV from config.js)
    if (window.ENV && window.ENV[key] && 
        !window.ENV[key].startsWith('__') && 
        !window.ENV[key].startsWith('${')) {
      return window.ENV[key]
    }
    // Fall back to build-time config (import.meta.env from .env)
    return import.meta.env[key] || ''
  }

  // Parse comma-separated environment variables into arrays
  const parseWidgets = (envValue) => {
    if (!envValue || envValue.trim() === '') {
      return []
    }
    return envValue.split(',').map(w => w.trim()).filter(w => w !== '')
  }

  // Get widget configurations from environment variables
  const topLeftWidgets = parseWidgets(getEnvValue('VITE_WIDGETS_TOP_LEFT'))
  const topRightWidgets = parseWidgets(getEnvValue('VITE_WIDGETS_TOP_RIGHT'))
  const leftWidgets = parseWidgets(getEnvValue('VITE_WIDGETS_LEFT'))
  const rightWidgets = parseWidgets(getEnvValue('VITE_WIDGETS_RIGHT'))
  const bottomWidgets = parseWidgets(getEnvValue('VITE_WIDGETS_BOTTOM'))

  return {
    topLeftWidgets,
    topRightWidgets,
    leftWidgets,
    rightWidgets,
    bottomWidgets
  }
}
