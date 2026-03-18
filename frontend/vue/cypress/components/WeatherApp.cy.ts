import App from '~/App.vue';
import type { CurrentWeather, Forecast, History } from '~/types/weather';

const mockCurrentWeather: CurrentWeather = {
  city: 'London',
  country: 'GB',
  temperature: 15,
  condition: 'Clouds',
  humidity: 75,
  wind_speed: 5.5,
  feels_like: 14,
  icon: '02d',
};

const mockForecast: Forecast = {
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

const mockHistory: History = {
  city: 'London',
  country: 'GB',
  history: [
    { date: '2024-03-15', temperature: 12, condition: 'Clouds', humidity: 70, wind_speed: 4.5, icon: '02d' },
    { date: '2024-03-14', temperature: 10, condition: 'Rain', humidity: 80, wind_speed: 6.0, icon: '10d' },
    { date: '2024-03-13', temperature: 8, condition: 'Clear', humidity: 65, wind_speed: 3.5, icon: '01d' },
  ],
};

describe('WeatherApp Integration', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/weather/current?city=*', {
      statusCode: 200,
      body: mockCurrentWeather,
    }).as('getCurrentWeather');
    
    cy.intercept('GET', '**/api/weather/forecast?city=*', {
      statusCode: 200,
      body: mockForecast,
    }).as('getForecast');
    
    cy.intercept('GET', '**/api/weather/history?city=*', {
      statusCode: 200,
      body: mockHistory,
    }).as('getHistory');
    
    cy.mount(App);
  });

  it('renders app title', () => {
    cy.get('[data-cy="app-title"]').should('contain', 'Weather App');
  });

  it('renders search section', () => {
    cy.get('[data-cy="search-section"]').should('be.visible');
  });

  it('renders weather content section', () => {
    cy.get('[data-cy="weather-content"]').should('be.visible');
  });

  it('shows empty states for weather components initially', () => {
    cy.contains('Search for a city to see weather').should('be.visible');
    cy.contains('No forecast data available').should('be.visible');
    cy.contains('No history data available').should('be.visible');
  });

  it('shows suggestions when typing in search input', () => {
    cy.get('[data-cy="city-input"]').type('Madrid');
    cy.get('[data-cy="city-suggestions"]').should('be.visible');
    cy.get('[data-cy="city-suggestion-0"]').should('contain', 'Madrid');
  });

  it('fetches and displays weather data when selecting a city from autocomplete', () => {
    cy.get('[data-cy="city-input"]').type('London');
    cy.get('[data-cy="city-suggestion-0"]').click();
    
    cy.wait('@getCurrentWeather');
    cy.wait('@getForecast');
    cy.wait('@getHistory');
    
    cy.get('[data-cy="weather-city"]').should('contain', 'London, GB');
    cy.get('[data-cy="weather-temp"]').should('contain', '15°C');
    
    cy.get('[data-cy="forecast-day-0"]').should('be.visible');
    cy.get('[data-cy="history-day-0"]').should('be.visible');
  });

  it('fetches and displays weather data when pressing enter with typed city', () => {
    cy.get('[data-cy="city-input"]').type('London{enter}');
    
    cy.wait('@getCurrentWeather');
    cy.wait('@getForecast');
    cy.wait('@getHistory');
    
    cy.get('[data-cy="weather-city"]').should('contain', 'London');
  });

  it('displays background based on weather condition', () => {
    cy.get('[data-cy="city-input"]').type('London{enter}');
    
    cy.wait('@getCurrentWeather');
    
    cy.get('.weather-background').should('exist');
  });

  it('displays forecast data correctly', () => {
    cy.get('[data-cy="city-input"]').type('London{enter}');
    
    cy.wait('@getForecast');
    
    cy.get('[data-cy="forecast-day-0"]').should('contain', '2024-03-17');
    cy.get('[data-cy="forecast-day-0"]').should('contain', '18° / 10°');
  });

  it('displays history data correctly', () => {
    cy.get('[data-cy="city-input"]').type('London{enter}');
    
    cy.wait('@getHistory');
    
    cy.get('[data-cy="history-day-0"]').should('contain', '2024-03-15');
    cy.get('[data-cy="history-day-0"]').should('contain', '12°C');
  });
});