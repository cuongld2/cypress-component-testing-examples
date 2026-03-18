import '@cypress/svelte';
import { mount } from '@cypress/svelte';
import { type ComponentType } from 'svelte';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', (component: ComponentType | Function, options?: Record<string, unknown>) => {
  if (typeof component === 'function') {
    const Component = component as ComponentType;
    return mount(Component, options);
  }
  return mount(component, options);
});