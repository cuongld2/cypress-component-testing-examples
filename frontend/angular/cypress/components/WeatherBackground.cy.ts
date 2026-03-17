import { WeatherBackgroundComponent } from '../../src/app/components/weather-background.component';
import { CurrentWeather } from '../../src/app/types/weather';

describe('WeatherBackgroundComponent', () => {
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

  it('renders default background when no weather', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: null,
        isLoading: false
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-default');
  });

  it('renders sunny background for clear weather during day', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: mockWeather,
        isLoading: false,
        currentHour: 12
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-sunny');
  });

  it('renders starry night background for clear weather at night', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: { ...mockWeather, condition: 'Clear' },
        isLoading: false,
        currentHour: 22
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-starry-night');
  });

  it('renders cloudy background for cloudy weather', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: { ...mockWeather, condition: 'Clouds' },
        isLoading: false,
        currentHour: 12
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-cloudy-day');
  });

  it('renders rainy background for rainy weather', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: { ...mockWeather, condition: 'Rain' },
        isLoading: false,
        currentHour: 12
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-rainy-day');
  });

  it('renders snowy background for snowy weather', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: { ...mockWeather, condition: 'Snow' },
        isLoading: false,
        currentHour: 12
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-snowy-day');
  });

  it('renders stormy background for thunderstorm', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: { ...mockWeather, condition: 'Thunderstorm' },
        isLoading: false,
        currentHour: 12
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-stormy');
  });

  it('renders foggy background for misty weather', () => {
    cy.mount(WeatherBackgroundComponent, {
      componentProperties: {
        weather: { ...mockWeather, condition: 'Mist' },
        isLoading: false,
        currentHour: 12
      }
    });

    cy.get('.weather-background').should('have.class', 'bg-foggy');
  });
});
