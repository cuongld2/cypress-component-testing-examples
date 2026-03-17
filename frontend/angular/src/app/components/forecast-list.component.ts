import { Component, Input } from '@angular/core';
import { Forecast as ForecastType } from '../types/weather';

@Component({
  selector: 'app-forecast-list',
  standalone: true,
  template: `
    @if (loading) {
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div class="text-gray-500">Loading forecast...</div>
      </div>
    } @else if (error) {
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div class="text-red-500">{{ error }}</div>
      </div>
    } @else if (!forecast || !forecast.forecast.length) {
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div class="text-gray-500">No forecast data available</div>
      </div>
    } @else {
      <div class="bg-white rounded-lg shadow-md p-6" data-cy="forecast">
        <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
          @for (day of forecast.forecast; track day.date; let i = $index) {
            <div class="text-center p-3 bg-gray-50 rounded-lg" [attr.data-cy]="'forecast-day-' + i">
              <p class="text-sm font-medium" [attr.data-cy]="'forecast-date-' + i">{{ day.date }}</p>
              <img 
                [src]="'https://openweathermap.org/img/wn/' + day.icon + '.png'" 
                [alt]="day.condition"
                class="w-12 h-12 mx-auto"
                [attr.data-cy]="'forecast-icon-' + i"
              />
              <p class="text-lg font-bold" [attr.data-cy]="'forecast-temp-' + i">{{ round(day.temp_max) }}° / {{ round(day.temp_min) }}°</p>
              <p class="text-xs text-gray-600" [attr.data-cy]="'forecast-condition-' + i">{{ day.condition }}</p>
              <p class="text-xs text-gray-500" [attr.data-cy]="'forecast-precip-' + i">{{ day.precipitation }}%</p>
            </div>
          }
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
export class ForecastListComponent {
  @Input() forecast: ForecastType | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  round(value: number): number {
    return Math.round(value);
  }
}
