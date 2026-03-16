'use client';

import { useState } from 'react';
import { CurrentWeather, ForecastList, HistoryList, CitySearch, WeatherBackground } from '@/components/weather';
import { fetchCurrentWeather, fetchForecast, fetchHistory } from '@/services/weatherApi';
import { CurrentWeather as CurrentWeatherType, Forecast, History } from '@/types/weather';

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherType | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [history, setHistory] = useState<History | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData, historyData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
        fetchHistory(city),
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setHistory(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WeatherBackground weather={currentWeather} isLoading={loading} />
      <div className="min-h-screen py-8 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg" data-cy="app-title">
            Weather App
          </h1>
          
          <div className="mb-8" data-cy="search-section">
            <CitySearch onSearch={handleSearch} loading={loading} />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" data-cy="error-message">
              {error}
            </div>
          )}

          <div className="space-y-6" data-cy="weather-content">
            <CurrentWeather 
              weather={currentWeather} 
              loading={loading} 
              error={error} 
            />
            
            <ForecastList 
              forecast={forecast} 
              loading={loading} 
              error={error} 
            />
            
            <HistoryList 
              history={history} 
              loading={loading} 
              error={error} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
