import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CurrentWeather } from '../types/weather';

@customElement('current-weather')
export class CurrentWeatherComponent extends LitElement {
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
    
    .center {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 16rem;
    }
    
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .text-gray {
      color: #6b7280;
    }
    
    .text-red {
      color: #ef4444;
    }
    
    .text-2xl {
      font-size: 1.5rem;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .text-5xl {
      font-size: 3rem;
    }
    
    .mt-4 {
      margin-top: 1rem;
    }
    
    .mt-6 {
      margin-top: 1.5rem;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .bg-gray {
      background: #f9fafb;
      padding: 0.75rem;
      border-radius: 0.25rem;
    }
    
    .text-sm {
      font-size: 0.875rem;
    }
    
    .font-semibold {
      font-weight: 600;
    }
    
    img {
      width: 5rem;
      height: 5rem;
    }
  `;

  @property({ type: Object, attribute: false })
  weather: CurrentWeather | null = null;

  @property({ type: Boolean, attribute: false })
  loading = false;

  @property({ type: String, attribute: false })
  error: string | null = null;

  render() {
    if (this.loading) {
      return html`
        <div class="card center">
          <div class="text-gray">Loading current weather...</div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="card center">
          <div class="text-red">${this.error}</div>
        </div>
      `;
    }

    if (!this.weather) {
      return html`
        <div class="card center">
          <div class="text-gray">Search for a city to see weather</div>
        </div>
      `;
    }

    return html`
      <div class="card" data-cy="current-weather">
        <div class="flex-between">
          <div>
            <h2 class="text-2xl font-bold" data-cy="weather-city">
              ${this.weather.city}, ${this.weather.country}
            </h2>
            <p class="text-gray" data-cy="weather-condition">${this.weather.condition}</p>
          </div>
          <img 
            src="https://openweathermap.org/img/wn/${this.weather.icon}@2x.png" 
            alt=${this.weather.condition}
            data-cy="weather-icon"
          />
        </div>
        <div class="mt-4">
          <div class="text-5xl font-bold" data-cy="weather-temp">
            ${Math.round(this.weather.temperature)}°C
          </div>
          <p class="text-gray mt-4">Feels like ${Math.round(this.weather.feels_like)}°C</p>
        </div>
        <div class="mt-6 grid-2">
          <div class="bg-gray">
            <p class="text-sm text-gray">Humidity</p>
            <p class="font-semibold" data-cy="weather-humidity">${this.weather.humidity}%</p>
          </div>
          <div class="bg-gray">
            <p class="text-sm text-gray">Wind Speed</p>
            <p class="font-semibold" data-cy="weather-wind">${this.weather.wind_speed} m/s</p>
          </div>
        </div>
      </div>
    `;
  }
}
