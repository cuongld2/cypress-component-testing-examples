import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { History } from '../types/weather';

@customElement('history-list')
export class HistoryListComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .text-xl {
      font-size: 1.25rem;
    }
    
    .font-semibold {
      font-weight: 600;
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .text-gray {
      color: #6b7280;
    }
    
    .text-red {
      color: #ef4444;
    }
    
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
    
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .flex {
      display: flex;
    }
    
    .gap-3 {
      gap: 0.75rem;
    }
    
    .p-3 {
      padding: 0.75rem;
    }
    
    .bg-gray {
      background: #f9fafb;
      border-radius: 0.5rem;
    }
    
    .font-medium {
      font-weight: 500;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .text-sm {
      font-size: 0.875rem;
    }
    
    .text-gray-600 {
      color: #4b5563;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-xs {
      font-size: 0.75rem;
    }
    
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
  `;

  @property({ type: Object, attribute: false })
  history: History | null = null;

  @property({ type: Boolean, attribute: false })
  loading = false;

  @property({ type: String, attribute: false })
  error: string | null = null;

  render() {
    return html`
      <div class="card">
        <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        
        ${this.loading ? html`
          <div class="text-gray">Loading history...</div>
        ` : this.error ? html`
          <div class="text-red">${this.error}</div>
        ` : !this.history || !this.history.history.length ? html`
          <div class="text-gray">No history data available</div>
        ` : html`
          <div class="space-y-3">
            ${this.history.history.map((day, index) => html`
              <div class="flex-between p-3 bg-gray" data-cy="history-day-${index}">
                <div class="flex gap-3">
                  <img 
                    src="https://openweathermap.org/img/wn/${day.icon}.png" 
                    alt=${day.condition}
                    data-cy="history-icon-${index}"
                  />
                  <div>
                    <p class="font-medium" data-cy="history-date-${index}">${day.date}</p>
                    <p class="text-sm text-gray-600" data-cy="history-condition-${index}">${day.condition}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold" data-cy="history-temp-${index}">${Math.round(day.temperature)}°C</p>
                  <p class="text-xs text-gray-600">${day.humidity}%</p>
                </div>
              </div>
            `)}
          </div>
        `}
      </div>
    `;
  }
}
