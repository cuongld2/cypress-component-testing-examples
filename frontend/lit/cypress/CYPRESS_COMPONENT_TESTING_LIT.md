# Cypress Component Testing for Lit

This document details how Cypress component testing has been implemented for the Lit weather application, highlighting the specific configurations and patterns unique to Lit.

## Overview

Cypress Component Testing allows you to test UI components in isolation without needing to run your entire application. For Lit, there are specific considerations due to its web components architecture and Shadow DOM.

## Project Structure

```
frontend/lit/
├── cypress/
│   ├── components/                    # Cypress component tests
│   │   ├── CitySearch.cy.ts
│   │   ├── CurrentWeather.cy.ts
│   │   ├── ForecastList.cy.ts
│   │   ├── HistoryList.cy.ts
│   │   ├── WeatherBackground.cy.ts
│   │   └── WeatherApp.cy.ts
│   ├── support/
│   │   ├── component.ts              # Custom mount command
│   │   └── component-index.html      # HTML template for component testing
│   └── screenshots/                  # Test failure screenshots
├── src/
│   ├── components/                    # Lit components
│   │   ├── city-search.ts
│   │   ├── current-weather.ts
│   │   ├── forecast-list.ts
│   │   ├── history-list.ts
│   │   ├── weather-background.ts
│   │   └── weather-app.ts
│   ├── data/
│   │   └── capitals.ts              # City data
│   ├── services/
│   │   └── weatherApi.ts            # API service
│   ├── types/
│   │   └── weather.ts               # TypeScript types
│   └── main.ts                      # Entry point
├── cypress.config.ts                 # Cypress configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Key Differences from Other Frameworks

### 1. Framework-Specific Dev Server Configuration

Lit requires special configuration using the `cypress-ct-lit` package in `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'cypress-ct-lit' as any,
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
```

**Why this matters:**
- Lit uses Vite as its build tool and dev server
- The `cypress-ct-lit` package provides the necessary adapter for Lit web components
- Lit's web components architecture requires special handling with Shadow DOM

### 2. The cypress-ct-lit Package

Lit requires the `cypress-ct-lit` package for component testing:

**Installation:**
```bash
npm install cypress-ct-lit --save-dev
```

**Note:** You may need to cast the framework as `any` to avoid TypeScript errors:
```typescript
framework: 'cypress-ct-lit' as any,
```

### 3. Custom Mount Command Setup

The custom mount command is set up in `cypress/support/component.ts`:

```typescript
import { mount } from 'cypress-ct-lit';

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
- `mount` from `cypress-ct-lit` handles Lit's template rendering
- Works with both html template literals and string templates
- Handles Shadow DOM integration automatically

### 4. Lit Web Components Architecture

Lit components are web components that extend `LitElement`:

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('city-search')
export class CitySearch extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    /* Component styles */
  `;

  @property({ type: Function })
  onSearch: (city: string) => void = () => {};

  @property({ type: Boolean })
  loading = false;

  @state()
  private query = '';

  render() {
    return html`
      <div data-cy="city-search">
        <form data-cy="city-search-form">
          <input data-cy="city-input" type="text" />
          <button data-cy="search-button" type="submit">Search</button>
        </form>
      </div>
    `;
  }
}
```

**Key patterns:**
- `@customElement('city-search')` - Decorator to register the custom element
- `static styles = css\`...\`` - Encapsulated styles using Shadow DOM
- `@property()` - Declares reactive properties
- `@state()` - Declares internal reactive state
- `html\`...\`` - Lit's template tagged literal

### 5. Shadow DOM Considerations

Lit components use Shadow DOM by default, which provides style encapsulation:

```typescript
static styles = css`
  :host {
    display: block;
  }
  
  .city-name {
    font-weight: 500;
    color: #111827;
  }
`;
```

**In tests:**
- Use `data-cy` attributes for reliable selectors that work across Shadow DOM boundaries
- Query Shadow DOM using `.shadow()`: `cy.get('city-search').shadow().find('[data-cy="city-input"]')`
- For nested Shadow DOM: `cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-input"]')`

### 6. Testing Lit Components with html Templates

Use `html` template literals to mount components:

```typescript
import { html } from 'lit';
import '../../../src/components/city-search';

describe('CitySearch', () => {
  it('renders input and button', () => {
    cy.mount(html`
      <city-search .onSearch=${() => {}} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').should('be.visible');
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('be.visible');
  });
});
```

**Key points:**
- Use `html\`...\`` template literal from Lit
- Property binding uses `.` prefix: `.onSearch=${handler}`
- Boolean attributes use `.` prefix: `.loading=${false}`
- Query inside Shadow DOM with `.shadow().find()`

### 7. Property Binding in Lit

Lit uses property binding with the `.` prefix:

```typescript
// In the component
@property({ type: Function })
onSearch: (city: string) => void = () => {};

@property({ type: Boolean })
loading = false;

// In the template
html`
  <button 
    ?disabled=${this.loading}
    @click=${this.handleClick}
  >
    ${this.loading ? 'Searching...' : 'Search'}
  </button>
`;
```

**In tests:**
- Properties are set using `.` prefix in html template: `.onSearch=${handler}`
- Boolean attributes: `.loading=${true}`

### 8. API Mocking for Component Tests

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
  
  cy.intercept('GET', '**/api/weather/history?city=*', {
    statusCode: 200,
    body: mockHistory,
  }).as('getHistory');
  
  cy.mount(html`<weather-app></weather-app>`);
});
```

**Note:**
- The `**` wildcard is important because the full URL depends on the proxy/server setup
- This is the same approach used across all frameworks

## Component Tests

### CitySearch Component

Tests for the city search component:

```typescript
describe('CitySearch', () => {
  it('renders input and button', () => {
    cy.mount(html`
      <city-search .onSearch=${() => {}} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').should('be.visible');
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('be.visible');
  });

  it('shows suggestions when typing', () => {
    cy.mount(html`
      <city-search .onSearch=${() => {}} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').type('Sing');
    cy.get('city-search').shadow().find('[data-cy="city-suggestions"]').should('be.visible');
    cy.get('city-search').shadow().find('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
  });

  it('calls onSearch when selecting a suggestion', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(html`
      <city-search .onSearch=${onSearch} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').type('Sing');
    cy.get('city-search').shadow().find('[data-cy="city-suggestion-0"]').click();
    
    cy.get('@onSearch').should('have.been.calledWith', 'Singapore');
  });
});
```

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
- All 5 days of forecast

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
- Testing autocomplete selection
- Testing typed city + enter
- Rendering all child components
- Rendering weather background

**Note on Integration Testing with cy.intercept:**

Unlike other frameworks (Vue, React, Svelte), Lit's Shadow DOM architecture makes full integration testing with `cy.intercept` more complex. The Shadow DOM encapsulation and reactive property updates require specific handling. The test approach focuses on:

1. **Component-level testing**: Each component is tested in isolation with props
2. **Rendering verification**: Tests verify components render correctly with different states
3. **Interaction testing**: Tests verify user interactions work correctly
4. **Shadow DOM traversal**: All element queries use `.shadow().find()` for proper traversal

For full end-to-end integration testing with API mocking, consider using standard Cypress e2e tests rather than component tests when testing Lit applications.

## Comparison: Lit vs Other Frameworks

| Aspect | Lit | Vue | Svelte | Angular | Next.js |
|--------|-----|-----|--------|---------|---------|
| Framework config | `framework: 'cypress-ct-lit'` | `framework: 'vue'` | `framework: 'svelte'` | `framework: 'angular'` | `framework: 'next'` |
| Bundler | vite | vite | vite | webpack | webpack |
| Mount command | `cy.mount(html\`...\`)`` | `cy.mount(Component)` | `mount(Component)` | `cy.mount(Component)` | `cy.mount(<Component />)` |
| Component type | Web Component | Vue Component | Svelte Component | Angular Component | React Component |
| Style encapsulation | Shadow DOM | Scoped CSS | Scoped CSS | View encapsulation | CSS Modules |
| State management | `@state()` | `ref()` | `$state()` | Signals/BehaviorSubject | `useState()` |
| DOM access | `.shadow().find()` | Direct | Direct | Direct | Direct |

## Running Tests

### Open Cypress UI

```bash
cd frontend/lit
npm install
npm run cypress:open
```

### Run Tests in Headless Mode

```bash
npm run cypress:run
```

### Run Specific Component Tests

```bash
npm run cypress:run -- --spec "cypress/components/CitySearch.cy.ts"
```

## Best Practices

1. **Use `data-cy` attributes** for reliable test selectors - works across Shadow DOM boundaries
2. **Use `.shadow().find()`** to query elements inside Shadow DOM
3. **Test all states**: loading, error, empty, and with data
4. **Test user interactions**: clicks, typing, keyboard navigation
5. **Use stubs for callback props** like `onSearch`
6. **Test components in isolation** from the full app when possible
7. **Account for Lit's reactivity** - use `cy.wait()` for async state updates
8. **Handle nested Shadow DOM** - chain `.shadow()` calls for nested components

## Key Takeaways

1. **Web components architecture**: Lit creates native web components that extend `LitElement`

2. **Shadow DOM encapsulation**: Styles are encapsulated by default using Shadow DOM, requiring `.shadow()` in tests

3. **Decorators**: Lit uses TypeScript decorators (`@customElement`, `@property`, `@state`) for component definition

4. **Template literals**: Uses `html\`...\`` and `css\`...\`` tagged literals for templates and styles

5. **Property binding**: Uses `.` prefix for property binding in html templates

6. **cypress-ct-lit adapter**: Requires the `cypress-ct-lit` package for component testing support

7. **Same testing principles**: Core concepts (selectors, assertions, interactions) remain consistent across frameworks, just with different DOM access patterns
