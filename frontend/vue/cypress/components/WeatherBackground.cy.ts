import WeatherBackground from '~/components/WeatherBackground.vue';
import type { CurrentWeather } from '~/types/weather';

const mockWeather: CurrentWeather = {
  city: 'New York',
  country: 'US',
  temperature: 22,
  condition: 'Clear',
  humidity: 65,
  wind_speed: 5.5,
  feels_like: 24,
  icon: '01d',
};

describe('WeatherBackground', () => {
  it('renders default background when no weather', () => {
    cy.mount(WeatherBackground, { props: { weather: null, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-default');
  });

  it('renders sunny background for clear weather during day', () => {
    cy.mount(WeatherBackground, { props: { weather: mockWeather, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-sunny');
  });

  it('renders cloudy background for cloudy weather', () => {
    const cloudyWeather = { ...mockWeather, condition: 'Clouds' };
    cy.mount(WeatherBackground, { props: { weather: cloudyWeather, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-cloudy-day');
  });

  it('renders rainy background for rainy weather', () => {
    const rainyWeather = { ...mockWeather, condition: 'Rain' };
    cy.mount(WeatherBackground, { props: { weather: rainyWeather, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-rainy-day');
  });

  it('renders stormy background for thunderstorm', () => {
    const stormyWeather = { ...mockWeather, condition: 'Thunderstorm' };
    cy.mount(WeatherBackground, { props: { weather: stormyWeather, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-stormy');
  });

  it('renders snowy background for snow', () => {
    const snowyWeather = { ...mockWeather, condition: 'Snow' };
    cy.mount(WeatherBackground, { props: { weather: snowyWeather, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-snowy-day');
  });

  it('renders foggy background for mist', () => {
    const mistyWeather = { ...mockWeather, condition: 'Mist' };
    cy.mount(WeatherBackground, { props: { weather: mistyWeather, isLoading: false } });
    cy.get('.weather-background').should('have.class', 'bg-foggy');
  });
});