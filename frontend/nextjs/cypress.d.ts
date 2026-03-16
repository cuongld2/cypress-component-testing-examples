/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    mount(component: React.ReactElement, options?: any): Chainable<any>;
  }
}
