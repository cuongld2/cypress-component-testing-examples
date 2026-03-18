<script lang="ts">
  import type { Forecast as ForecastType } from '$lib/types/weather';

  interface Props {
    forecast: ForecastType | null;
    loading: boolean;
    error: string | null;
  }

  let { forecast, loading, error }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-semibold mb-4">5-Day Forecast</h3>
  
  {#if loading}
    <div class="text-gray-500">Loading forecast...</div>
  {:else if error}
    <div class="text-red-500">{error}</div>
  {:else if !forecast || !forecast.forecast.length}
    <div class="text-gray-500">No forecast data available</div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
      {#each forecast.forecast as day, index (index)}
        <div class="text-center p-3 bg-gray-50 rounded-lg" data-cy="forecast-day-{index}">
          <p class="text-sm font-medium" data-cy="forecast-date-{index}">{day.date}</p>
          <img 
            src="https://openweathermap.org/img/wn/{day.icon}.png" 
            alt={day.condition}
            class="w-12 h-12 mx-auto"
            data-cy="forecast-icon-{index}"
          />
          <p class="text-lg font-bold" data-cy="forecast-temp-{index}">{Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°</p>
          <p class="text-xs text-gray-600" data-cy="forecast-condition-{index}">{day.condition}</p>
          <p class="text-xs text-gray-500" data-cy="forecast-precip-{index}">{day.precipitation}%</p>
        </div>
      {/each}
    </div>
  {/if}
</div>