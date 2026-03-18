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