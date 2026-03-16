import { WeatherBackground } from '@/components/weather/WeatherBackground';
import { CurrentWeather as CurrentWeatherType } from '@/types/weather';

const mockClearWeather: CurrentWeatherType = {
  city: 'New York',
  country: 'US',
  temperature: 22,
  condition: 'Clear',
  humidity: 65,
  wind_speed: 5.5,
  feels_like: 24,
  icon: '01d',
};

const mockRainWeather: CurrentWeatherType = {
  city: 'London',
  country: 'GB',
  temperature: 12,
  condition: 'Rain',
  humidity: 85,
  wind_speed: 8.0,
  feels_like: 10,
  icon: '10d',
};

const mockSnowWeather: CurrentWeatherType = {
  city: 'Moscow',
  country: 'RU',
  temperature: -5,
  condition: 'Snow',
  humidity: 75,
  wind_speed: 3.0,
  feels_like: -8,
  icon: '13d',
};

const mockStormWeather: CurrentWeatherType = {
  city: 'Miami',
  country: 'US',
  temperature: 28,
  condition: 'Thunderstorm',
  humidity: 90,
  wind_speed: 15.0,
  feels_like: 32,
  icon: '11d',
};

describe('WeatherBackground', () => {
  it('renders default background when no weather data', () => {
    cy.mount(<WeatherBackground weather={null} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-default');
  });

  it('renders sunny background for clear weather during day', () => {
    cy.stub(Date.prototype, 'getHours').returns(14);
    cy.mount(<WeatherBackground weather={mockClearWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-sunny');
  });

  it('renders starry night background for clear weather at night', () => {
    cy.stub(Date.prototype, 'getHours').returns(22);
    cy.mount(<WeatherBackground weather={mockClearWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-starry-night');
  });

  it('renders rainy background for rain weather', () => {
    cy.stub(Date.prototype, 'getHours').returns(14);
    cy.mount(<WeatherBackground weather={mockRainWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-rainy-day');
    cy.get('.rain').should('exist');
  });

  it('renders snowy background for snow weather', () => {
    cy.stub(Date.prototype, 'getHours').returns(14);
    cy.mount(<WeatherBackground weather={mockSnowWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-snowy-day');
    cy.get('.snowflakes').should('exist');
  });

  it('renders stormy background for thunderstorm', () => {
    cy.stub(Date.prototype, 'getHours').returns(18);
    cy.mount(<WeatherBackground weather={mockStormWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-stormy');
    cy.get('.lightning').should('exist');
  });

  it('renders morning background in the morning', () => {
    cy.stub(Date.prototype, 'getHours').returns(8);
    cy.mount(<WeatherBackground weather={mockClearWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-sunny');
  });

  it('renders evening background in the evening', () => {
    cy.stub(Date.prototype, 'getHours').returns(18);
    const eveningWeather = { ...mockClearWeather };
    cy.mount(<WeatherBackground weather={eveningWeather} isLoading={false} />);
    cy.get('.weather-background').should('have.class', 'bg-evening');
  });
});
