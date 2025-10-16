#!/bin/sh
set -e

# Replace placeholders in config.js with actual environment variables
envsubst '${VITE_WIDGETS_LEFT} ${VITE_WIDGETS_RIGHT} ${VITE_WIDGETS_BOTTOM}' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp
mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g "daemon off;"
