'use client';

import { Forecast as ForecastType } from '@/types/weather';

interface ForecastProps {
  forecast: ForecastType | null;
  loading: boolean;
  error: string | null;
}

export function ForecastList({ forecast, loading, error }: ForecastProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div className="text-gray-500">Loading forecast...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!forecast || !forecast.forecast.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div className="text-gray-500">No forecast data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-cy="forecast">
      <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {forecast.forecast.map((day, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg" data-cy={`forecast-day-${index}`}>
            <p className="text-sm font-medium" data-cy={`forecast-date-${index}`}>{day.date}</p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
              alt={day.condition}
              className="w-12 h-12 mx-auto"
              data-cy={`forecast-icon-${index}`}
            />
            <p className="text-lg font-bold" data-cy={`forecast-temp-${index}`}>{Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°</p>
            <p className="text-xs text-gray-600" data-cy={`forecast-condition-${index}`}>{day.condition}</p>
            <p className="text-xs text-gray-500" data-cy={`forecast-precip-${index}`}>{day.precipitation}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
