import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { CurrentWeather } from '../types/weather';

@customElement('weather-background')
export class WeatherBackground extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      overflow: hidden;
      transition: background 1s ease;
    }
    
    .bg-default {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }
    
    .bg-sunny {
      background: linear-gradient(135deg, #2196f3 0%, #03a9f4 30%, #fcd34d 70%, #f59e0b 100%);
    }
    
    .bg-starry-night {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    }
    
    .bg-cloudy-day {
      background: linear-gradient(135deg, #606c88 0%, #3f4c6b 50%, #2c3e50 100%);
    }
    
    .bg-cloudy-night {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    
    .bg-rainy-day {
      background: linear-gradient(135deg, #373b44 0%, #4286f4 50%, #373b44 100%);
    }
    
    .bg-rainy-night {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    }
    
    .bg-stormy {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d3436 50%, #636e72 100%);
    }
    
    .bg-snowy-day {
      background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 50%, #e0c3fc 100%);
    }
    
    .bg-snowy-night {
      background: linear-gradient(135deg, #1a1a2e 0%, #4a4e69 50%, #9a8c98 100%);
    }
    
    .bg-foggy {
      background: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 50%, #bdc3c7 100%);
    }
    
    .bg-morning {
      background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%);
    }
    
    .bg-evening {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }
    
    .sun {
      position: absolute;
      top: 8%;
      right: 12%;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, #fef08a 0%, #fde047 40%, #f59e0b 80%, transparent 100%);
      border-radius: 50%;
      box-shadow: 0 0 80px #fbbf24, 0 0 150px #f59e0b;
      animation: sun-pulse 6s ease-in-out infinite;
    }
    
    @keyframes sun-pulse {
      0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 80px #fbbf24, 0 0 150px #f59e0b; }
      50% { transform: scale(1.1); opacity: 0.95; box-shadow: 0 0 100px #fbbf24, 0 0 200px #f59e0b; }
    }
    
    .moon {
      position: absolute;
      top: 10%;
      right: 15%;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle at 30% 30%, #fef9c3, #fef08a);
      border-radius: 50%;
      box-shadow: 0 0 40px #fef9c3, 0 0 80px #fef08a;
    }
    
    .stars {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .star {
      position: absolute;
      background: white;
      border-radius: 50%;
      animation: twinkle 2s ease-in-out infinite;
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }
    
    .snowflakes {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .snowflake {
      position: absolute;
      top: -10px;
      background: white;
      border-radius: 50%;
      opacity: 0.9;
      filter: blur(1px);
      animation: snowfall 7s linear infinite;
    }
    
    @keyframes snowfall {
      0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.9; }
      25% { transform: translateY(25vh) translateX(10px) rotate(90deg); opacity: 0.8; }
      50% { transform: translateY(50vh) translateX(-10px) rotate(180deg); opacity: 0.7; }
      75% { transform: translateY(75vh) translateX(10px) rotate(270deg); opacity: 0.5; }
      100% { transform: translateY(100vh) translateX(0) rotate(360deg); opacity: 0; }
    }
    
    .rain {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .raindrop {
      position: absolute;
      top: -30px;
      width: 2px;
      height: 25px;
      background: linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.6));
      animation: rain-fall 0.8s linear infinite;
    }
    
    @keyframes rain-fall {
      0% { transform: translateY(0); opacity: 0.5; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
    
    .lightning {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      animation: lightning-flash 8s ease-in-out infinite;
    }
    
    @keyframes lightning-flash {
      0%, 88%, 92%, 100% { background: transparent; }
      90%, 91% { background: rgba(255, 255, 255, 0.3); }
    }
    
    .clouds {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      filter: blur(8px);
      animation: cloud-drift 20s linear infinite;
    }
    
    .cloud::before, .cloud::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
    }
    
    .cloud-1 { width: 200px; height: 60px; top: 15%; left: -200px; animation-delay: 0s; }
    .cloud-1::before { width: 80px; height: 80px; top: -40px; left: 30px; }
    .cloud-1::after { width: 100px; height: 70px; top: -30px; left: 80px; }
    
    .cloud-2 { width: 150px; height: 50px; top: 25%; left: -150px; animation-delay: 7s; animation-duration: 25s; }
    .cloud-2::before { width: 60px; height: 60px; top: -30px; left: 20px; }
    .cloud-2::after { width: 80px; height: 50px; top: -20px; left: 60px; }
    
    .cloud-3 { width: 180px; height: 55px; top: 35%; left: -180px; animation-delay: 14s; animation-duration: 22s; }
    .cloud-3::before { width: 70px; height: 70px; top: -35px; left: 25px; }
    .cloud-3::after { width: 90px; height: 60px; top: -25px; left: 70px; }
    
    @keyframes cloud-drift {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(100vw + 300px)); }
    }
    
    .mist {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .mist-layer {
      position: absolute;
      width: 200%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.15) 40%,
        transparent 60%
      );
      animation: mist-drift 30s linear infinite;
    }
    
    @keyframes mist-drift {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;

  @property({ type: Object, attribute: false })
  weather: CurrentWeather | null = null;

  @property({ type: Boolean, attribute: false })
  isLoading = false;

  @state()
  private stars: Array<{ left: number; top: number; delay: number; size: number }> = [];

  @state()
  private snowflakes: Array<{ left: number; delay: number; duration: number; size: number }> = [];

  @state()
  private raindrops: Array<{ left: number; delay: number; duration: number }> = [];

  private bgDiv: HTMLDivElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalStyles();
    this.bgDiv = document.createElement('div');
    this.bgDiv.className = `weather-background`;
    this.bgDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      background: linear-gradient(135deg, #87CEEB 0%, #4FC3F7 50%, #29B6F6 100%);
    `;
    document.body.insertBefore(this.bgDiv, document.body.firstChild);
    this.generateStars();
    this.generateSnowflakes();
    this.generateRaindrops();
  }

  private styleElement: HTMLStyleElement | null = null;

  private addGlobalStyles() {
    if (this.styleElement) return;
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      .weather-background .sun {
        position: absolute;
        top: 8%;
        right: 12%;
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, #fef08a 0%, #fde047 40%, #f59e0b 80%, transparent 100%);
        border-radius: 50%;
        box-shadow: 0 0 80px #fbbf24, 0 0 150px #f59e0b;
        animation: sun-pulse 6s ease-in-out infinite;
      }
      @keyframes sun-pulse {
        0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 80px #fbbf24, 0 0 150px #f59e0b; }
        50% { transform: scale(1.1); opacity: 0.95; box-shadow: 0 0 100px #fbbf24, 0 0 200px #f59e0b; }
      }
      .weather-background .moon {
        position: absolute;
        top: 10%;
        right: 15%;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle at 30% 30%, #fef9c3, #fef08a);
        border-radius: 50%;
        box-shadow: 0 0 40px #fef9c3, 0 0 80px #fef08a;
      }
      .weather-background .stars { position: absolute; width: 100%; height: 100%; }
      .weather-background .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: twinkle 2s ease-in-out infinite;
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }
      .weather-background .snowflakes { position: absolute; width: 100%; height: 100%; pointer-events: none; }
      .weather-background .snowflake {
        position: absolute;
        top: -10px;
        background: white;
        border-radius: 50%;
        opacity: 0.9;
        filter: blur(1px);
        animation: snowfall 7s linear infinite;
      }
      @keyframes snowfall {
        0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.9; }
        25% { transform: translateY(25vh) translateX(10px) rotate(90deg); opacity: 0.8; }
        50% { transform: translateY(50vh) translateX(-10px) rotate(180deg); opacity: 0.7; }
        75% { transform: translateY(75vh) translateX(10px) rotate(270deg); opacity: 0.5; }
        100% { transform: translateY(100vh) translateX(0) rotate(360deg); opacity: 0; }
      }
      .weather-background .rain { position: absolute; width: 100%; height: 100%; pointer-events: none; }
      .weather-background .raindrop {
        position: absolute;
        top: -30px;
        width: 2px;
        height: 25px;
        background: linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.6));
        animation: rain-fall 0.8s linear infinite;
      }
      @keyframes rain-fall {
        0% { transform: translateY(0); opacity: 0.5; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      .weather-background .lightning {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        animation: lightning-flash 8s ease-in-out infinite;
      }
      @keyframes lightning-flash {
        0%, 88%, 92%, 100% { background: transparent; }
        90%, 91% { background: rgba(255, 255, 255, 0.3); }
      }
      .weather-background .clouds { position: absolute; width: 100%; height: 100%; pointer-events: none; }
      .weather-background .cloud {
        position: absolute;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        filter: blur(8px);
        animation: cloud-drift 20s linear infinite;
      }
      .weather-background .cloud::before, .weather-background .cloud::after {
        content: '';
        position: absolute;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
      }
      .weather-background .cloud-1 { width: 200px; height: 60px; top: 15%; left: -200px; animation-delay: 0s; }
      .weather-background .cloud-1::before { width: 80px; height: 80px; top: -40px; left: 30px; }
      .weather-background .cloud-1::after { width: 100px; height: 70px; top: -30px; left: 80px; }
      .weather-background .cloud-2 { width: 150px; height: 50px; top: 25%; left: -150px; animation-delay: 7s; animation-duration: 25s; }
      .weather-background .cloud-2::before { width: 60px; height: 60px; top: -30px; left: 20px; }
      .weather-background .cloud-2::after { width: 80px; height: 50px; top: -20px; left: 60px; }
      .weather-background .cloud-3 { width: 180px; height: 55px; top: 35%; left: -180px; animation-delay: 14s; animation-duration: 22s; }
      .weather-background .cloud-3::before { width: 70px; height: 70px; top: -35px; left: 25px; }
      .weather-background .cloud-3::after { width: 90px; height: 60px; top: -25px; left: 70px; }
      @keyframes cloud-drift {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(100vw + 300px)); }
      }
      .weather-background .mist { position: absolute; width: 100%; height: 100%; pointer-events: none; }
      .weather-background .mist-layer {
        position: absolute;
        width: 200%;
        height: 100%;
        background: repeating-linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 20%,
          rgba(255, 255, 255, 0.15) 40%,
          transparent 60%
        );
        animation: mist-drift 30s linear infinite;
      }
      @keyframes mist-drift {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.bgDiv) {
      document.body.removeChild(this.bgDiv);
      this.bgDiv = null;
    }
    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('weather') || changedProperties.has('isLoading')) {
      this.updateBackground();
    }
  }

  private generateStars() {
    this.stars = Array.from({ length: 80 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 60,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 3,
    }));
  }

  private generateSnowflakes() {
    this.snowflakes = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 7,
      duration: 5 + Math.random() * 5,
      size: 4 + Math.random() * 6,
    }));
  }

  private generateRaindrops() {
    this.raindrops = Array.from({ length: 80 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 0.4 + Math.random() * 0.4,
    }));
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  private updateBackground() {
    if (this.bgDiv) {
      this.bgDiv.className = `weather-background ${this.getBackgroundClass()}`;
      this.bgDiv.style.background = this.getBackgroundGradient();
      this.bgDiv.innerHTML = this.renderEffectsHTML();
    }
  }

  private getBackgroundClass(): string {
    if (!this.weather) return 'bg-default';
    
    const condition = this.weather.condition.toLowerCase();
    const timeOfDay = this.getTimeOfDay();
    const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
    const isEvening = timeOfDay === 'evening';
    
    if (condition.includes('clear')) {
      if (isDay) return 'bg-sunny';
      if (isEvening) return 'bg-evening';
      return 'bg-starry-night';
    }
    if (condition.includes('cloud')) {
      return isDay ? 'bg-cloudy-day' : 'bg-cloudy-night';
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return isDay ? 'bg-rainy-day' : 'bg-rainy-night';
    }
    if (condition.includes('thunder') || condition.includes('storm')) {
      return 'bg-stormy';
    }
    if (condition.includes('snow')) {
      return isDay ? 'bg-snowy-day' : 'bg-snowy-night';
    }
    if (condition.includes('mist') || condition.includes('fog')) {
      return 'bg-foggy';
    }
    
    if (isDay) return 'bg-sunny';
    if (isEvening) return 'bg-evening';
    return 'bg-starry-night';
  }

  private getBackgroundGradient(): string {
    if (!this.weather) return 'linear-gradient(135deg, #87CEEB 0%, #4FC3F7 50%, #29B6F6 100%)';
    
    const condition = this.weather.condition.toLowerCase();
    const timeOfDay = this.getTimeOfDay();
    const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
    const isEvening = timeOfDay === 'evening';
    
    if (condition.includes('clear')) {
      if (isDay) return 'linear-gradient(135deg, #2196f3 0%, #03a9f4 30%, #fcd34d 70%, #f59e0b 100%)';
      if (isEvening) return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
      return 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
    }
    if (condition.includes('cloud')) {
      return isDay 
        ? 'linear-gradient(135deg, #606c88 0%, #3f4c6b 50%, #2c3e50 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return isDay 
        ? 'linear-gradient(135deg, #373b44 0%, #4286f4 50%, #373b44 100%)'
        : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
    }
    if (condition.includes('thunder') || condition.includes('storm')) {
      return 'linear-gradient(135deg, #1a1a1a 0%, #2d3436 50%, #636e72 100%)';
    }
    if (condition.includes('snow')) {
      return isDay 
        ? 'linear-gradient(135deg, #74ebd5 0%, #acb6e5 50%, #e0c3fc 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #4a4e69 50%, #9a8c98 100%)';
    }
    if (condition.includes('mist') || condition.includes('fog')) {
      return 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 50%, #bdc3c7 100%)';
    }
    
    if (isDay) return 'linear-gradient(135deg, #2196f3 0%, #03a9f4 30%, #fcd34d 70%, #f59e0b 100%)';
    if (isEvening) return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
    return 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
  }

  private renderEffectsHTML(): string {
    if (!this.weather) return '';

    const condition = this.weather.condition.toLowerCase();
    const timeOfDay = this.getTimeOfDay();
    const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';

    let effects = '';

    if ((condition.includes('clear') || condition.includes('cloud')) && isDay) {
      effects += `
        <div class="sun"></div>
        <div class="clouds">
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
        </div>
      `;
    }

    if (condition.includes('clear') && !isDay) {
      effects += `
        <div class="moon"></div>
        <div class="stars">
          ${this.stars.map(star => `<div class="star" style="left: ${star.left}%; top: ${star.top}%; animation-delay: ${star.delay}s; width: ${star.size}px; height: ${star.size}px"></div>`).join('')}
        </div>
      `;
    }

    if (condition.includes('snow')) {
      effects += `
        ${isDay ? '<div class="sun"></div>' : ''}
        <div class="snowflakes">
          ${this.snowflakes.map(snow => `<div class="snowflake" style="left: ${snow.left}%; animation-delay: ${snow.delay}s; animation-duration: ${snow.duration}s; width: ${snow.size}px; height: ${snow.size}px"></div>`).join('')}
        </div>
      `;
    }

    if (condition.includes('rain') || condition.includes('drizzle')) {
      effects += `
        <div class="rain">
          ${this.raindrops.map(drop => `<div class="raindrop" style="left: ${drop.left}%; animation-delay: ${drop.delay}s; animation-duration: ${drop.duration}s"></div>`).join('')}
        </div>
      `;
    }

    if (condition.includes('thunder')) {
      effects += '<div class="lightning"></div>';
    }

    if (condition.includes('mist') || condition.includes('fog')) {
      effects += `
        <div class="mist">
          <div class="mist-layer"></div>
          <div class="mist-layer" style="animation-delay: -15s; opacity: 0.7"></div>
        </div>
      `;
    }

    return effects;
  }

  render() {
    return html``;
  }
}
