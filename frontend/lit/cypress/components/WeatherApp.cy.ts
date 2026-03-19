import { html } from 'lit';
import '../../src/components/weather-app';

const mockCurrentWeather = {
  city: 'London',
  country: 'GB',
  temperature: 15,
  feels_like: 14,
  humidity: 75,
  wind_speed: 5.5,
  condition: 'Clouds',
  icon: '04d',
};

const mockForecast = {
  city: 'London',
  country: 'GB',
  forecast: [
    { date: '2024-01-15', temp_max: 16, temp_min: 10, condition: 'Clouds', icon: '04d', precipitation: 10 },
    { date: '2024-01-16', temp_max: 17, temp_min: 11, condition: 'Clear', icon: '01d', precipitation: 5 },
    { date: '2024-01-17', temp_max: 14, temp_min: 9, condition: 'Rain', icon: '10d', precipitation: 80 },
    { date: '2024-01-18', temp_max: 12, temp_min: 7, condition: 'Clouds', icon: '04d', precipitation: 20 },
    { date: '2024-01-19', temp_max: 15, temp_min: 8, condition: 'Clear', icon: '01d', precipitation: 0 },
  ],
};

const mockHistory = {
  city: 'London',
  country: 'GB',
  history: [
    { date: '2024-01-10', temperature: 12, condition: 'Rain', icon: '10d', humidity: 80, wind_speed: 4.5 },
    { date: '2024-01-09', temperature: 14, condition: 'Clouds', icon: '04d', humidity: 70, wind_speed: 3.5 },
    { date: '2024-01-08', temperature: 16, condition: 'Clear', icon: '01d', humidity: 60, wind_speed: 2.5 },
  ],
};

describe('WeatherApp Integration', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/weather/current*', mockCurrentWeather).as('getCurrentWeather');
    cy.intercept('GET', '/api/weather/forecast*', mockForecast).as('getForecast');
    cy.intercept('GET', '/api/weather/history*', mockHistory).as('getHistory');
    cy.mount(html`<weather-app></weather-app>`);
  });

  it('renders app title', () => {
    cy.get('weather-app').shadow().find('[data-cy="app-title"]').should('contain', 'Weather App');
  });

  it('renders search section', () => {
    cy.get('weather-app').shadow().find('[data-cy="search-section"]').should('be.visible');
  });

  it('renders weather content section', () => {
    cy.get('weather-app').shadow().find('[data-cy="weather-content"]').should('be.visible');
  });

  it('shows empty states for weather components initially', () => {
    cy.get('weather-app').shadow().find('current-weather').shadow().find('.text-gray').should('contain', 'Search for a city to see weather');
    cy.get('weather-app').shadow().find('forecast-list').shadow().find('.text-gray').should('contain', 'No forecast data available');
    cy.get('weather-app').shadow().find('history-list').shadow().find('.text-gray').should('contain', 'No history data available');
  });

  it('shows suggestions when typing in search input', () => {
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-input"]').type('Madrid');
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-suggestions"]').should('be.visible');
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-suggestion-0"]').should('contain', 'Madrid');
  });

  it('calls onSearch callback when selecting a suggestion', () => {
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-input"]').type('London');
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-suggestion-0"]').click();
  });

  it('renders weather background component', () => {
    cy.get('body').find('.weather-background').should('exist');
  });

  it('renders all child weather components', () => {
    cy.get('weather-app').shadow().find('current-weather').should('exist');
    cy.get('weather-app').shadow().find('forecast-list').should('exist');
    cy.get('weather-app').shadow().find('history-list').should('exist');
    cy.get('weather-app').shadow().find('city-search').should('exist');
  });

  it('displays weather data after search', () => {
    cy.intercept('GET', '/api/weather/current*', mockCurrentWeather).as('getCurrentWeather');
    cy.intercept('GET', '/api/weather/forecast*', mockForecast).as('getForecast');
    cy.intercept('GET', '/api/weather/history*', mockHistory).as('getHistory');
    
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-input"]').type('London');
    cy.get('weather-app').shadow().find('city-search').shadow().find('[data-cy="city-suggestion-0"]').click();
    
    cy.wait('@getCurrentWeather');
    cy.wait('@getForecast');
    cy.wait('@getHistory');
    
    cy.get('weather-app').shadow().find('current-weather')
      .shadow()
      .find('[data-cy="weather-city"]', { timeout: 10000 })
      .should('contain', 'London');
    
    cy.get('weather-app').shadow().find('forecast-list')
      .shadow()
      .find('.grid-5')
      .should('be.visible');
    
    cy.get('weather-app').shadow().find('history-list')
      .shadow()
      .find('[data-cy^="history-day-"]')
      .should('have.length', 3);
  });
});
