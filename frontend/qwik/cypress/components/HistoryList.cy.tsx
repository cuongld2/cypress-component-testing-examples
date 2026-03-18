import { HistoryList } from '~/components/HistoryList';
import type { History } from '~/types/weather';

const mockHistory: History = {
  city: 'New York',
  country: 'US',
  history: [
    { date: '2024-01-01', temperature: 15, condition: 'Clear', humidity: 60, wind_speed: 3.5, icon: '01d' },
    { date: '2024-01-02', temperature: 18, condition: 'Clouds', humidity: 65, wind_speed: 4.2, icon: '04d' },
    { date: '2024-01-03', temperature: 12, condition: 'Rain', humidity: 80, wind_speed: 6.1, icon: '10d' },
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
    
    cy.get('[data-cy="history-day-0"]').should('contain', '2024-01-01');
    cy.get('[data-cy="history-day-0"]').should('contain', '15°C');
  });

  it('displays all history days', () => {
    cy.mount(<HistoryList history={mockHistory} loading={false} error={null} />);
    
    cy.get('[data-cy="history-day-0"]').should('exist');
    cy.get('[data-cy="history-day-1"]').should('exist');
    cy.get('[data-cy="history-day-2"]').should('exist');
  });
});