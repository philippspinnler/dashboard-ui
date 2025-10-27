import weather from './weather.js'
import calendar from './calendar.js'
import sonos from './sonos.js'
import presence from './presence.js'
import netatmo from './netatmo.js'
import publicTransportation from './publicTransportation.js'
import internet from './internet.js'
import eoGuide from './eoGuide.js'
import cars from './cars.js'
import album from './album.js'

// Mock data registry - maps API endpoints to mock data
export const mockData = {
  '/weather': weather,
  '/calendar': calendar,
  '/sonos': sonos,
  '/presence': presence,
  '/netatmo': netatmo,
  '/public-transportation': publicTransportation,
  '/speedtest': internet,
  '/eo-guide': eoGuide,
  '/cars': cars,
  '/album': album
}

// Helper function to get mock data for an endpoint
export function getMockData(url) {
  // Extract the path without query parameters
  const path = url.split('?')[0]
  return mockData[path] || null
}
