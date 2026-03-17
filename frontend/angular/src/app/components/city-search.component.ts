import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City, searchCities } from '../data/capitals';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative" data-cy="city-search">
      <form (submit)="onSubmit($event)" class="flex gap-2" data-cy="city-search-form">
        <div class="relative flex-1">
          <input
            type="text"
            [(ngModel)]="query"
            name="city"
            (input)="onInput()"
            (keydown)="onKeyDown($event)"
            (focus)="onFocus()"
            placeholder="Search for a city..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-cy="city-input"
            autocomplete="off"
          />
        </div>
        <button
          type="submit"
          [disabled]="loading || !query.trim()"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          data-cy="search-button"
        >
          {{ loading ? 'Searching...' : 'Search' }}
        </button>
      </form>

      @if (showSuggestions && suggestions.length > 0) {
        <ul 
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          data-cy="city-suggestions"
        >
          @for (city of suggestions; track city.name + city.countryCode; let i = $index) {
            <li
              (click)="selectCity(city)"
              class="px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between"
              [class.bg-blue-50]="i === selectedIndex"
              [attr.data-cy]="'city-suggestion-' + i"
            >
              <div>
                <span class="font-medium text-gray-900">{{ city.name }}</span>
                <span class="text-gray-500 text-sm ml-2">{{ city.country }}</span>
              </div>
              <span class="text-xs text-gray-400">{{ city.countryCode }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CitySearchComponent {
  @Input() loading: boolean = false;
  @Output() search = new EventEmitter<string>();

  query = '';
  suggestions: City[] = [];
  showSuggestions = false;
  selectedIndex = -1;

  onInput() {
    this.selectedIndex = -1;
    if (this.query.trim()) {
      this.suggestions = searchCities(this.query);
      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  onFocus() {
    if (this.query.trim() && this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  selectCity(city: City) {
    this.query = city.name;
    this.showSuggestions = false;
    this.suggestions = [];
    this.search.emit(city.name);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
        this.selectCity(this.suggestions[this.selectedIndex]);
      } else if (this.query.trim()) {
        this.search.emit(this.query.trim());
        this.showSuggestions = false;
      }
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
      this.selectCity(this.suggestions[this.selectedIndex]);
    } else if (this.query.trim()) {
      this.search.emit(this.query.trim());
      this.showSuggestions = false;
    }
  }
}
