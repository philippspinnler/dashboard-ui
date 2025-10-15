# Dashboard UI

A modern Vue 3 dashboard application built with Vite, featuring multiple widgets for displaying various information including calendar, weather, Sonos playback, presence detection, and more.

## Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next-generation frontend build tool
- **FontAwesome 6** - Icon library
- **Axios** - HTTP client for API requests
- **DayJS** - Date/time manipulation library
- **ESLint & Prettier** - Code quality and formatting

## Project Structure

```
dakboard-ui/
├── src/
│   ├── components/          # Vue components
│   │   └── widgets/         # Dashboard widgets
│   ├── composables/         # Reusable composition functions
│   │   ├── useApi.js        # API utilities
│   │   └── usePolling.js    # Polling helper
│   ├── styles/              # Global styles
│   │   └── main.css
│   ├── utils/               # Utility functions
│   │   └── datetime.js      # DayJS configuration
│   ├── App.vue              # Main app component
│   └── main.js              # Entry point
├── public/                  # Static assets
├── .env                     # Environment variables (local)
├── .env.example             # Environment variables template
├── Dockerfile               # Docker configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Update the `API_BASE_URL` in `.env` to point to your backend API

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Docker Deployment

Build the Docker image:

```bash
docker build -t dakboard-ui .
```

Run the container:

```bash
docker run -p 80:80 dakboard-ui
```

## Available Widgets

- **Clock** - Current time and date
- **Calendar** - Upcoming events and birthdays
- **Weather** - Current weather and 4-day forecast
- **Sonos** - Currently playing music
- **Presence** - Who's home
- **Netatmo** - Indoor/outdoor temperature and CO2
- **Public Transportation** - Next departure times
- **Internet** - Speed test results
- **EO-Guide** - App statistics

## Code Quality

Run ESLint:

```bash
npm run lint
```

Format code with Prettier:

```bash
npm run format
```

## Environment Variables

- `API_BASE_URL` - Base URL for the backend API (default: https://api.dashboard.monphi.ch)

## License

Private project
