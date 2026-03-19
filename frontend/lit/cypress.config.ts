import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  component: {
    devServer: {
      framework: 'cypress-ct-lit' as any,
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    specPattern: 'cypress/components/**/*.cy.*',
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
  },
});
