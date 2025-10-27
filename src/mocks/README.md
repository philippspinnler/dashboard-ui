# Mock Data System

This directory contains mock data for local development, allowing you to run the dashboard without a backend API connection.

## Quick Start

1. **Enable Mock Mode**: Set `VITE_USE_MOCK_DATA=true` in your `.env` file
2. **Run the app**: `npm run dev`
3. **Done!** The dashboard will now use mock data instead of making real API calls

## Switching Between Mock and Real Data

### Using Mock Data (Local Development)
```bash
# In your .env file
VITE_USE_MOCK_DATA=true
```

### Using Real API (Production)
```bash
# In your .env file
VITE_USE_MOCK_DATA=false
```

You can toggle this setting anytime and restart the dev server.

## File Structure

```
src/mocks/
├── index.js                  # Mock data registry and helper functions
├── weather.js                # Weather widget mock data
├── calendar.js               # Calendar widget mock data
├── sonos.js                  # Sonos widget mock data
├── presence.js               # Presence widget mock data
├── netatmo.js                # Netatmo sensor mock data
├── publicTransportation.js   # Public transport mock data
├── internet.js               # Internet speed test mock data
├── eoGuide.js                # EO-Guide app stats mock data
├── cars.js                   # Cars/EV charging mock data
├── album.js                  # Background images mock data
└── README.md                 # This file
```

## Customizing Mock Data

Each mock data file exports a JavaScript object that matches the API response structure. Simply edit the files to customize the data:

### Example: Editing Weather Data

```javascript
// src/mocks/weather.js
export default {
  current: {
    temperature: 22.5,  // Change temperature here
    temperatureFeelsLike: 21.0,
    weather: [
      {
        icon: '01d',  // Change weather icon
        description: 'Clear Sky',
        main: 'Clear'
      }
    ]
  },
  daily: [
    // Add/remove forecast days
  ]
}
```

### Example: Adding Calendar Events

```javascript
// src/mocks/calendar.js
export default [
  {
    day: 'Mo',
    date: '27. Oktober',
    events: [
      {
        start_time: '10:00',
        summary: 'My New Event',  // Add your event here
        color: '3788d8',
        all_day: false
      }
    ]
  }
]
```

## Adding New API Endpoints

If you add a new widget that calls a new API endpoint:

1. **Create a new mock file**: `src/mocks/myNewEndpoint.js`
   ```javascript
   export default {
     // Your mock data structure
   }
   ```

2. **Register it in index.js**: Add the import and endpoint mapping
   ```javascript
   import myNewEndpoint from './myNewEndpoint.js'
   
   export const mockData = {
     // ... existing endpoints
     '/my-new-endpoint': myNewEndpoint
   }
   ```

3. **Done!** The mock data will automatically be used when `VITE_USE_MOCK_DATA=true`

## Features

- ✅ **Zero widget changes**: Widgets use the same API calls
- ✅ **Realistic simulation**: Includes 300ms network delay
- ✅ **Console logging**: See which endpoints are being mocked
- ✅ **Easy maintenance**: Simple JavaScript files
- ✅ **Hot reload**: Changes to mock data are reflected immediately
- ✅ **Offline development**: No internet connection needed

## Tips

- **Development workflow**: Keep mock mode enabled during UI development
- **Testing**: Switch to real API occasionally to verify integration
- **Realistic data**: Keep mock data realistic to catch UI edge cases
- **Multiple scenarios**: Create different mock data files for various test scenarios

## How It Works

1. The `useApi.js` composable checks the `VITE_USE_MOCK_DATA` environment variable
2. When enabled, it intercepts API calls and returns mock data from `src/mocks/`
3. A small delay is added to simulate network latency
4. Console logs show which endpoints are being mocked

## Troubleshooting

**Mock data not loading?**
- Verify `VITE_USE_MOCK_DATA=true` is in your `.env` file
- Restart the dev server after changing `.env`
- Check browser console for `[MOCK MODE]` logs

**Missing data for an endpoint?**
- Check if the endpoint is registered in `src/mocks/index.js`
- Verify the mock data file exports a default object
- Look for warnings in the console: `No mock data found for: /endpoint`
