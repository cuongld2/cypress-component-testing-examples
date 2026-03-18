import { CitySearch } from '~/components/CitySearch';

describe('CitySearch', () => {
  it('renders input and button', () => {
    cy.mount(<CitySearch onSearch$={() => {}} loading={false} />);
    
    cy.get('[data-cy="city-input"]').should('be.visible');
    cy.get('[data-cy="search-button"]').should('be.visible');
    cy.get('[data-cy="search-button"]').should('contain', 'Search');
  });

  it('shows suggestions when typing', () => {
    cy.mount(<CitySearch onSearch$={() => {}} loading={false} />);
    
    cy.get('[data-cy="city-input"]').type('Sing', { delay: 50 });
    cy.get('[data-cy="city-input"]').should('have.value', 'Sing');
    cy.get('[data-cy="city-suggestions"]').should('be.visible');
    cy.get('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
  });

  it('calls onSearch when selecting a suggestion', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(<CitySearch onSearch$={onSearch} loading={false} />);
    
    cy.get('[data-cy="city-input"]').type('Sing');
    cy.get('[data-cy="city-suggestion-0"]').click();
    
    cy.get('@onSearch').should('have.been.calledWith', 'Singapore');
    cy.get('[data-cy="city-suggestions"]').should('not.exist');
  });

  it('calls onSearch when submitting form with typed city', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(<CitySearch onSearch$={onSearch} loading={false} />);
    
    cy.get('[data-cy="city-input"]').type('Tokyo{enter}');
    
    cy.get('@onSearch').should('have.been.calledWith', 'Tokyo');
  });

  it('disables button when loading', () => {
    cy.mount(<CitySearch onSearch$={() => {}} loading={true} />);
    
    cy.get('[data-cy="search-button"]').should('be.disabled');
    cy.get('[data-cy="search-button"]').should('contain', 'Searching...');
  });

  it('disables button when input is empty', () => {
    cy.mount(<CitySearch onSearch$={() => {}} loading={false} />);
    
    cy.get('[data-cy="search-button"]').should('be.disabled');
  });

  it('navigates suggestions with keyboard', () => {
    const onSearch = cy.stub().as('onSearch');
    cy.mount(<CitySearch onSearch$={onSearch} loading={false} />);
    
    cy.get('[data-cy="city-input"]').type('Sing');
    cy.get('[data-cy="city-suggestion-0"]').should('contain', 'Singapore');
    
    cy.get('[data-cy="city-input"]').type('{downarrow}');
    cy.get('[data-cy="city-input"]').type('{enter}');
    
    cy.get('@onSearch').should('have.been.calledWith', 'Singapore');
  });
});