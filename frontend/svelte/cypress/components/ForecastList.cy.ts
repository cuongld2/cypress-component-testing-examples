import ForecastList from '../../src/lib/components/ForecastList.svelte';
import type { Forecast } from '../../src/lib/types/weather';

const mockForecast: Forecast = {
  city: 'New York',
  country: 'US',
  forecast: [
    { date: 'Monday', temp_max: 25, temp_min: 18, condition: 'Clear', icon: '01d', precipitation: 10 },
    { date: 'Tuesday', temp_max: 23, temp_min: 16, condition: 'Clouds', icon: '04d', precipitation: 20 },
    { date: 'Wednesday', temp_max: 20, temp_min: 14, condition: 'Rain', icon: '10d', precipitation: 80 },
    { date: 'Thursday', temp_max: 22, temp_min: 15, condition: 'Clear', icon: '01d', precipitation: 5 },
    { date: 'Friday', temp_max: 24, temp_min: 17, condition: 'Clouds', icon: '03d', precipitation: 15 },
  ],
};

describe('ForecastList', () => {
  it('shows loading state', () => {
    cy.mount(ForecastList, { props: { forecast: null, loading: true, error: null } });
    cy.contains('Loading forecast...').should('be.visible');
  });

  it('shows error state', () => {
    cy.mount(ForecastList, { props: { forecast: null, loading: false, error: 'Failed to fetch' } });
    cy.contains('Failed to fetch').should('be.visible');
  });

  it('shows empty state', () => {
    cy.mount(ForecastList, { props: { forecast: null, loading: false, error: null } });
    cy.contains('No forecast data available').should('be.visible');
  });

  it('displays forecast data correctly', () => {
    cy.mount(ForecastList, { props: { forecast: mockForecast, loading: false, error: null } });
    
    cy.get('[data-cy="forecast-day-0"]').should('contain', 'Monday');
    cy.get('[data-cy="forecast-day-0"]').should('contain', '25° / 18°');
  });

  it('displays all 5 days of forecast', () => {
    cy.mount(ForecastList, { props: { forecast: mockForecast, loading: false, error: null } });
    
    cy.get('[data-cy="forecast-day-0"]').should('exist');
    cy.get('[data-cy="forecast-day-1"]').should('exist');
    cy.get('[data-cy="forecast-day-2"]').should('exist');
    cy.get('[data-cy="forecast-day-3"]').should('exist');
    cy.get('[data-cy="forecast-day-4"]').should('exist');
  });
});