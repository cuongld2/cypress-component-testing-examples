import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('test-weather-app')
export class TestWeatherApp extends LitElement {
  @state()
  private currentWeather: any = null;

  @state()
  private loading = false;

  private async handleSearch(city: string) {
    console.log('handleSearch called with:', city);
    this.loading = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentWeather = {
      city: city,
      country: 'GB',
      temperature: 15,
      condition: 'Clouds'
    };
    
    this.loading = false;
    console.log('State updated:', this.currentWeather);
  }

  render() {
    console.log('Rendering with weather:', this.currentWeather, 'loading:', this.loading);
    
    return html`
      <div>
        <input 
          type="text" 
          @input=${(e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            if (value === 'London') {
              this.handleSearch(value);
            }
          }}
        />
        <div>
          ${this.loading ? html`<div>Loading...</div>` : ''}
          ${this.currentWeather ? html`<div>${this.currentWeather.city} - ${this.currentWeather.temperature}°C</div>` : html`<div>No weather</div>`}
        </div>
      </div>
    `;
  }
}
