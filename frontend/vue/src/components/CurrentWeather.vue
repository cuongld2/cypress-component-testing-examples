<script setup lang="ts">
import type { CurrentWeather as CurrentWeatherType } from '@/types/weather';

interface Props {
  weather: CurrentWeatherType | null;
  loading: boolean;
  error: string | null;
}

defineProps<Props>();
</script>

<template>
  <div v-if="loading" class="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
    <div class="text-gray-500">Loading current weather...</div>
  </div>
  <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
    <div class="text-red-500">{{ error }}</div>
  </div>
  <div v-else-if="!weather" class="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
    <div class="text-gray-500">Search for a city to see weather</div>
  </div>
  <div v-else class="bg-white rounded-lg shadow-md p-6" data-cy="current-weather">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold" data-cy="weather-city">{{ weather.city }}, {{ weather.country }}</h2>
        <p class="text-gray-600" data-cy="weather-condition">{{ weather.condition }}</p>
      </div>
      <img 
        :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`" 
        :alt="weather.condition" 
        class="w-20 h-20" 
        data-cy="weather-icon"
      />
    </div>
    <div class="mt-4">
      <div class="text-5xl font-bold" data-cy="weather-temp">{{ Math.round(weather.temperature) }}°C</div>
      <p class="text-gray-600 mt-1">Feels like {{ Math.round(weather.feels_like) }}°C</p>
    </div>
    <div class="mt-6 grid grid-cols-2 gap-4">
      <div class="bg-gray-50 rounded p-3">
        <p class="text-sm text-gray-600">Humidity</p>
        <p class="font-semibold" data-cy="weather-humidity">{{ weather.humidity }}%</p>
      </div>
      <div class="bg-gray-50 rounded p-3">
        <p class="text-sm text-gray-600">Wind Speed</p>
        <p class="font-semibold" data-cy="weather-wind">{{ weather.wind_speed }} m/s</p>
      </div>
    </div>
  </div>
</template>