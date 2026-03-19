# Lit Weather App

This is a weather application built with [Lit](https://lit.dev/), a simple library for building fast, lightweight web components.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Cypress Component Testing

This project includes comprehensive Cypress component tests. To run the tests:

```bash
# Open Cypress test runner
npm run cypress:open

# Run tests in headless mode
npm run cypress:run
```

### Test Structure

- `cypress/components/` - Component test files
- `cypress/support/` - Test configuration and custom commands

## Learn More

To learn more about Lit, take a look at the following resources:

- [Lit Documentation](https://lit.dev/docs/) - Learn about Lit features and API
- [Lit Tutorial](https://lit.dev/tutorials/) - Interactive tutorials
- [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/overview) - Learn about Cypress component testing

## Project Structure

```
frontend/lit/
├── src/
│   ├── components/         # Lit web components
│   │   ├── city-search.ts
│   │   ├── current-weather.ts
│   │   ├── forecast-list.ts
│   │   ├── history-list.ts
│   │   ├── weather-background.ts
│   │   └── weather-app.ts
│   ├── data/             # City data
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── main.ts           # Entry point
├── cypress/              # Cypress component tests
├── cypress.config.ts     # Cypress configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```
