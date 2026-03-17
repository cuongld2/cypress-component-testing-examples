import { CurrentWeatherComponent } from '../../src/app/components/current-weather.component';
import { CurrentWeather } from '../../src/app/types/weather';

describe('CurrentWeatherComponent', () => {
  const mockWeather: CurrentWeather = {
    city: 'Singapore',
    country: 'SG',
    temperature: 28,
    condition: 'Clear',
    humidity: 75,
    wind_speed: 3.5,
    feels_like: 30,
    icon: '01d'
  };

  it('renders placeholder when no weather data', () => {
    cy.mount(CurrentWeatherComponent, {
      componentProperties: {
        weather: null,
        loading: false,
        error: null
      }
    });

    cy.contains('Search for a city to see weather').should('be.visible');
  });

  it('renders loading state', () => {
    cy.mount(CurrentWeatherComponent, {
      componentProperties: {
        weather: null,
        loading: true,
        error: null
      }
    });

    cy.contains('Loading current weather...').should('be.visible');
  });

  it('renders error state', () => {
    cy.mount(CurrentWeatherComponent, {
      componentProperties: {
        weather: null,
        loading: false,
        error: 'Failed to fetch weather'
      }
    });

    cy.contains('Failed to fetch weather').should('be.visible');
  });

  it('renders weather data correctly', () => {
    cy.mount(CurrentWeatherComponent, {
      componentProperties: {
        weather: mockWeather,
        loading: false,
        error: null
      }
    });

    cy.get('[data-cy="weather-city"]').should('contain', 'Singapore, SG');
    cy.get('[data-cy="weather-condition"]').should('contain', 'Clear');
    cy.get('[data-cy="weather-temp"]').should('contain', '28°C');
    cy.get('[data-cy="weather-humidity"]').should('contain', '75%');
    cy.get('[data-cy="weather-wind"]').should('contain', '3.5 m/s');
    cy.get('[data-cy="weather-icon"]').should('be.visible');
  });
});
