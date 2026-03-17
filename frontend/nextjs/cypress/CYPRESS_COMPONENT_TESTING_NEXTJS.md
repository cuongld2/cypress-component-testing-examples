# Cypress Component Testing for Next.js

This document details how Cypress component testing has been implemented for the Next.js weather application, highlighting the specific configurations and patterns that make Next.js testing unique compared to other frameworks.

## Overview

Cypress Component Testing allows you to test UI components in isolation without needing to run your entire application. For Next.js, there are specific considerations due to its framework architecture.

## Key Differences from Other Frameworks

### 1. Framework-Specific Dev Server Configuration

Unlike React (Vite/Create React App) or Vue, Next.js requires special configuration in `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',    // Framework identifier
      bundler: 'webpack',   // Next.js uses webpack by default
    },
    // ...
  },
});
```

**Why this matters:**
- Cypress needs to know how to compile Next.js/React code for component testing
- The devServer must be configured to use the appropriate framework bundler
- This differs from Vue (uses Vite by default) or plain React (can use Vite or webpack)

### 2. 'use client' Directive Handling

Next.js components using client-side features (hooks, event handlers) must include the `'use client'` directive:

```tsx
// src/components/weather/CitySearch.tsx
'use client';  // Required for components using React hooks

import { useState, useRef, useEffect } from 'react';

export function CitySearch({ onSearch, loading }: CitySearchProps) {
  // Component implementation
}
```

**In tests**, Cypress automatically handles this - you don't need special configuration. The component mounts correctly because:
- Cypress uses `@cypress/react` which understands React 19
- The `mount` command from `@cypress/react` handles client component rendering

### 3. Path Aliases and TypeScript

Next.js uses path aliases (`@/` for `/src`) configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**In tests**, you can import using these aliases:

```tsx
// This works in Cypress tests
import { CitySearch } from '@/components/weather/CitySearch';
import Home from '@/app/page';
```

**Why it works:**
- Cypress loads the TypeScript configuration via `@cypress/react`
- The bundler (webpack) is configured to resolve these aliases through Next.js

### 4. Mounting Next.js Pages vs Components

Next.js has two testing scenarios:

#### A. Testing Individual Components

```tsx
// cypress/components/CitySearch.cy.tsx
import { CitySearch } from '@/components/weather/CitySearch';

describe('CitySearch', () => {
  it('renders input and button', () => {
    cy.mount(<CitySearch onSearch={cy.stub()} loading={false} />);
    cy.get('[data-cy="city-input"]').should('be.visible');
  });
});
```

#### B. Testing Next.js Pages

```tsx
// cypress/components/WeatherApp.cy.tsx
import Home from '@/app/page';

describe('Weather App', () => {
  beforeEach(() => {
    // Mount the entire page component (a client component in this case)
    cy.mount(<Home />);
  });
});
```

**Note:**
- Next.js App Router page components can be mounted directly for testing
- This works because the page (`src/app/page.tsx`) is exported as a default component
- The same approach applies to React (Vite) where you'd mount `App.tsx` or route components

### 5. Custom Mount Command with React 19

Since Next.js uses React as its UI library, the mount setup is React-specific (not a Next.js feature):

```typescript
// cypress/support/component.ts
import { mount } from '@cypress/react';

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(component, options);
});
```

**Why this setup is needed:**
- Uses `@cypress/react` package (required for any React-based framework including Next.js)
- Works with React 19 which has some differences from React 18
- The `mount` function handles:
  - React 19's rendering APIs
  - Automatic cleanup between tests
  - Context providers if needed

### 6. API Mocking for Component/Page Tests

When testing components or pages that fetch data, you need to intercept API calls:

```typescript
// cypress/components/WeatherApp.cy.tsx
beforeEach(() => {
  // Intercept API calls - components using useEffect for data fetching
  cy.intercept('GET', '**/api/weather/current?city=*', {
    statusCode: 200,
    body: mockCurrentWeather,
  }).as('getCurrentWeather');
  
  cy.intercept('GET', '**/api/weather/forecast?city=*', {
    statusCode: 200,
    body: mockForecast,
  }).as('getForecast');
  
  cy.mount(<Home />);
});
```

**Note:**
- The `**` wildcard is important because the full URL depends on the proxy/server setup
- This is the same approach used in React (Vite), Vue, or Svelte - any component using `useEffect` (or equivalent) for data fetching needs API mocking
- Alternatively, you could use MSW (Mock Service Worker) which works across all frameworks

### 7. Testing Client-Side Interactivity

Next.js components often have `'use client'` for interactivity. Tests verify this works:

```tsx
it('shows suggestions when typing', () => {
  cy.mount(<CitySearch onSearch={cy.stub()} loading={false} />);
  
  cy.get('[data-cy="city-input"]').type('Sing');
  cy.get('[data-cy="city-suggestions"]').should('be.visible');
  cy.get('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
});
```

**Verification points:**
- Typing in input triggers state changes
- Suggestions appear based on local data (from `@/data/capitals`)
- Click on suggestion calls the `onSearch` callback

### 8. Testing Keyboard Navigation

Components with keyboard handlers need specific tests:

```tsx
it('navigates suggestions with keyboard', () => {
  const onSearch = cy.stub().as('onSearch');
  cy.mount(<CitySearch onSearch={onSearch} loading={false} />);
  
  cy.get('[data-cy="city-input"]').type('Sing');
  cy.get('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
  
  // Arrow down to select, then enter
  cy.get('[data-cy="city-input"]').type('{downarrow}');
  cy.get('[data-cy="city-input"]').type('{enter}');
  
  cy.get('@onSearch').should('have.been.calledWith', 'Singapore');
});
```

**Note:** The `{downarrow}` and `{enter}` are Cypress keyboard special keys - this works the same across frameworks.

### 9. Loading and Disabled States

Test disabled states during loading:

```tsx
it('disables button when loading', () => {
  cy.mount(<CitySearch onSearch={cy.stub()} loading={true} />);
  
  cy.get('[data-cy="search-button"]').should('be.disabled');
  cy.get('[data-cy="search-button"]').should('contain', 'Searching...');
});
```

### 10. data-cy Attributes for Test Selectors

We use `data-cy` attributes for reliable test selectors - this is a best practice across all frameworks:

```tsx
// In the component
<input data-cy="city-input" ... />
<button data-cy="search-button" ... />
<ul data-cy="city-suggestions">
  <li data-cy="city-suggestion-0">...</li>
</ul>

// In tests
cy.get('[data-cy="city-input"]').type('London');
cy.get('[data-cy="city-suggestion-0"]').click();
```

## Comparison: Next.js vs Other Frameworks

| Aspect | Next.js | React (Vite) | Vue | Svelte |
|--------|---------|--------------|-----|--------|
| Framework config | `framework: 'next'` | `framework: 'react'` | `framework: 'vue'` | `framework: 'svelte'` |
| Bundler | webpack | vite | vite | vite |
| Client directive | `'use client'` (App Router) | N/A | N/A | N/A |
| Path aliases | Native via tsconfig | Native via tsconfig | Native | Native |
| Mount command | Via `@cypress/react` | Via `@cypress/react` | Via `@cypress/vue` | Via `@cypress/svelte` |

## Test File Structure

```
frontend/nextjs/cypress/
├── components/                    # Component test files
│   ├── CitySearch.cy.tsx         # Individual component tests
│   ├── CurrentWeather.cy.tsx
│   ├── ForecastList.cy.tsx
│   ├── HistoryList.cy.tsx
│   ├── WeatherBackground.cy.tsx
│   └── WeatherApp.cy.tsx         # Page/integration tests
├── support/
│   └── component.ts              # Custom mount command
└── screenshots/                   # Test failure screenshots
```

## Running Tests

```bash
# Open interactive test runner (component mode)
npm run cypress:open

# Run all component tests in headless mode
npm run cypress:run

# Run specific component tests
npm run cypress:run -- --spec "cypress/components/CitySearch.cy.tsx"
```

**Note:** The `--component` flag is required to run component tests (not e2e tests). This is configured in the npm scripts.

## Key Takeaways

1. **Next.js-specific config**: The `cypress.config.ts` must specify `framework: 'next'` and `bundler: 'webpack'`

2. **Client components**: The `'use client'` directive is handled automatically by Cypress - no special setup needed

3. **Path aliases work out of box**: Import using `@/components/...` just like in your app code

4. **Mount pages directly**: You can mount entire Next.js page components for integration testing

5. **API mocking**: Use `cy.intercept()` to mock backend calls - this is the same approach used across all frameworks

6. **React 19 support**: The `@cypress/react` package handles React 19's new APIs

7. **Same testing principles**: Despite framework differences, the core testing concepts (selectors, assertions, interactions) remain consistent across frameworks
