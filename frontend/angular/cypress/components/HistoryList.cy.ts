import { HistoryListComponent } from '../../src/app/components/history-list.component';
import { History } from '../../src/app/types/weather';

describe('HistoryListComponent', () => {
  const mockHistory: History = {
    city: 'Singapore',
    country: 'SG',
    history: [
      { date: '2024-01-07', temperature: 28, condition: 'Clear', humidity: 70, wind_speed: 3.0, icon: '01d' },
      { date: '2024-01-06', temperature: 27, condition: 'Clouds', humidity: 75, wind_speed: 2.5, icon: '02d' },
      { date: '2024-01-05', temperature: 26, condition: 'Rain', humidity: 85, wind_speed: 4.0, icon: '10d' },
      { date: '2024-01-04', temperature: 29, condition: 'Clear', humidity: 65, wind_speed: 2.0, icon: '01d' },
      { date: '2024-01-03', temperature: 28, condition: 'Clouds', humidity: 72, wind_speed: 3.5, icon: '03d' },
      { date: '2024-01-02', temperature: 27, condition: 'Clear', humidity: 68, wind_speed: 2.8, icon: '01d' },
      { date: '2024-01-01', temperature: 26, condition: 'Rain', humidity: 80, wind_speed: 4.5, icon: '10d' }
    ]
  };

  it('renders placeholder when no history data', () => {
    cy.mount(HistoryListComponent, {
      componentProperties: {
        history: null,
        loading: false,
        error: null
      }
    });

    cy.contains('No history data available').should('be.visible');
  });

  it('renders loading state', () => {
    cy.mount(HistoryListComponent, {
      componentProperties: {
        history: null,
        loading: true,
        error: null
      }
    });

    cy.contains('Loading history...').should('be.visible');
  });

  it('renders error state', () => {
    cy.mount(HistoryListComponent, {
      componentProperties: {
        history: null,
        loading: false,
        error: 'Failed to fetch history'
      }
    });

    cy.contains('Failed to fetch history').should('be.visible');
  });

  it('renders history data correctly', () => {
    cy.mount(HistoryListComponent, {
      componentProperties: {
        history: mockHistory,
        loading: false,
        error: null
      }
    });

    cy.get('[data-cy="history"]').should('be.visible');
    cy.get('[data-cy="history-day-0"]').should('be.visible');
    cy.get('[data-cy="history-date-0"]').should('contain', '2024-01-07');
    cy.get('[data-cy="history-condition-0"]').should('contain', 'Clear');
    cy.get('[data-cy="history-temp-0"]').should('contain', '28°C');
    cy.get('[data-cy="history-icon-0"]').should('be.visible');
  });

  it('renders all 7 history days', () => {
    cy.mount(HistoryListComponent, {
      componentProperties: {
        history: mockHistory,
        loading: false,
        error: null
      }
    });

    cy.get('[data-cy^="history-day-"]').should('have.length', 7);
  });
});
