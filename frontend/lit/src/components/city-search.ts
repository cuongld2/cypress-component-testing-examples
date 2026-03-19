import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { searchCities, type City } from '../data/capitals';

@customElement('city-search')
export class CitySearch extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .relative {
      position: relative;
    }
    
    .flex {
      display: flex;
    }
    
    .gap-2 {
      gap: 0.5rem;
    }
    
    .flex-1 {
      flex: 1;
    }
    
    .relative-flex {
      position: relative;
      flex: 1;
    }
    
    input {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      outline: none;
    }
    
    input:focus {
      ring: 2px;
      ring-color: #3b82f6;
    }
    
    button {
      padding: 0.5rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    
    button:hover:not(:disabled) {
      background: #2563eb;
    }
    
    button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    
    ul {
      position: absolute;
      z-index: 10;
      width: 100%;
      margin: 0.25rem 0 0 0;
      padding: 0;
      list-style: none;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-height: 20rem;
      overflow-y: auto;
    }
    
    li {
      padding: 0.75rem 1rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    li:hover, li.selected {
      background: #eff6ff;
    }
    
    .city-name {
      font-weight: 500;
      color: #111827;
    }
    
    .country-name {
      color: #6b7280;
      font-size: 0.875rem;
      margin-left: 0.5rem;
    }
    
    .country-code {
      color: #9ca3af;
      font-size: 0.75rem;
    }
  `;

  @property({ type: Function, attribute: false })
  onSearch: (city: string) => void = () => {};

  @property({ type: Boolean, attribute: false })
  loading = false;

  @state()
  private query = '';

  @state()
  private suggestions: City[] = [];

  @state()
  private showSuggestions = false;

  @state()
  private selectedIndex = -1;

  private handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.query = value;
    this.selectedIndex = -1;
    
    if (value.trim()) {
      this.suggestions = searchCities(value);
      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  private handleSelectCity = (city: City) => {
    this.query = city.name;
    this.showSuggestions = false;
    this.suggestions = [];
    this.onSearch(city.name);
  };

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
      this.handleSelectCity(this.suggestions[this.selectedIndex]);
    } else if (this.query.trim()) {
      this.onSearch(this.query.trim());
      this.showSuggestions = false;
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = this.selectedIndex < this.suggestions.length - 1 
        ? this.selectedIndex + 1 
        : this.selectedIndex;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : -1;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
        this.handleSelectCity(this.suggestions[this.selectedIndex]);
      } else if (this.query.trim()) {
        this.onSearch(this.query.trim());
        this.showSuggestions = false;
      }
    } else if (e.key === 'Escape') {
      this.showSuggestions = false;
    }
  };

  private handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('city-search')) {
      this.showSuggestions = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
  }

  render() {
    return html`
      <div class="relative" data-cy="city-search">
        <form @submit=${this.handleSubmit} class="flex gap-2" data-cy="city-search-form">
          <div class="relative-flex">
            <input
              type="text"
              .value=${this.query}
              @input=${this.handleInput}
              @keydown=${this.handleKeyDown}
              @focus=${() => this.query.trim() && this.suggestions.length > 0 && (this.showSuggestions = true)}
              placeholder="Search for a city..."
              data-cy="city-input"
              autocomplete="off"
            />
          </div>
          <button 
            type="submit" 
            ?disabled=${this.loading || !this.query.trim()}
            data-cy="search-button"
          >
            ${this.loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        ${this.showSuggestions ? html`
          <ul data-cy="city-suggestions">
            ${this.suggestions.map((city, index) => html`
              <li 
                class=${index === this.selectedIndex ? 'selected' : ''}
                data-cy="city-suggestion-${index}"
                @click=${() => this.handleSelectCity(city)}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.handleSelectCity(city)}
                role="option"
                aria-selected=${index === this.selectedIndex}
                tabindex="0"
              >
                <div>
                  <span class="city-name">${city.name}</span>
                  <span class="country-name">${city.country}</span>
                </div>
                <span class="country-code">${city.countryCode}</span>
              </li>
            `)}
          </ul>
        ` : ''}
      </div>
    `;
  }
}
