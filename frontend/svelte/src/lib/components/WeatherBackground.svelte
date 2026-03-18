<script lang="ts">
  import type { CurrentWeather } from '$lib/types/weather';

  interface Props {
    weather: CurrentWeather | null;
    isLoading: boolean;
  }

  let { weather, isLoading }: Props = $props();

  function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  function getBackgroundClass(condition: string, timeOfDay: string): string {
    const conditionLower = condition.toLowerCase();
    const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
    const isEvening = timeOfDay === 'evening';
    
    if (conditionLower.includes('clear')) {
      if (isDay) return 'bg-sunny';
      if (isEvening) return 'bg-evening';
      return 'bg-starry-night';
    }
    if (conditionLower.includes('cloud')) {
      return isDay ? 'bg-cloudy-day' : 'bg-cloudy-night';
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return isDay ? 'bg-rainy-day' : 'bg-rainy-night';
    }
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'bg-stormy';
    }
    if (conditionLower.includes('snow')) {
      return isDay ? 'bg-snowy-day' : 'bg-snowy-night';
    }
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return 'bg-foggy';
    }
    
    if (isDay) return 'bg-sunny';
    if (isEvening) return 'bg-evening';
    return 'bg-starry-night';
  }

  let timeOfDay = $derived(getTimeOfDay());
  let isDay = $derived(timeOfDay === 'morning' || timeOfDay === 'afternoon');
  let backgroundClass = $derived(weather ? getBackgroundClass(weather.condition, timeOfDay) : 'bg-default');
  let condition = $derived(weather?.condition.toLowerCase() || '');
</script>

<div class="weather-background {backgroundClass}">
  {#if weather}
    {#if (condition.includes('clear') || condition.includes('cloud')) && isDay}
      <div class="sun"></div>
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
    {/if}
    
    {#if condition.includes('clear') && !isDay}
      <div class="moon"></div>
      <div class="stars">
        {#each Array(80) as _, i}
          <div 
            class="star" 
            style="left: {Math.random() * 100}%; top: {Math.random() * 60}%; animation-delay: {Math.random() * 3}s; width: {2 + Math.random() * 3}px; height: {2 + Math.random() * 3}px"
          ></div>
        {/each}
      </div>
    {/if}
    
    {#if condition.includes('snow')}
      {#if isDay}<div class="sun"></div>{/if}
      <div class="snowflakes">
        {#each Array(50) as _, i}
          <div 
            class="snowflake" 
            style="left: {Math.random() * 100}%; animation-delay: {Math.random() * 7}s; animation-duration: {5 + Math.random() * 5}s; width: {4 + Math.random() * 6}px; height: {4 + Math.random() * 6}px"
          ></div>
        {/each}
      </div>
    {/if}
    
    {#if condition.includes('rain') || condition.includes('drizzle')}
      <div class="rain">
        {#each Array(80) as _, i}
          <div 
            class="raindrop" 
            style="left: {Math.random() * 100}%; animation-delay: {Math.random() * 1.5}s; animation-duration: {0.4 + Math.random() * 0.4}s"
          ></div>
        {/each}
      </div>
    {/if}
    
    {#if condition.includes('thunder')}
      <div class="lightning"></div>
    {/if}
    
    {#if condition.includes('mist') || condition.includes('fog')}
      <div class="mist">
        <div class="mist-layer"></div>
        <div class="mist-layer" style="animation-delay: -15s; opacity: 0.7"></div>
      </div>
    {/if}
  {/if}
</div>