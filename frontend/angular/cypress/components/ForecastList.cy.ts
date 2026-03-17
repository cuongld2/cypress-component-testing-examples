import { ForecastListComponent } from '../../src/app/components/forecast-list.component';
import { Forecast } from '../../src/app/types/weather';

describe('ForecastListComponent', () => {
  const mockForecast: Forecast = {
    city: 'Singapore',
    country: 'SG',
    forecast: [
      { date: '2024-01-01', temp_max: 30, temp_min: 25, condition: 'Clear', icon: '01d', precipitation: 10 },
      { date: '2024-01-02', temp_max: 29, temp_min: 24, condition: 'Clouds', icon: '02d', precipitation: 20 },
      { date: '2024-01-03', temp_max: 28, temp_min: 23, condition: 'Rain', icon: '10d', precipitation: 80 },
      { date: '2024-01-04', temp_max: 27, temp_min: 22, condition: 'Clear', icon: '01d', precipitation: 5 },
      { date: '2024-01-05', temp_max: 26, temp_min: 21, condition: 'Clouds', icon: '03d', precipitation: 15 }
    ]
  };

  it('renders placeholder when no forecast data', () => {
    cy.mount(ForecastListComponent, {
      componentProperties: {
        forecast: null,
        loading: false,
        error: null
      }
    });

    cy.contains('No forecast data available').should('be.visible');
  });

  it('renders loading state', () => {
    cy.mount(ForecastListComponent, {
      componentProperties: {
        forecast: null,
        loading: true,
        error: null
      }
    });

    cy.contains('Loading forecast...').should('be.visible');
  });

  it('renders error state', () => {
    cy.mount(ForecastListComponent, {
      componentProperties: {
        forecast: null,
        loading: false,
        error: 'Failed to fetch forecast'
      }
    });

    cy.contains('Failed to fetch forecast').should('be.visible');
  });

  it('renders forecast data correctly', () => {
    cy.mount(ForecastListComponent, {
      componentProperties: {
        forecast: mockForecast,
        loading: false,
        error: null
      }
    });

    cy.get('[data-cy="forecast"]').should('be.visible');
    cy.get('[data-cy="forecast-day-0"]').should('be.visible');
    cy.get('[data-cy="forecast-date-0"]').should('contain', '2024-01-01');
    cy.get('[data-cy="forecast-temp-0"]').should('contain', '30° / 25°');
    cy.get('[data-cy="forecast-icon-0"]').should('be.visible');
  });

  it('renders all 5 forecast days', () => {
    cy.mount(ForecastListComponent, {
      componentProperties: {
        forecast: mockForecast,
        loading: false,
        error: null
      }
    });

    cy.get('[data-cy^="forecast-day-"]').should('have.length', 5);
  });
});
