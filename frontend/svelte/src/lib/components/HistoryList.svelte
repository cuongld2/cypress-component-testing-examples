<script lang="ts">
  import type { History as HistoryType } from '$lib/types/weather';

  interface Props {
    history: HistoryType | null;
    loading: boolean;
    error: string | null;
  }

  let { history, loading, error }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
  
  {#if loading}
    <div class="text-gray-500">Loading history...</div>
  {:else if error}
    <div class="text-red-500">{error}</div>
  {:else if !history || !history.history.length}
    <div class="text-gray-500">No history data available</div>
  {:else}
    <div class="space-y-3">
      {#each history.history as day, index (index)}
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-cy="history-day-{index}">
          <div class="flex items-center gap-3">
            <img 
              src="https://openweathermap.org/img/wn/{day.icon}.png" 
              alt={day.condition}
              class="w-10 h-10"
              data-cy="history-icon-{index}"
            />
            <div>
              <p class="font-medium" data-cy="history-date-{index}">{day.date}</p>
              <p class="text-sm text-gray-600" data-cy="history-condition-{index}">{day.condition}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold" data-cy="history-temp-{index}">{Math.round(day.temperature)}°C</p>
            <p class="text-xs text-gray-600">💧 {day.humidity}%</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>