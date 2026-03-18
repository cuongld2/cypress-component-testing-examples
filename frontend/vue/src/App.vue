<script setup lang="ts">
import { ref } from 'vue';
import CitySearch from './components/CitySearch.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import ForecastList from './components/ForecastList.vue';
import HistoryList from './components/HistoryList.vue';
import WeatherBackground from './components/WeatherBackground.vue';
import { fetchCurrentWeather, fetchForecast, fetchHistory } from './services/weatherApi';
import type { CurrentWeather as CurrentWeatherType, Forecast, History } from './types/weather';

const currentWeather = ref<CurrentWeatherType | null>(null);
const forecast = ref<Forecast | null>(null);
const history = ref<History | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function handleSearch(city: string) {
  loading.value = true;
  error.value = null;
  
  try {
    const [weatherData, forecastData, historyData] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
      fetchHistory(city),
    ]);
    
    currentWeather.value = weatherData;
    forecast.value = forecastData;
    history.value = historyData;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch weather data';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <WeatherBackground :weather="currentWeather" :is-loading="loading" />
  <div class="min-h-screen py-8 px-4 relative">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg" data-cy="app-title">
        Weather App
      </h1>
      
      <div class="mb-8 bg-white/90 rounded-lg p-4 shadow-lg" data-cy="search-section">
        <CitySearch :on-search="handleSearch" :loading="loading" />
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" data-cy="error-message">
        {{ error }}
      </div>

      <div class="space-y-6" data-cy="weather-content">
        <CurrentWeather 
          :weather="currentWeather" 
          :loading="loading" 
          :error="error"
        />
        
        <ForecastList 
          :forecast="forecast" 
          :loading="loading" 
          :error="error"
        />
        
        <HistoryList 
          :history="history" 
          :loading="loading" 
          :error="error"
        />
      </div>
    </div>
  </div>
</template>