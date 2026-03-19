import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './city-search';
import './current-weather';
import './forecast-list';
import './history-list';
import './weather-background';
import { fetchCurrentWeather, fetchForecast, fetchHistory } from '../services/weatherApi';
import type { CurrentWeather, Forecast, History } from '../types/weather';

@customElement('weather-app')
export class WeatherApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .container {
      min-height: 100vh;
      padding: 2rem 1rem;
      position: relative;
    }
    
    .max-w-4xl {
      max-width: 56rem;
      margin: 0 auto;
    }
    
    .text-4xl {
      font-size: 2.25rem;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .text-white {
      color: white;
    }
    
    .text-center {
      text-align: center;
    }
    
    .mb-8 {
      margin-bottom: 2rem;
    }
    
    .drop-shadow {
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    
    .bg-white-90 {
      background: rgba(255, 255, 255, 0.9);
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }
    
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    
    .bg-red-100 {
      background: #fef2f2;
    }
    
    .border-red-400 {
      border-color: #f87171;
    }
    
    .text-red-700 {
      color: #b91c1c;
    }
    
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    
    .rounded {
      border-radius: 0.25rem;
    }
    
    .mb-6 {
      margin-bottom: 1.5rem;
    }
  `;

  static properties = {
    currentWeather: { state: true },
    forecast: { state: true },
    history: { state: true },
    loading: { state: true },
    error: { state: true },
  };

  currentWeather: CurrentWeather | null = null;
  forecast: Forecast | null = null;
  history: History | null = null;
  loading = false;
  error: string | null = null;

  handleSearch = (city: string) => {
    this.loading = true;
    this.error = null;

    Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
      fetchHistory(city),
    ]).then(([weatherData, forecastData, historyData]) => {
      this.currentWeather = weatherData;
      this.forecast = forecastData;
      this.history = historyData;
      this.loading = false;
    }).catch((err) => {
      this.error = err instanceof Error ? err.message : 'Failed to fetch weather data';
      this.loading = false;
    });
  };

  render() {
    return html`
      <weather-background .weather=${this.currentWeather} .isLoading=${this.loading}></weather-background>
      <div class="container">
        <div class="max-w-4xl">
          <h1 class="text-4xl font-bold text-white text-center mb-8 drop-shadow" data-cy="app-title">
            Weather App
          </h1>
          
          <div class="bg-white-90" data-cy="search-section">
            <city-search .onSearch=${this.handleSearch} .loading=${this.loading}></city-search>
          </div>

          ${this.error ? html`
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" data-cy="error-message">
              ${this.error}
            </div>
          ` : ''}

          <div class="space-y-6" data-cy="weather-content">
            <current-weather 
              data-cy="current-weather-component"
              .weather=${this.currentWeather} 
              .loading=${this.loading} 
              .error=${this.error}
            ></current-weather>
            
            <forecast-list 
              data-cy="forecast-list-component"
              .forecast=${this.forecast} 
              .loading=${this.loading} 
              .error=${this.error}
            ></forecast-list>
            
            <history-list 
              data-cy="history-list-component"
              .history=${this.history} 
              .loading=${this.loading} 
              .error=${this.error}
            ></history-list>
          </div>
        </div>
      </div>
    `;
  }
}
