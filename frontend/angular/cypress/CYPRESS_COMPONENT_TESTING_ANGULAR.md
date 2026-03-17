# Cypress Component Testing for Angular

This document details how Cypress component testing has been implemented for the Angular weather application, highlighting the specific configurations and patterns that make Angular testing unique compared to other frameworks.

## Overview

Cypress Component Testing allows you to test UI components in isolation without needing to run your entire application. For Angular, there are specific considerations due to its framework architecture and the way it bootstraps components.

## Key Differences from Other Frameworks

### 1. Framework-Specific Dev Server Configuration

Unlike React (Next.js/Vite) or Vue, Angular requires special configuration in `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',    // Framework identifier
      bundler: 'webpack',     // Angular uses webpack for component testing
    },
    specPattern: '**/*.cy.ts',
    supportFile: 'cypress/support/component.ts',
  },
});
```

**Why this matters:**
- Cypress needs to know how to compile Angular components for component testing
- The devServer must be configured to use the appropriate framework bundler
- This differs from React (uses Vite/webpack) or Vue (uses Vite)

### 2. CRITICAL: The component-index.html File

**This is one of the most important and often overlooked configuration files for Angular Cypress component testing.**

The `cypress/support/component-index.html` file is essential for Angular component testing. If this file is not set up correctly, you may experience strange errors related to mounting issues and compatibility warnings between Angular and Cypress.

```html
<!-- cypress/support/component-index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cypress Component Testing</title>
  </head>
  <body>
    <div id="root" data-cy-root></div>
  </body>
</html>
```

**Why this file is critical:**

1. **Mounting Target**: The `<div id="root" data-cy-root></div>` element is where Angular components are mounted. Cypress looks for this specific element when mounting components.

2. **Compatibility Issues**: Without proper HTML setup, you may encounter:
   - "Cannot find root element" errors
   - Components not rendering
   - Zone.js compatibility warnings
   - Strange mounting failures that are hard to debug

3. **Angular Zone.js**: Angular uses zone.js for change detection. The component-index.html must be properly configured to work with zone.js in the testing environment.

**Common problems if not configured correctly:**
- Components mount but don't render
- "Zone.js has not been loaded" warnings
- "Cypress could not find element with data-cy-root" errors
- Inconsistent test results between runs

### 3. Custom Mount Command for Angular

Angular requires a specific mount command setup in `cypress/support/component.ts`:

```typescript
// cypress/support/component.ts
import './commands';

import { mount } from '@cypress/angular';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
```

**Why this setup is needed:**
- Uses `@cypress/angular` package (required for Angular component testing)
- The `mount` function from `@cypress/angular` handles:
  - Angular's component bootstrapping
  - Zone.js integration
  - Automatic cleanup between tests
  - Standalone component support (Angular 14+)
  - Module-based component support (older Angular)

### 4. Component Properties and Inputs

Angular components use `@Input()` properties, which are passed differently than React props:

```typescript
// cypress/components/CitySearch.cy.ts
import { CitySearchComponent } from '../../src/app/components/city-search.component';

describe('CitySearchComponent', () => {
  it('renders input and button', () => {
    cy.mount(CitySearchComponent, {
      componentProperties: {
        loading: false
      }
    });
    
    cy.get('[data-cy="city-input"]').should('be.visible');
    cy.get('[data-cy="search-button"]').should('be.visible');
  });

  it('disables button when loading', () => {
    cy.mount(CitySearchComponent, {
      componentProperties: {
        loading: true
      }
    });
    
    cy.get('[data-cy="search-button"]').should('be.disabled');
  });
});

### 8. Integration Testing: Testing the Full App

For integration testing that mimics end-to-end behavior, you can mount the main App component and use `cy.intercept` to mock API calls:

```typescript
// cypress/components/WeatherApp.cy.ts
import { App } from '../../src/app/app.component';

const mockCurrentWeather = {
  city: 'London',
  country: 'GB',
  temperature: 15,
  condition: 'Clouds',
  humidity: 75,
  wind_speed: 5.5,
  feels_like: 14,
  icon: '02d',
};

const mockForecast = {
  city: 'London',
  country: 'GB',
  forecast: [
    { date: '2024-03-17', temp_max: 18, temp_min: 10, condition: 'Clear', icon: '01d', precipitation: 10 },
    { date: '2024-03-18', temp_max: 16, temp_min: 8, condition: 'Clouds', icon: '02d', precipitation: 20 },
  ],
};

describe('Weather App', () => {
  beforeEach(() => {
    // Intercept all weather API calls
    cy.intercept('GET', '**/current?city=*', {
      statusCode: 200,
      body: mockCurrentWeather,
    }).as('getCurrentWeather');
    
    cy.intercept('GET', '**/forecast?city=*', {
      statusCode: 200,
      body: mockForecast,
    }).as('getForecast');
    
    cy.intercept('GET', '**/history?city=*', {
      statusCode: 200,
      body: { city: 'London', country: 'GB', history: [] },
    }).as('getHistory');
    
    // Mount the entire app
    cy.mount(App);
  });

  it('renders the app title', () => {
    cy.get('[data-cy="app-title"]').should('contain', 'Weather App');
  });

  it('fetches and displays weather data when searching for a city', () => {
    cy.get('[data-cy="city-input"]').type('London');
    cy.get('[data-cy="city-suggestion-0"]').click();
    
    // Wait for API calls to complete
    cy.wait('@getCurrentWeather');
    cy.wait('@getForecast');
    cy.wait('@getHistory');
    
    // Verify data is displayed
    cy.get('[data-cy="weather-city"]').should('contain', 'London, GB');
    cy.get('[data-cy="weather-temp"]').should('contain', '15°C');
  });
});
```

**Key differences from component tests:**
- Mount the main `App` component instead of individual components
- Use `cy.intercept` to mock all API calls the app makes
- Test the full integration flow (search -> API call -> display)
- Use `cy.wait()` to wait for intercepted requests to complete

**Note:** The URL pattern in `cy.intercept` should match your actual API endpoint structure. In this Angular app, the API calls are made to `/current`, `/forecast`, and `/history` paths.

When testing components that fetch data, intercept API calls:

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
  
  cy.mount(CurrentWeatherComponent, {
    componentProperties: {
      isLoading: false
    }
  });
});
```

**Note:**
- The `**` wildcard is important because the full URL depends on the proxy/server setup
- This is the same approach used in React (Next.js), Vue, or Svelte

### 9. Loading and Error States

Test different component states:

```typescript
it('renders loading state', () => {
  cy.mount(CurrentWeatherComponent, {
    componentProperties: {
      weather: null,
      isLoading: true
    }
  });
  
  cy.get('[data-cy="loading-spinner"]').should('be.visible');
});

it('renders error state', () => {
  cy.mount(CurrentWeatherComponent, {
    componentProperties: {
      weather: null,
      isLoading: false,
      error: 'Failed to fetch weather data'
    }
  });
  
  cy.get('[data-cy="error-message"]').should('contain', 'Failed to fetch');
});
```

### 10. data-cy Attributes for Test Selectors

We use `data-cy` attributes for reliable test selectors - this is a best practice across all frameworks:

```typescript
// In the Angular component template
<input data-cy="city-input" ... />
<button data-cy="search-button" ... />
<ul data-cy="city-suggestions">
  <li data-cy="city-suggestion-0">...</li>
</ul>

// In Cypress tests
cy.get('[data-cy="city-input"]').type('London');
cy.get('[data-cy="city-suggestion-0"]').click();
```

## Comparison: Angular vs Other Frameworks

| Aspect | Angular | Next.js (React) | Vue | Svelte |
|--------|---------|-----------------|-----|--------|
| Framework config | `framework: 'angular'` | `framework: 'next'` | `framework: 'vue'` | `framework: 'svelte'` |
| Bundler | webpack | webpack | vite | vite |
| Mount command | Via `@cypress/angular` | Via `@cypress/react` | Via `@cypress/vue` | Via `@cypress/svelte` |
| Props/input | `componentProperties` | Direct props | Direct props | Direct props |
| Events/outputs | `outputs` config | Direct functions | Direct functions | Direct functions |
| Special HTML file | Required (`component-index.html`) | Optional | Optional | Optional |
| Zone.js | Required | N/A | N/A | N/A |

## Test File Structure

```
frontend/angular/cypress/
├── components/                    # Component test files
│   ├── CitySearch.cy.ts          # Individual component tests
│   ├── CurrentWeather.cy.ts
│   ├── ForecastList.cy.ts
│   ├── HistoryList.cy.ts
│   └── WeatherBackground.cy.ts
├── support/
│   ├── component.ts              # Custom mount command
│   ├── component-index.html      # CRITICAL: Mount target HTML
│   └── commands.ts               # Custom commands
└── screenshots/                  # Test failure screenshots
```

## Running Tests

```bash
# Open interactive test runner (component mode)
npm run cypress:open

# Run all component tests in headless mode
npm run cypress:run

# Run specific component tests
npm run cypress:run -- --spec "cypress/components/CitySearch.cy.ts"
```

**Note:** The `--component` flag is required to run component tests (not e2e tests). This is configured in the npm scripts.

## Key Takeaways

1. **CRITICAL: component-index.html**: This file must exist and contain `<div id="root" data-cy-root></div>`. Without it, you'll experience strange mounting errors and compatibility warnings.

2. **Angular-specific config**: The `cypress.config.ts` must specify `framework: 'angular'` and `bundler: 'webpack'`

3. **Use @cypress/angular**: The mount command must come from `@cypress/angular`, not from other framework packages.

4. **Standalone components**: Angular 14+ standalone components are supported automatically.

5. **componentProperties**: Pass inputs using the `componentProperties` object in the mount options.

6. **outputs**: Handle emitted events using the `outputs` configuration.

7. **Zone.js**: Be aware of zone.js when mocking global objects like `Date`.

8. **Same testing principles**: Despite framework differences, the core testing concepts (selectors, assertions, interactions) remain consistent across frameworks.

9. **API mocking**: Use `cy.intercept()` to mock backend calls - this is the same approach used across all frameworks.

## Troubleshooting

### Common Issues

**"Cannot find element with data-cy-root"**
- Ensure `cypress/support/component-index.html` exists and contains the root element
- Check that `supportFile` in cypress.config.ts points to the correct file

**"Zone.js has not been loaded"**
- This is usually handled automatically by `@cypress/angular`
- Ensure you're using the correct mount function from `@cypress/angular`

**Components not rendering**
- Verify the component-index.html is set up correctly
- Check that the component is properly exported from its module or as standalone
- Ensure imports (like CommonModule) are included in the component

**Inconsistent test results**
- Check for zone.js interference with global mocks
- Ensure proper cleanup between tests (handled automatically by Cypress)
- Verify component inputs are set correctly in `componentProperties`
