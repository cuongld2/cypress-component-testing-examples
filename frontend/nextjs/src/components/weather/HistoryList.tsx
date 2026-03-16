'use client';

import { History as HistoryType } from '@/types/weather';

interface HistoryProps {
  history: HistoryType | null;
  loading: boolean;
  error: string | null;
}

export function HistoryList({ history, loading, error }: HistoryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div className="text-gray-500">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!history || !history.history.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
        <div className="text-gray-500">No history data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-cy="history">
      <h3 className="text-xl font-semibold mb-4">Weather History (Last 7 Days)</h3>
      <div className="space-y-3">
        {history.history.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-cy={`history-day-${index}`}>
            <div className="flex items-center gap-3">
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={day.condition}
                className="w-10 h-10"
                data-cy={`history-icon-${index}`}
              />
              <div>
                <p className="font-medium" data-cy={`history-date-${index}`}>{day.date}</p>
                <p className="text-sm text-gray-600" data-cy={`history-condition-${index}`}>{day.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold" data-cy={`history-temp-${index}`}>{Math.round(day.temperature)}°C</p>
              <p className="text-xs text-gray-600">💧 {day.humidity}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
