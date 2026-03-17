import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      return config;
    },
    supportFile: 'cypress/support/component.ts',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
});
