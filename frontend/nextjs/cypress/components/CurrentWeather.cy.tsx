import { CurrentWeather } from '@/components/weather/CurrentWeather';

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
    cy.mount(<CurrentWeather weather={null} loading={true} error={null} />);
    cy.contains('Loading current weather...').should('be.visible');
  });

  it('shows error state', () => {
    cy.mount(<CurrentWeather weather={null} loading={false} error="Failed to fetch" />);
    cy.contains('Failed to fetch').should('be.visible');
  });

  it('shows empty state', () => {
    cy.mount(<CurrentWeather weather={null} loading={false} error={null} />);
    cy.contains('Search for a city to see weather').should('be.visible');
  });

  it('displays weather data correctly', () => {
    cy.mount(<CurrentWeather weather={mockCurrentWeather} loading={false} error={null} />);
    
    cy.get('[data-cy="weather-city"]').should('contain', 'New York, US');
    cy.get('[data-cy="weather-condition"]').should('contain', 'Clear');
    cy.get('[data-cy="weather-temp"]').should('contain', '22°C');
    cy.get('[data-cy="weather-humidity"]').should('contain', '65%');
    cy.get('[data-cy="weather-wind"]').should('contain', '5.5 m/s');
  });
});
