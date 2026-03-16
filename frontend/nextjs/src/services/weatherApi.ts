import { CurrentWeather, Forecast, History } from '@/types/weather';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  const res = await fetch(`${API_BASE}/api/weather/current?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error('Failed to fetch current weather');
  return res.json();
}

export async function fetchForecast(city: string): Promise<Forecast> {
  const res = await fetch(`${API_BASE}/api/weather/forecast?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  return res.json();
}

export async function fetchHistory(city: string): Promise<History> {
  const res = await fetch(`${API_BASE}/api/weather/history?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}
