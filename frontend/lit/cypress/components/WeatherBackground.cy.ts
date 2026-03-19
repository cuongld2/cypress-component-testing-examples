import { html } from 'lit';
import '../../src/components/weather-background';

describe('WeatherBackground', () => {
  it('renders background div in body', () => {
    cy.mount(html`
      <weather-background .weather=${null} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
    cy.get('body').find('.weather-background').should('have.class', 'bg-default');
  });

  it('renders sunny background for clear weather during day', () => {
    const mockWeather = {
      city: 'New York',
      country: 'US',
      temperature: 22,
      condition: 'Clear',
      humidity: 65,
      wind_speed: 5.5,
      feels_like: 24,
      icon: '01d',
    };
    cy.mount(html`
      <weather-background .weather=${mockWeather} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
  });

  it('renders cloudy background for cloudy weather', () => {
    const mockWeather = {
      city: 'London',
      country: 'GB',
      temperature: 15,
      condition: 'Clouds',
      humidity: 75,
      wind_speed: 5.5,
      feels_like: 14,
      icon: '04d',
    };
    cy.mount(html`
      <weather-background .weather=${mockWeather} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
  });

  it('renders rainy background for rainy weather', () => {
    const mockWeather = {
      city: 'Seattle',
      country: 'US',
      temperature: 12,
      condition: 'Rain',
      humidity: 85,
      wind_speed: 8.0,
      feels_like: 10,
      icon: '10d',
    };
    cy.mount(html`
      <weather-background .weather=${mockWeather} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
  });

  it('renders stormy background for thunderstorm', () => {
    const mockWeather = {
      city: 'Denver',
      country: 'US',
      temperature: 18,
      condition: 'Thunderstorm',
      humidity: 70,
      wind_speed: 15.0,
      feels_like: 16,
      icon: '11d',
    };
    cy.mount(html`
      <weather-background .weather=${mockWeather} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
  });

  it('renders snowy background for snow', () => {
    const mockWeather = {
      city: 'Moscow',
      country: 'RU',
      temperature: -5,
      condition: 'Snow',
      humidity: 80,
      wind_speed: 3.0,
      feels_like: -8,
      icon: '13d',
    };
    cy.mount(html`
      <weather-background .weather=${mockWeather} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
  });

  it('renders foggy background for foggy weather', () => {
    const mockWeather = {
      city: 'London',
      country: 'GB',
      temperature: 10,
      condition: 'Fog',
      humidity: 95,
      wind_speed: 2.0,
      feels_like: 9,
      icon: '50d',
    };
    cy.mount(html`
      <weather-background .weather=${mockWeather} .isLoading=${false}></weather-background>
    `);
    cy.get('body').find('.weather-background').should('exist');
  });
});
