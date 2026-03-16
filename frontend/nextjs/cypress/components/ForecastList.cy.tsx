import { ForecastList } from '@/components/weather/ForecastList';

const mockForecast = {
  city: 'New York',
  country: 'US',
  forecast: [
    { date: '2024-03-17', temp_max: 25, temp_min: 15, condition: 'Clear', icon: '01d', precipitation: 10 },
    { date: '2024-03-18', temp_max: 22, temp_min: 12, condition: 'Clouds', icon: '02d', precipitation: 20 },
    { date: '2024-03-19', temp_max: 18, temp_min: 10, condition: 'Rain', icon: '10d', precipitation: 80 },
    { date: '2024-03-20', temp_max: 20, temp_min: 11, condition: 'Clear', icon: '01d', precipitation: 5 },
    { date: '2024-03-21', temp_max: 23, temp_min: 14, condition: 'Clouds', icon: '03d', precipitation: 15 },
  ],
};

describe('ForecastList', () => {
  it('shows loading state', () => {
    cy.mount(<ForecastList forecast={null} loading={true} error={null} />);
    cy.contains('Loading forecast...').should('be.visible');
  });

  it('shows error state', () => {
    cy.mount(<ForecastList forecast={null} loading={false} error="Failed to fetch" />);
    cy.contains('Failed to fetch').should('be.visible');
  });

  it('shows empty state', () => {
    cy.mount(<ForecastList forecast={null} loading={false} error={null} />);
    cy.contains('No forecast data available').should('be.visible');
  });

  it('displays forecast data correctly', () => {
    cy.mount(<ForecastList forecast={mockForecast} loading={false} error={null} />);
    
    cy.get('[data-cy="forecast"]').should('be.visible');
    cy.get('[data-cy="forecast-day-0"]').should('be.visible');
    cy.get('[data-cy="forecast-date-0"]').should('contain', '2024-03-17');
    cy.get('[data-cy="forecast-temp-0"]').should('contain', '25° / 15°');
  });
});
