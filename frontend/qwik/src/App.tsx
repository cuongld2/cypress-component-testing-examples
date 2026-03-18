import { component$, useSignal, $ } from '@builder.io/qwik';
import { CitySearch } from './components/CitySearch';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastList } from './components/ForecastList';
import { HistoryList } from './components/HistoryList';
import { WeatherBackground } from './components/WeatherBackground';
import { fetchCurrentWeather, fetchForecast, fetchHistory } from './services/weatherApi';
import type { CurrentWeather as CurrentWeatherType, Forecast, History } from './types/weather';

export default component$(() => {
  const currentWeather = useSignal<CurrentWeatherType | null>(null);
  const forecast = useSignal<Forecast | null>(null);
  const history = useSignal<History | null>(null);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);

  const handleSearch = $(async (city: string) => {
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
  });

  return (
    <>
      <WeatherBackground weather={currentWeather.value} isLoading={loading.value} />
      <div class="min-h-screen py-8 px-4 relative">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg" data-cy="app-title">
            Weather App
          </h1>
          
          <div class="mb-8 bg-white/90 rounded-lg p-4 shadow-lg" data-cy="search-section">
            <CitySearch onSearch$={handleSearch} loading={loading.value} />
          </div>

          {error.value && (
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" data-cy="error-message">
              {error.value}
            </div>
          )}

          <div class="space-y-6" data-cy="weather-content">
            <CurrentWeather 
              weather={currentWeather.value} 
              loading={loading.value} 
              error={error.value}
            />
            
            <ForecastList 
              forecast={forecast.value} 
              loading={loading.value} 
              error={error.value}
            />
            
            <HistoryList 
              history={history.value} 
              loading={loading.value} 
              error={error.value}
            />
          </div>
        </div>
      </div>
    </>
  );
});