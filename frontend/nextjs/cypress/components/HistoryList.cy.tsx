import { HistoryList } from '@/components/weather/HistoryList';

const mockHistory = {
  city: 'New York',
  country: 'US',
  history: [
    { date: '2024-03-15', temperature: 20, condition: 'Clear', humidity: 60, wind_speed: 4.5, icon: '01d' },
    { date: '2024-03-14', temperature: 18, condition: 'Clouds', humidity: 70, wind_speed: 6.0, icon: '02d' },
    { date: '2024-03-13', temperature: 15, condition: 'Rain', humidity: 85, wind_speed: 8.5, icon: '10d' },
  ],
};

describe('HistoryList', () => {
  it('shows loading state', () => {
    cy.mount(<HistoryList history={null} loading={true} error={null} />);
    cy.contains('Loading history...').should('be.visible');
  });

  it('shows error state', () => {
    cy.mount(<HistoryList history={null} loading={false} error="Failed to fetch" />);
    cy.contains('Failed to fetch').should('be.visible');
  });

  it('shows empty state', () => {
    cy.mount(<HistoryList history={null} loading={false} error={null} />);
    cy.contains('No history data available').should('be.visible');
  });

  it('displays history data correctly', () => {
    cy.mount(<HistoryList history={mockHistory} loading={false} error={null} />);
    
    cy.get('[data-cy="history"]').should('be.visible');
    cy.get('[data-cy="history-day-0"]').should('be.visible');
    cy.get('[data-cy="history-date-0"]').should('contain', '2024-03-15');
    cy.get('[data-cy="history-temp-0"]').should('contain', '20°C');
  });
});
