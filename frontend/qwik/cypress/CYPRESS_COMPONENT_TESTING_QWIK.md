# Cypress Component Testing for Qwik

This document details how Cypress component testing has been implemented for the Qwik weather application, highlighting the specific configurations and patterns unique to Qwik.

## Overview

Cypress Component Testing allows you to test UI components in isolation without needing to run your entire application. For Qwik, there are specific considerations due to its resumability and lazy-loading architecture.

## Project Structure

```
frontend/qwik/
├── cypress/
│   ├── components/                    # Cypress component tests
│   │   ├── CitySearch.cy.tsx
│   │   ├── CurrentWeather.cy.tsx
│   │   ├── ForecastList.cy.tsx
│   │   ├── HistoryList.cy.tsx
│   │   ├── WeatherBackground.cy.tsx
│   │   └── WeatherApp.cy.tsx
│   ├── support/
│   │   ├── component.ts              # Custom mount command
│   │   └── component-index.html      # HTML template for component testing
│   └── screenshots/                   # Test failure screenshots
├── src/
│   ├── components/                    # Qwik components
│   │   ├── CitySearch.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── ForecastList.tsx
│   │   ├── HistoryList.tsx
│   │   └── WeatherBackground.tsx
│   ├── data/
│   │   └── capitals.ts              # City data
│   ├── services/
│   │   └── weatherApi.ts            # API service
│   ├── types/
│   │   └── weather.ts               # TypeScript types
│   ├── App.tsx                      # Main app component
│   ├── root.tsx                     # Root component
│   ├── entry.dev.tsx                # Dev entry point
│   └── global.css                   # Global styles
├── cypress.config.ts                 # Cypress configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Key Differences from Other Frameworks

### 1. Framework-Specific Dev Server Configuration

Qwik requires special configuration in `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'qwik',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
```

**Why this matters:**
- Qwik uses Vite as its build tool and dev server
- The `cypress-ct-qwik` package provides the necessary adapter
- Qwik's resumability requires special handling of the Qwik loader

### 2. The cypress-ct-qwik Package

Qwik requires a custom Cypress adapter (`cypress-ct-qwik`) because:

- Qwik components use `component$()` with the `$` suffix for lazy-loading
- Qwik has a unique rendering model based on resumability
- The standard React/Vue/Svelte adapters don't understand Qwik's JSX

**Installation:**
```bash
npm install cypress-ct-qwik --save-dev
```

**Note:** There's a known type issue with `JSXOutput` in `cypress-ct-qwik` versions < 0.4.0. The fix has been committed to the upstream repository but may not be released yet. See the [TypeScript Issues](#typescript-issues) section below.

### 3. Mount Command Setup

The custom mount command is set up in `cypress/support/component.ts`:

```typescript
import { addQwikLoader, mount } from 'cypress-ct-qwik';

addQwikLoader();

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
- `addQwikLoader()` initializes Qwik's lazy-loading mechanism
- The `mount` function handles Qwik component rendering
- TypeScript declarations extend Cypress's Chainable interface

### 4. Qwik Component Syntax

Qwik components use a unique syntax with `$` suffixes:

```tsx
import { component$, useSignal, $ } from '@builder.io/qwik';

interface CitySearchProps {
  onSearch$: (city: string) => void;
  loading: boolean;
}

export const CitySearch = component$<CitySearchProps>((props) => {
  const query = useSignal('');
  
  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    props.onSearch$(query.value);
  });
  
  return (
    <form onSubmit$={handleSubmit}>
      <input type="text" data-cy="city-input" />
      <button type="button" data-cy="search-button">Search</button>
    </form>
  );
});
```

**Key patterns:**
- `component$()` - Creates a lazy-loadable Qwik component
- `useSignal()` - Creates reactive state (like useState in React)
- `$()` - Marks functions as lazy-loadable QRLs (Qwik Resource Locators)
- `onX$` props - Event handlers use `$` suffix for lazy-loading

### 5. Button Event Handling

**Important:** Qwik has specific behavior with form submission that differs from other frameworks. The button must use `type="button"` and a separate `onClick$` handler:

```tsx
// Correct approach for Qwik
<button
  type="button"
  onClick$={handleButtonClick}
  disabled={props.loading}
>
  Search
</button>

// NOT type="submit" which can cause unexpected behavior
```

**Why this matters:**
- Qwik's resumability can cause issues with form submission
- Using `type="button"` with explicit `onClick$` ensures reliable behavior
- The form's `onSubmit$` is still used for Enter key submissions

### 6. TypeScript Issues with cypress-ct-qwik

There's a known TypeScript issue where JSX components return `JSXOutput` but the mount function expects `JSXNode`. The error looks like:

```
Argument of type 'JSXOutput' is not assignable to parameter of type 'JSXNode<unknown>'.
  Type 'undefined' is not assignable to type 'JSXNode<unknown>'.
```

**Fix:** The fix has been committed to the [cypress-qwik repository](https://github.com/qwikifiers/cypress-qwik) in commit `24a7b60`. The `mount` function now accepts `JSXOutput | JSXNode[] | FunctionComponent<any>` instead of just `JSXNode`.

If you're using the npm package and see this error, either:
1. Wait for version 0.4.0+ to be released, or
2. Use a local copy of the fixed version

### 7. Input Value Binding in Qwik

Qwik's signal-based reactivity requires specific handling for input values:

```tsx
export const CitySearch = component$<CitySearchProps>((props) => {
  const query = useSignal('');
  
  const handleInput = $((e: Event) => {
    query.value = (e.target as HTMLInputElement).value;
  });
  
  const doSearch = $((value: string) => {
    props.onSearch$(value.trim());
  });
  
  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    doSearch(query.value);
  });
  
  return (
    <input
      type="text"
      value={query.value}
      onInput$={handleInput}
    />
  );
});
```

**Key points:**
- Use `value={query.value}` with `onInput$` handler (not `bind:value`)
- The signal tracks the input value reactively
- On submit, use the signal value (which may not be perfectly synced with DOM)

## Comparison: Qwik vs Other Frameworks

| Aspect | Qwik | Next.js | Svelte | Vue |
|--------|------|---------|--------|-----|
| Framework config | `framework: 'qwik'` | `framework: 'next'` | `framework: 'svelte'` | `framework: 'vue'` |
| Bundler | vite | webpack | vite | vite |
| Mount adapter | `cypress-ct-qwik` | `@cypress/react` | `@cypress/svelte` | `@cypress/vue` |
| Component syntax | `component$()` | `function` | `<script>` | `defineComponent` |
| State management | `useSignal()` | `useState()` | `$state()` | `ref()` |
| Event handlers | `onClick$` | `onClick` | `onclick` | `@click` |
| Lazy-loading | Automatic via `$` | Manual | Manual | Manual |

## Component Tests

### CitySearch Component

Tests for the city search component:

```tsx
// cypress/components/CitySearch.cy.tsx
import { CitySearch } from '~/components/CitySearch';

describe('CitySearch', () => {
  it('renders input and button', () => {
    cy.mount(<CitySearch onSearch$={() => {}} loading={false} />);
    
    cy.get('[data-cy="city-input"]').should('be.visible');
    cy.get('[data-cy="search-button"]').should('be.visible');
  });

  it('shows suggestions when typing', () => {
    cy.mount(<CitySearch onSearch$={() => {}} loading={false} />);
    
    cy.get('[data-cy="city-input"]').type('Sing');
    cy.get('[data-cy="city-suggestions"]').should('be.visible');
  });

  it('calls onSearch when selecting a suggestion', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(<CitySearch onSearch$={onSearch} loading={false} />);
    
    cy.get('[data-cy="city-input"]').type('Sing');
    cy.get('[data-cy="city-suggestion-0"]').click();
    
    cy.get('@onSearch').should('have.been.calledWith', 'Singapore');
  });
});
```

### CurrentWeather Component

Tests include:
- Loading state
- Error state
- Empty state (no weather data)
- Displaying weather data correctly

### ForecastList Component

Tests include:
- Loading state
- Error state
- Empty state
- Displaying forecast data correctly
- All 5 days of forecast

### HistoryList Component

Tests include:
- Loading state
- Error state
- Empty state
- Displaying history data correctly

### WeatherBackground Component

**Note:** Qwik's WeatherBackground uses weather icon codes (`01d`, `01n`) to determine day/night backgrounds, unlike other frameworks that might use system time:

```tsx
const mockWeather: CurrentWeather = {
  city: 'New York',
  country: 'US',
  temperature: 22,
  condition: 'Clear',
  humidity: 65,
  wind_speed: 5.5,
  feels_like: 24,
  icon: '01d',  // 'd' = day, 'n' = night
};

it('renders sunny background for clear weather during day', () => {
  cy.mount(<WeatherBackground weather={mockWeather} isLoading={false} />);
  cy.get('.weather-background').should('have.class', 'bg-sunny');
});
```

Tests include:
- Default background when no weather
- Different backgrounds for different weather conditions (sunny, cloudy, rainy, stormy, snowy, foggy)
- Day/night variations based on icon code

### WeatherApp Integration

Tests include:
- Rendering app title
- Rendering search section
- Rendering weather content section
- Showing empty states initially

## Running Tests

### Open Cypress UI

```bash
cd frontend/qwik
npm install
npm run cypress:open
```

### Run Tests in Headless Mode

```bash
npm run cypress:run
```

### Run Specific Component Tests

```bash
npm run cypress:run -- --spec "cypress/components/CitySearch.cy.tsx"
```

## Best Practices

1. **Use `data-cy` attributes** for reliable test selectors
2. **Test all states**: loading, error, empty, and with data
3. **Test user interactions**: clicks, typing, keyboard navigation
4. **Use stubs for callback props** like `onSearch$`
5. **Use `type="button"`** for buttons that shouldn't submit forms
6. **Test components in isolation** from the full app when possible
7. **Account for Qwik's resumability** - components may render differently in tests vs production

## Key Takeaways

1. **Custom adapter required**: Qwik needs `cypress-ct-qwik` for component testing
2. **Lazy-loading syntax**: The `$` suffix is essential for Qwik's performance
3. **Button handling**: Use `type="button"` with explicit `onClick$` for reliable behavior
4. **TypeScript issues**: Known issue with JSXOutput types - check the package version
5. **Same testing principles**: Core concepts (selectors, assertions, interactions) remain consistent across frameworks
