#!/bin/sh
set -e

# Replace placeholders in config.js with actual environment variables
envsubst '${VITE_API_BASE_URL} ${VITE_WIDGETS_TOP_LEFT} ${VITE_WIDGETS_TOP_RIGHT} ${VITE_WIDGETS_LEFT} ${VITE_WIDGETS_RIGHT} ${VITE_WIDGETS_BOTTOM} ${VITE_ENABLE_GLASSMORPHISM}' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp
mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g "daemon off;"
