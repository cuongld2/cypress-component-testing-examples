import { Component, signal } from '@angular/core';
import { CitySearchComponent } from './components/city-search.component';
import { CurrentWeatherComponent } from './components/current-weather.component';
import { ForecastListComponent } from './components/forecast-list.component';
import { HistoryListComponent } from './components/history-list.component';
import { WeatherBackgroundComponent } from './components/weather-background.component';
import { CurrentWeather, Forecast, History } from './types/weather';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CitySearchComponent,
    CurrentWeatherComponent,
    ForecastListComponent,
    HistoryListComponent,
    WeatherBackgroundComponent
  ],
  template: `
    <app-weather-background [weather]="currentWeather()" [isLoading]="loading()" />
    <div class="min-h-screen py-8 px-4 relative">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg" data-cy="app-title">
          Weather App
        </h1>
        
        <div class="mb-8" data-cy="search-section">
          <app-city-search (search)="onSearch($event)" [loading]="loading()" />
        </div>

        @if (error()) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" data-cy="error-message">
            {{ error() }}
          </div>
        }

        <div class="space-y-6" data-cy="weather-content">
          <app-current-weather 
            [weather]="currentWeather()" 
            [loading]="loading()" 
            [error]="error()" 
          />
          
          <app-forecast-list 
            [forecast]="forecast()" 
            [loading]="loading()" 
            [error]="error()" 
          />
          
          <app-history-list 
            [history]="history()" 
            [loading]="loading()" 
            [error]="error()" 
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
  currentWeather = signal<CurrentWeather | null>(null);
  forecast = signal<Forecast | null>(null);
  history = signal<History | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async onSearch(city: string) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const baseUrl = environment.apiUrl;
      
      const [weatherRes, forecastRes, historyRes] = await Promise.all([
        fetch(`${baseUrl}/current?city=${encodeURIComponent(city)}`),
        fetch(`${baseUrl}/forecast?city=${encodeURIComponent(city)}`),
        fetch(`${baseUrl}/history?city=${encodeURIComponent(city)}`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch weather data');
      }

      this.currentWeather.set(await weatherRes.json());
      this.forecast.set(await forecastRes.json());
      this.history.set(await historyRes.json());
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      this.loading.set(false);
    }
  }
}
