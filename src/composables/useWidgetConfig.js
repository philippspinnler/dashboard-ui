export function useWidgetConfig() {
  // Parse comma-separated environment variables into arrays
  const parseWidgets = (envValue) => {
    if (!envValue || envValue.trim() === '') {
      return []
    }
    return envValue.split(',').map(w => w.trim()).filter(w => w !== '')
  }

  // Get widget configurations from environment variables
  const leftWidgets = parseWidgets(import.meta.env.VITE_WIDGETS_LEFT)
  const rightWidgets = parseWidgets(import.meta.env.VITE_WIDGETS_RIGHT)
  const bottomWidgets = parseWidgets(import.meta.env.VITE_WIDGETS_BOTTOM)

  return {
    leftWidgets,
    rightWidgets,
    bottomWidgets
  }
}
