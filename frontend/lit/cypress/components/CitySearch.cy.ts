import { html } from 'lit';
import '../../src/components/city-search';

describe('CitySearch', () => {
  it('renders input and button', () => {
    cy.mount(html`
      <city-search .onSearch=${() => {}} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').should('be.visible');
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('be.visible');
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('contain', 'Search');
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
    cy.get('city-search').shadow().find('[data-cy="city-suggestions"]').should('not.exist');
  });

  it('calls onSearch when submitting form with typed city', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(html`
      <city-search .onSearch=${onSearch} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').type('Tokyo{enter}');
    
    cy.get('@onSearch').should('have.been.calledWith', 'Tokyo');
  });

  it('disables button when loading', () => {
    cy.mount(html`
      <city-search .onSearch=${() => {}} .loading=${true}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('be.disabled');
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('contain', 'Searching...');
  });

  it('disables button when input is empty', () => {
    cy.mount(html`
      <city-search .onSearch=${() => {}} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="search-button"]').should('be.disabled');
  });

  it('navigates suggestions with keyboard', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(html`
      <city-search .onSearch=${onSearch} .loading=${false}></city-search>
    `);
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').type('Sing');
    cy.get('city-search').shadow().find('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
    
    cy.get('city-search').shadow().find('[data-cy="city-input"]').type('{downarrow}');
    cy.get('city-search').shadow().find('[data-cy="city-input"]').type('{enter}');
    
    cy.get('@onSearch').should('have.been.calledWith', 'Singapore');
  });
});
