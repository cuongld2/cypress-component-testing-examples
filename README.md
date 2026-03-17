# Weather App with Cypress Component Testing

This project showcases the implementation of Cypress component testing for different frontend frameworks/libraries, featuring a weather application with a Go backend and multiple frontend implementations.

## Project Aim

The primary goal is to demonstrate how to set up and write Cypress component tests for various frontend frameworks:
- React
- Angular
- Next.js
- Vue
- Svelte

Each frontend framework implementation includes comprehensive component tests that verify the UI behaves correctly in isolation.

## Current Status

### Implemented

**Backend (Go)**
- Weather API service built with Go
- Endpoints for current weather, forecast, and historical data
- Compiled binary available at `backend/weather-api`

**Frontend: Next.js**
- Weather application using Next.js 16 with React 19
- Components: CitySearch, CurrentWeather, ForecastList, HistoryList, WeatherBackground
- Cypress component testing configured and implemented
- Test coverage includes:
  - Individual component testing (CitySearch, CurrentWeather, ForecastList, HistoryList, WeatherBackground)
  - Integration testing (WeatherApp - full page tests)
  - Mock API responses using Cypress intercept
  - Loading, error, and empty states
  - User interactions (search, autocomplete, keyboard navigation)

### In Progress

- Additional frontend framework implementations (Angular, Vue, Svelte)
- More comprehensive test scenarios

## Project Structure

```
.
├── AGENT.md                    # Agent instructions
├── backend/                    # Go backend
│   ├── main.go                 # API implementation
│   ├── go.mod
│   └── weather-api             # Compiled binary
└── frontend/
    └── nextjs/                 # Next.js frontend (Current)
        ├── cypress/            # Cypress component tests
        ├── src/
        │   ├── app/            # Next.js pages
        │   ├── components/     # React components
        │   ├── services/      # API services
        │   ├── data/          # Static data (cities)
        │   └── types/         # TypeScript types
        └── cypress.config.ts  # Cypress configuration
```

## Running the Project

### Backend

```bash
cd backend
./weather-api
# Server runs on http://localhost:8080
```

### Frontend (Next.js)

```bash
cd frontend/nextjs
npm install
npm run dev
# App runs on http://localhost:3000
```

### Cypress Component Tests

```bash
cd frontend/nextjs
npm run cypress:open    # Open Cypress UI
npm run cypress:run     # Run tests in headless mode
```

## Technologies Used

- **Backend**: Go
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Testing**: Cypress 15 with @cypress/react
- **Package Manager**: npm
