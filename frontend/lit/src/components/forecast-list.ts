import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Forecast } from '../types/weather';

@customElement('forecast-list')
export class ForecastListComponent extends LitElement {
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
    
    .text-center {
      text-align: center;
    }
    
    .p-3 {
      padding: 0.75rem;
    }
    
    .bg-gray {
      background: #f9fafb;
      border-radius: 0.5rem;
    }
    
    .grid-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
    }
    
    .text-sm {
      font-size: 0.875rem;
    }
    
    .text-lg {
      font-size: 1.125rem;
    }
    
    .font-medium {
      font-weight: 500;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .text-xs {
      font-size: 0.75rem;
    }
    
    .text-gray-600 {
      color: #4b5563;
    }
    
    img {
      width: 3rem;
      height: 3rem;
      margin: 0 auto;
    }

    @media (max-width: 640px) {
      .grid-5 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  @property({ type: Object, attribute: false })
  forecast: Forecast | null = null;

  @property({ type: Boolean, attribute: false })
  loading = false;

  @property({ type: String, attribute: false })
  error: string | null = null;

  render() {
    return html`
      <div class="card">
        <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
        
        ${this.loading ? html`
          <div class="text-gray">Loading forecast...</div>
        ` : this.error ? html`
          <div class="text-red">${this.error}</div>
        ` : !this.forecast || !this.forecast.forecast.length ? html`
          <div class="text-gray">No forecast data available</div>
        ` : html`
          <div class="grid-5">
            ${this.forecast.forecast.map((day, index) => html`
              <div class="text-center p-3 bg-gray" data-cy="forecast-day-${index}">
                <p class="text-sm font-medium" data-cy="forecast-date-${index}">${day.date}</p>
                <img 
                  src="https://openweathermap.org/img/wn/${day.icon}.png" 
                  alt=${day.condition}
                  data-cy="forecast-icon-${index}"
                />
                <p class="text-lg font-bold" data-cy="forecast-temp-${index}">
                  ${Math.round(day.temp_max)}° / ${Math.round(day.temp_min)}°
                </p>
                <p class="text-xs text-gray-600" data-cy="forecast-condition-${index}">${day.condition}</p>
                <p class="text-xs text-gray-600" data-cy="forecast-precip-${index}">${day.precipitation}%</p>
              </div>
            `)}
          </div>
        `}
      </div>
    `;
  }
}
