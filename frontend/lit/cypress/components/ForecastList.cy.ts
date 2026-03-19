import { html } from 'lit';
import '../../src/components/forecast-list';

const mockForecast = {
  city: 'London',
  country: 'GB',
  forecast: [
    { date: '2024-03-17', temp_max: 18, temp_min: 10, condition: 'Clear', icon: '01d', precipitation: 10 },
    { date: '2024-03-18', temp_max: 16, temp_min: 8, condition: 'Clouds', icon: '02d', precipitation: 20 },
    { date: '2024-03-19', temp_max: 14, temp_min: 6, condition: 'Rain', icon: '10d', precipitation: 80 },
    { date: '2024-03-20', temp_max: 15, temp_min: 7, condition: 'Clear', icon: '01d', precipitation: 5 },
    { date: '2024-03-21', temp_max: 17, temp_min: 9, condition: 'Clouds', icon: '03d', precipitation: 15 },
  ],
};

describe('ForecastList', () => {
  it('shows loading state', () => {
    cy.mount(html`
      <forecast-list .forecast=${null} .loading=${true} .error=${null}></forecast-list>
    `);
    cy.get('forecast-list').shadow().find('.text-gray').should('contain', 'Loading forecast...');
  });

  it('shows error state', () => {
    cy.mount(html`
      <forecast-list .forecast=${null} .loading=${false} .error=${'Failed to fetch'}></forecast-list>
    `);
    cy.get('forecast-list').shadow().find('.text-red').should('contain', 'Failed to fetch');
  });

  it('shows empty state', () => {
    cy.mount(html`
      <forecast-list .forecast=${null} .loading=${false} .error=${null}></forecast-list>
    `);
    cy.get('forecast-list').shadow().find('.text-gray').should('contain', 'No forecast data available');
  });

  it('displays forecast data correctly', () => {
    cy.mount(html`
      <forecast-list .forecast=${mockForecast} .loading=${false} .error=${null}></forecast-list>
    `);
    
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-0"]').should('contain', '2024-03-17');
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-0"]').should('contain', '18° / 10°');
  });

  it('displays all 5 days of forecast', () => {
    cy.mount(html`
      <forecast-list .forecast=${mockForecast} .loading=${false} .error=${null}></forecast-list>
    `);
    
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-0"]').should('be.visible');
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-1"]').should('be.visible');
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-2"]').should('be.visible');
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-3"]').should('be.visible');
    cy.get('forecast-list').shadow().find('[data-cy="forecast-day-4"]').should('be.visible');
  });
});
