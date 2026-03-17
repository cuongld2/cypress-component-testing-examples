import { Component, Input } from '@angular/core';
import { CurrentWeather as CurrentWeatherType } from '../types/weather';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  template: `
    @if (loading) {
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div class="text-gray-500">Loading current weather...</div>
      </div>
    } @else if (error) {
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div class="text-red-500">{{ error }}</div>
      </div>
    } @else if (!weather) {
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div class="text-gray-500">Search for a city to see weather</div>
      </div>
    } @else {
      <div class="bg-white rounded-lg shadow-md p-6" data-cy="current-weather">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold" data-cy="weather-city">{{ weather.city }}, {{ weather.country }}</h2>
            <p class="text-gray-600" data-cy="weather-condition">{{ weather.condition }}</p>
          </div>
          <img [src]="iconUrl" [alt]="weather.condition" class="w-20 h-20" data-cy="weather-icon" />
        </div>
        <div class="mt-4">
          <div class="text-5xl font-bold" data-cy="weather-temp">{{ round(weather.temperature) }}°C</div>
          <p class="text-gray-600 mt-1">Feels like {{ round(weather.feels_like) }}°C</p>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded p-3">
            <p class="text-sm text-gray-600">Humidity</p>
            <p class="font-semibold" data-cy="weather-humidity">{{ weather.humidity }}%</p>
          </div>
          <div class="bg-gray-50 rounded p-3">
            <p class="text-sm text-gray-600">Wind Speed</p>
            <p class="font-semibold" data-cy="weather-wind">{{ weather.wind_speed }} m/s</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CurrentWeatherComponent {
  @Input() weather: CurrentWeatherType | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  get iconUrl(): string {
    return this.weather ? `https://openweathermap.org/img/wn/${this.weather.icon}@2x.png` : '';
  }

  round(value: number): number {
    return Math.round(value);
  }
}
