import { html } from 'lit';
import '../../src/components/history-list';

const mockHistory = {
  city: 'London',
  country: 'GB',
  history: [
    { date: '2024-03-15', temperature: 12, condition: 'Clouds', humidity: 70, wind_speed: 4.5, icon: '02d' },
    { date: '2024-03-14', temperature: 10, condition: 'Rain', humidity: 80, wind_speed: 6.0, icon: '10d' },
    { date: '2024-03-13', temperature: 8, condition: 'Clear', humidity: 65, wind_speed: 3.5, icon: '01d' },
  ],
};

describe('HistoryList', () => {
  it('shows loading state', () => {
    cy.mount(html`
      <history-list .history=${null} .loading=${true} .error=${null}></history-list>
    `);
    cy.get('history-list').shadow().find('.text-gray').should('contain', 'Loading history...');
  });

  it('shows error state', () => {
    cy.mount(html`
      <history-list .history=${null} .loading=${false} .error=${'Failed to fetch'}></history-list>
    `);
    cy.get('history-list').shadow().find('.text-red').should('contain', 'Failed to fetch');
  });

  it('shows empty state', () => {
    cy.mount(html`
      <history-list .history=${null} .loading=${false} .error=${null}></history-list>
    `);
    cy.get('history-list').shadow().find('.text-gray').should('contain', 'No history data available');
  });

  it('displays history data correctly', () => {
    cy.mount(html`
      <history-list .history=${mockHistory} .loading=${false} .error=${null}></history-list>
    `);
    
    cy.get('history-list').shadow().find('[data-cy="history-day-0"]').should('contain', '2024-03-15');
    cy.get('history-list').shadow().find('[data-cy="history-day-0"]').should('contain', '12°C');
  });
});
