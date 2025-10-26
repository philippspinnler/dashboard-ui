// Runtime configuration - populated by docker-entrypoint.sh
window.ENV = {
  VITE_API_BASE_URL: '${VITE_API_BASE_URL}',
  VITE_WIDGETS_LEFT: '${VITE_WIDGETS_LEFT}',
  VITE_WIDGETS_RIGHT: '${VITE_WIDGETS_RIGHT}',
  VITE_WIDGETS_BOTTOM: '${VITE_WIDGETS_BOTTOM}'
}
