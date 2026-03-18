# Cypress Component Testing with Svelte

This document outlines how Cypress component testing is configured and used in the Svelte weather application.

## Overview

The Svelte implementation uses:
- **Svelte 5** with the new runes syntax (`$state`, `$props`, `$derived`, `$effect`)
- **Vite** as the build tool and dev server
- **Cypress 15** with `@cypress/svelte` adapter for component testing
- **TypeScript** for type safety

## Project Structure

```
frontend/svelte/
├── cypress/
│   ├── components/          # Cypress component tests
│   │   ├── CitySearch.cy.js
│   │   ├── CurrentWeather.cy.js
│   │   ├── ForecastList.cy.js
│   │   ├── HistoryList.cy.js
│   │   ├── WeatherBackground.cy.js
│   │   └── WeatherApp.cy.js
│   └── support/
│       └── component.ts     # Cypress component support
├── src/
│   ├── lib/
│   │   ├── components/      # Svelte components
│   │   │   ├── CitySearch.svelte
│   │   │   ├── CurrentWeather.svelte
│   │   │   ├── ForecastList.svelte
│   │   │   ├── HistoryList.svelte
│   │   │   └── WeatherBackground.svelte
│   │   ├── data/
│   │   │   └── capitals.ts  # City data
│   │   ├── services/
│   │   │   └── weatherApi.ts # API service
│   │   └── types/
│   │       └── weather.ts    # TypeScript types
│   ├── App.svelte           # Main app component
│   ├── app.css              # Global styles
│   └── main.ts              # Entry point
├── cypress.config.ts        # Cypress configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── svelte.config.js
```

## Cypress Configuration

The `cypress.config.ts` is configured for component testing:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
  },
});
```

## Running Tests

### Open Cypress UI

```bash
cd frontend/svelte
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

## Key Differences from React

1. **Svelte 5 Runes**: Uses `$state`, `$props`, `$derived`, and `$effect` instead of React hooks
2. **Component Mounting**: Uses Svelte component constructor syntax: `new Component({ props: {...} })`
3. **No JSX**: Svelte uses its own template syntax
4. **Event Handling**: Uses `onclick`, `oninput` attributes instead of React's `onClick`, `onChange`

## Mocking API Responses

To test components that depend on API calls, you can use Cypress intercept:

```javascript
cy.intercept('GET', '**/api/weather/current*', {
  statusCode: 200,
  body: { ...mockData }
}).as('getWeather');
```

## Best Practices

1. Use `data-cy` attributes for test selectors
2. Test all states: loading, error, empty, and with data
3. Test user interactions (clicks, typing, keyboard navigation)
4. Use stubs for callback props like `onSearch`
5. Test component behavior in isolation from the full app