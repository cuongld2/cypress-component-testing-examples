<script lang="ts">
  import CitySearch from '$lib/components/CitySearch.svelte';
  import CurrentWeather from '$lib/components/CurrentWeather.svelte';
  import ForecastList from '$lib/components/ForecastList.svelte';
  import HistoryList from '$lib/components/HistoryList.svelte';
  import WeatherBackground from '$lib/components/WeatherBackground.svelte';
  import { fetchCurrentWeather, fetchForecast, fetchHistory } from '$lib/services/weatherApi';
  import type { CurrentWeather as CurrentWeatherType, Forecast, History } from '$lib/types/weather';

  let currentWeather = $state<CurrentWeatherType | null>(null);
  let forecast = $state<Forecast | null>(null);
  let history = $state<History | null>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function handleSearch(city: string) {
    loading = true;
    error = null;
    
    try {
      const [weatherData, forecastData, historyData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
        fetchHistory(city),
      ]);
      
      currentWeather = weatherData;
      forecast = forecastData;
      history = historyData;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch weather data';
    } finally {
      loading = false;
    }
  }
</script>

<WeatherBackground weather={currentWeather} isLoading={loading} />
<div class="min-h-screen py-8 px-4 relative">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg" data-cy="app-title">
      Weather App
    </h1>
    
    <div class="mb-8 bg-white/90 rounded-lg p-4 shadow-lg" data-cy="search-section">
      <CitySearch onSearch={handleSearch} {loading} />
    </div>

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" data-cy="error-message">
        {error}
      </div>
    {/if}

    <div class="space-y-6" data-cy="weather-content">
      <CurrentWeather 
        weather={currentWeather} 
        {loading} 
        {error}
      />
      
      <ForecastList 
        forecast={forecast} 
        {loading} 
        {error}
      />
      
      <HistoryList 
        history={history} 
        {loading} 
        {error}
      />
    </div>
  </div>
</div>