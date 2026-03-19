import { html } from 'lit';
import '../../src/components/current-weather';

const mockCurrentWeather = {
  city: 'New York',
  country: 'US',
  temperature: 22,
  condition: 'Clear',
  humidity: 65,
  wind_speed: 5.5,
  feels_like: 24,
  icon: '01d',
};

describe('CurrentWeather', () => {
  it('shows loading state', () => {
    cy.mount(html`
      <current-weather .weather=${null} .loading=${true} .error=${null}></current-weather>
    `);
    cy.get('current-weather').shadow().find('.text-gray').should('contain', 'Loading current weather...');
  });

  it('shows error state', () => {
    cy.mount(html`
      <current-weather .weather=${null} .loading=${false} .error=${'Failed to fetch'}></current-weather>
    `);
    cy.get('current-weather').shadow().find('.text-red').should('contain', 'Failed to fetch');
  });

  it('shows empty state', () => {
    cy.mount(html`
      <current-weather .weather=${null} .loading=${false} .error=${null}></current-weather>
    `);
    cy.get('current-weather').shadow().find('.text-gray').should('contain', 'Search for a city to see weather');
  });

  it('displays weather data correctly', () => {
    cy.mount(html`
      <current-weather .weather=${mockCurrentWeather} .loading=${false} .error=${null}></current-weather>
    `);
    
    cy.get('current-weather').shadow().find('[data-cy="weather-city"]').should('contain', 'New York, US');
    cy.get('current-weather').shadow().find('[data-cy="weather-condition"]').should('contain', 'Clear');
    cy.get('current-weather').shadow().find('[data-cy="weather-temp"]').should('contain', '22°C');
    cy.get('current-weather').shadow().find('[data-cy="weather-humidity"]').should('contain', '65%');
    cy.get('current-weather').shadow().find('[data-cy="weather-wind"]').should('contain', '5.5 m/s');
  });
});
