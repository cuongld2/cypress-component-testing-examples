import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../types/weather';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

@Component({
  selector: 'app-weather-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-background" [ngClass]="backgroundClass">
      @if (weather) {
        @if ((condition.includes('clear') || condition.includes('cloud')) && isDay) {
          <div class="sun"></div>
          <div class="clouds">
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
          </div>
        }
        
        @if (condition.includes('clear') && !isDay) {
          <div class="moon"></div>
          <div class="stars">
            @for (star of stars; track $index) {
              <div 
                class="star" 
                [style.left.%]="star.left" 
                [style.top.%]="star.top"
                [style.animation-delay.s]="star.delay"
                [style.width.px]="star.size"
                [style.height.px]="star.size"
              ></div>
            }
          </div>
        }
        
        @if (condition.includes('snow')) {
          @if (isDay) { <div class="sun"></div> }
          <div class="snowflakes">
            @for (flake of snowflakes; track $index) {
              <div 
                class="snowflake" 
                [style.left.%]="flake.left"
                [style.animation-delay.s]="flake.delay"
                [style.animation-duration.s]="flake.duration"
                [style.width.px]="flake.size"
                [style.height.px]="flake.size"
              ></div>
            }
          </div>
        }
        
        @if (condition.includes('rain') || condition.includes('drizzle')) {
          <div class="rain">
            @for (drop of raindrops; track $index) {
              <div 
                class="raindrop" 
                [style.left.%]="drop.left"
                [style.animation-delay.s]="drop.delay"
                [style.animation-duration.s]="drop.duration"
              ></div>
            }
          </div>
        }
        
        @if (condition.includes('thunder')) {
          <div class="lightning"></div>
        }
        
        @if (condition.includes('mist') || condition.includes('fog')) {
          <div class="mist">
            <div class="mist-layer"></div>
            <div class="mist-layer" style="animation-delay: -15s; opacity: 0.7"></div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class WeatherBackgroundComponent implements OnChanges {
  @Input() weather: CurrentWeather | null = null;
  @Input() isLoading: boolean = false;
  @Input() currentHour: number | null = null;

  backgroundClass = 'bg-default';
  condition = '';
  isDay = false;
  stars: { left: number; top: number; delay: number; size: number }[] = [];
  snowflakes: { left: number; delay: number; duration: number; size: number }[] = [];
  raindrops: { left: number; delay: number; duration: number }[] = [];

  ngOnChanges() {
    this.updateBackground();
    this.generateWeatherElements();
  }

  private getTimeOfDay(): TimeOfDay {
    const hour = this.currentHour !== null ? this.currentHour : new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  private getBackgroundClass(cond: string, timeOfDay: string): string {
    const conditionLower = cond.toLowerCase();
    const isDayTime = timeOfDay === 'morning' || timeOfDay === 'afternoon';
    const isEvening = timeOfDay === 'evening';
    
    if (conditionLower.includes('clear')) {
      if (isDayTime) return 'bg-sunny';
      if (isEvening) return 'bg-evening';
      return 'bg-starry-night';
    }
    if (conditionLower.includes('cloud')) {
      return isDayTime ? 'bg-cloudy-day' : 'bg-cloudy-night';
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return isDayTime ? 'bg-rainy-day' : 'bg-rainy-night';
    }
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'bg-stormy';
    }
    if (conditionLower.includes('snow')) {
      return isDayTime ? 'bg-snowy-day' : 'bg-snowy-night';
    }
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return 'bg-foggy';
    }
    
    if (isDayTime) return 'bg-sunny';
    if (isEvening) return 'bg-evening';
    return 'bg-starry-night';
  }

  private updateBackground() {
    const timeOfDay = this.getTimeOfDay();
    this.isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
    
    if (this.weather) {
      this.condition = this.weather.condition.toLowerCase();
      this.backgroundClass = this.getBackgroundClass(this.weather.condition, timeOfDay);
    } else {
      this.backgroundClass = 'bg-default';
      this.condition = '';
    }
  }

  private generateWeatherElements() {
    if (!this.weather) return;

    const cond = this.weather.condition.toLowerCase();

    if (cond.includes('clear') && !this.isDay) {
      this.stars = Array.from({ length: 80 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 60,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 3
      }));
    }

    if (cond.includes('snow')) {
      this.snowflakes = Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 7,
        duration: 5 + Math.random() * 5,
        size: 4 + Math.random() * 6
      }));
    }

    if (cond.includes('rain') || cond.includes('drizzle')) {
      this.raindrops = Array.from({ length: 80 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 0.4 + Math.random() * 0.4
      }));
    }
  }
}
