export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  feels_like: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface Forecast {
  city: string;
  country: string;
  forecast: ForecastDay[];
}

export interface HistoryDay {
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  icon: string;
}

export interface History {
  city: string;
  country: string;
  history: HistoryDay[];
}
