// src/types/weather.d.ts

export interface WeatherData {
  coord: { lon: number; lat: number; };
  weather: Array<{ id: number; main: string; description: string; icon: string; }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number; };
  clouds: { all: number; };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{ id: number; main: string; description: string; icon: string; }>;
  clouds: { all: number; };
  wind: { speed: number; deg: number; gust: number; };
  visibility: number;
  pop: number; // Probability of precipitation
  sys: { pod: string; };
  dt_txt: string;
  // Adicionado para o modal
  sunrise?: number;
  sunset?: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number; };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface GeoData {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CachedWeather {
  weather: WeatherData;
  forecast: ForecastData;
}