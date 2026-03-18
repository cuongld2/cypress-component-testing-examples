<script setup lang="ts">
import type { History as HistoryType } from '@/types/weather';

interface Props {
  history: HistoryType | null;
  loading: boolean;
  error: string | null;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
    
    <div v-if="loading" class="text-gray-500">Loading history...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="!history || !history.history.length" class="text-gray-500">No history data available</div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="(day, index) in history.history" 
        :key="index" 
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        :data-cy="'history-day-' + index"
      >
        <div class="flex items-center gap-3">
          <img 
            :src="`https://openweathermap.org/img/wn/${day.icon}.png`" 
            :alt="day.condition"
            class="w-10 h-10"
            :data-cy="'history-icon-' + index"
          />
          <div>
            <p class="font-medium" :data-cy="'history-date-' + index">{{ day.date }}</p>
            <p class="text-sm text-gray-600" :data-cy="'history-condition-' + index">{{ day.condition }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold" :data-cy="'history-temp-' + index">{{ Math.round(day.temperature) }}°C</p>
          <p class="text-xs text-gray-600">💧 {{ day.humidity }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>