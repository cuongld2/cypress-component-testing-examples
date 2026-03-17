import { CitySearchComponent } from '../../src/app/components/city-search.component';

describe('CitySearchComponent', () => {
  it('renders input and button', () => {
    cy.mount(CitySearchComponent, {
      componentProperties: {
        loading: false
      }
    })
    .then((result) => {
      console.log('Mount result:', result);
    });
    
    cy.get('[data-cy="city-input"]').should('be.visible');
    cy.get('[data-cy="search-button"]').should('be.visible');
    cy.get('[data-cy="search-button"]').should('contain', 'Search');
  });

  it('shows suggestions when typing', () => {
    cy.mount(CitySearchComponent, {
      componentProperties: {
        loading: false
      }
    });
    
    cy.get('[data-cy="city-input"]').type('Sing');
    cy.get('[data-cy="city-suggestions"]').should('be.visible');
    cy.get('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
  });

  it('disables button when loading', () => {
    cy.mount(CitySearchComponent, {
      componentProperties: {
        loading: true
      }
    });
    
    cy.get('[data-cy="search-button"]').should('be.disabled');
    cy.get('[data-cy="search-button"]').should('contain', 'Searching...');
  });
});
