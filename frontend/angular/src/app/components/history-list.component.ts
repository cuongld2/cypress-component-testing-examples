import { Component, Input } from '@angular/core';
import { History as HistoryType } from '../types/weather';

@Component({
  selector: 'app-history-list',
  standalone: true,
  template: `
    @if (loading) {
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div class="text-gray-500">Loading history...</div>
      </div>
    } @else if (error) {
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div class="text-red-500">{{ error }}</div>
      </div>
    } @else if (!history || !history.history.length) {
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div class="text-gray-500">No history data available</div>
      </div>
    } @else {
      <div class="bg-white rounded-lg shadow-md p-6" data-cy="history">
        <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div class="space-y-3">
          @for (day of history.history; track day.date; let i = $index) {
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg" [attr.data-cy]="'history-day-' + i">
              <div class="flex items-center gap-3">
                <img 
                  [src]="'https://openweathermap.org/img/wn/' + day.icon + '.png'" 
                  [alt]="day.condition"
                  class="w-10 h-10"
                  [attr.data-cy]="'history-icon-' + i"
                />
                <div>
                  <p class="font-medium" [attr.data-cy]="'history-date-' + i">{{ day.date }}</p>
                  <p class="text-sm text-gray-600" [attr.data-cy]="'history-condition-' + i">{{ day.condition }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold" [attr.data-cy]="'history-temp-' + i">{{ round(day.temperature) }}°C</p>
                <p class="text-xs text-gray-600">💧 {{ day.humidity }}%</p>
              </div>
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
export class HistoryListComponent {
  @Input() history: HistoryType | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  round(value: number): number {
    return Math.round(value);
  }
}
