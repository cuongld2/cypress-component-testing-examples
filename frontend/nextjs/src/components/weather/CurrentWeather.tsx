'use client';

import { CurrentWeather as CurrentWeatherType } from '@/types/weather';

interface CurrentWeatherProps {
  weather: CurrentWeatherType | null;
  loading: boolean;
  error: string | null;
}

export function CurrentWeather({ weather, loading, error }: CurrentWeatherProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading current weather...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Search for a city to see weather</div>
      </div>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-cy="current-weather">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-cy="weather-city">{weather.city}, {weather.country}</h2>
          <p className="text-gray-600" data-cy="weather-condition">{weather.condition}</p>
        </div>
        <img src={iconUrl} alt={weather.condition} className="w-20 h-20" data-cy="weather-icon" />
      </div>
      <div className="mt-4">
        <div className="text-5xl font-bold" data-cy="weather-temp">{Math.round(weather.temperature)}°C</div>
        <p className="text-gray-600 mt-1">Feels like {Math.round(weather.feels_like)}°C</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600">Humidity</p>
          <p className="font-semibold" data-cy="weather-humidity">{weather.humidity}%</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600">Wind Speed</p>
          <p className="font-semibold" data-cy="weather-wind">{weather.wind_speed} m/s</p>
        </div>
      </div>
    </div>
  );
}
