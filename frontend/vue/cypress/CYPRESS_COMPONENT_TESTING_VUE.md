# Cypress Component Testing with Vue

This document outlines how Cypress component testing is configured and used in the Vue weather application.

## Overview

The Vue implementation uses:
- **Vue 3** with Composition API (`<script setup>`)
- **Vite** as the build tool and dev server
- **Cypress 15** with `@cypress/vue` adapter for component testing
- **TypeScript** for type safety

## Project Structure

```
frontend/vue/
├── cypress/
│   ├── components/          # Cypress component tests
│   │   ├── CitySearch.cy.ts
│   │   ├── CurrentWeather.cy.ts
│   │   ├── ForecastList.cy.ts
│   │   ├── HistoryList.cy.ts
│   │   ├── WeatherBackground.cy.ts
│   │   └── WeatherApp.cy.ts
│   └── support/
│       ├── component.ts     # Cypress component support
│       └── component-index.html
├── src/
│   ├── components/         # Vue components
│   │   ├── CitySearch.vue
│   │   ├── CurrentWeather.vue
│   │   ├── ForecastList.vue
│   │   ├── HistoryList.vue
│   │   └── WeatherBackground.vue
│   ├── data/
│   │   └── capitals.ts    # City data
│   ├── services/
│   │   └── weatherApi.ts    # API service
│   ├── types/
│   │   └── weather.ts      # TypeScript types
│   ├── App.vue             # Main app component
│   ├── main.ts             # Entry point
│   └── style.css           # Global styles
├── cypress.config.ts       # Cypress configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Cypress Configuration

The `cypress.config.ts` is configured for component testing:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
```

## Running Tests

### Open Cypress UI

```bash
cd frontend/vue
npm install
npm run cypress:open
```

### Run Tests in Headless Mode

```bash
npm run cypress:run
```

## Component Tests

### CitySearch Component

Tests for the city search component include:
- Rendering input and button
- Showing suggestions when typing
- Calling onSearch when selecting a suggestion
- Submitting form with typed city
- Disabling button when loading
- Disabling button when input is empty
- Navigating suggestions with keyboard

### CurrentWeather Component

Tests include:
- Loading state
- Error state
- Empty state
- Displaying weather data correctly

### ForecastList Component

Tests include:
- Loading state
- Error state
- Empty state
- Displaying forecast data correctly
- Displaying all 5 days of forecast

### HistoryList Component

Tests include:
- Loading state
- Error state
- Empty state
- Displaying history data correctly

### WeatherBackground Component

Tests include:
- Default background when no weather
- Different backgrounds for different weather conditions (sunny, cloudy, rainy, stormy, snowy, foggy)

### WeatherApp Integration

Tests include:
- Rendering app title
- Rendering search section
- Rendering weather content section
- Showing empty states initially
- Showing suggestions when typing
- Fetching and displaying weather data with cy.intercept
- Testing autocomplete selection
- Testing typed city + enter
- Testing forecast and history display

## Key Differences from Other Frameworks

1. **Vue Composition API**: Uses `<script setup>` with `ref`, `computed`, and lifecycle hooks
2. **Component Mounting**: Uses Vue's mount syntax with props
3. **Template Syntax**: Uses Vue's template syntax with `v-if`, `v-for`, `:bind`, `@event`
4. **CSS Scoping**: Vue components have scoped CSS by default

## API Mocking

To test components that depend on API calls, use Cypress intercept:

```typescript
beforeEach(() => {
  cy.intercept('GET', '**/api/weather/current?city=*', {
    statusCode: 200,
    body: mockCurrentWeather,
  }).as('getCurrentWeather');
  
  cy.intercept('GET', '**/api/weather/forecast?city=*', {
    statusCode: 200,
    body: mockForecast,
  }).as('getForecast');
  
  cy.intercept('GET', '**/api/weather/history?city=*', {
    statusCode: 200,
    body: mockHistory,
  }).as('getHistory');
  
  cy.mount(App);
});
```

## Best Practices

1. Use `data-cy` attributes for test selectors
2. Test all states: loading, error, empty, and with data
3. Test user interactions (clicks, typing, keyboard navigation)
4. Use stubs for callback props like `onSearch`
5. Test component behavior in isolation from the full app
6. Use `cy.intercept()` to mock API responses for integration tests