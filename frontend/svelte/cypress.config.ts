import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      return config;
    },
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
  },
});