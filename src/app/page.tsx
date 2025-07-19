"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import LocationSearch from "@/components/LocationSearch";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherSkeleton from "@/components/skeletons/WeatherSkeleton";
import Modal from "@/components/Modal";
import DetailedForecast from "@/components/DetailedForecast";
import Footer from "@/components/Footer";
import { getCache, setCache } from "@/utils/cache";
import { FiAlertTriangle } from "react-icons/fi";
import { WeatherData, ForecastData, ForecastItem, GeoData } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const convertTemp = (temp: number, unit: 'C' | 'F') => (unit === 'F' ? (temp * 9/5) + 32 : temp);

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<ForecastItem | null>(null);

  const fetchWeatherData = useCallback(async (params: { lat: number; lon: number } | { city: string }) => {
    setLoading(true);
    setError(null);

    const cacheKey = 'city' in params ? params.city.toLowerCase() : `${params.lat.toFixed(2)},${params.lon.toFixed(2)}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setWeatherData(cachedData.weather);
      setForecastData(cachedData.forecast);
      setLoading(false);
      setIsInitialLoad(false);
    } else {
      setIsInitialLoad(true);
    }

    try {
      let lat: number, lon: number, cityName: string;
      if ('city' in params) {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${params.city}&limit=1&appid=${API_KEY}`;
        const { data } = await axios.get<GeoData[]>(geoUrl);
        if (data.length === 0) throw new Error(`Cidade "${params.city}" não encontrada.`);
        lat = data[0].lat;
        lon = data[0].lon;
        cityName = data[0].name;
      } else {
        lat = params.lat;
        lon = params.lon;
        const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
        const { data } = await axios.get<GeoData[]>(reverseGeoUrl);
        cityName = data[0]?.name || 'Localização Atual';
      }

      setLocation({ lat, lon, name: cityName });

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get<WeatherData>(weatherUrl),
        axios.get<ForecastData>(forecastUrl),
      ]);
      
      const enrichedForecastList = forecastResponse.data.list.map((item: ForecastItem) => ({
        ...item,
        sunrise: weatherResponse.data.sys.sunrise,
        sunset: weatherResponse.data.sys.sunset,
      }));
      const newForecastData: ForecastData = { ...forecastResponse.data, list: enrichedForecastList };

      setWeatherData(weatherResponse.data);
      setForecastData(newForecastData);
      setCache(cacheKey, { weather: weatherResponse.data, forecast: newForecastData });

    } catch (err: unknown) {
      let message = "Falha ao buscar dados.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          message = "Chave de API inválida.";
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (!API_KEY || API_KEY === "SUA_CHAVE_DE_API_AQUI") {
      setError("Chave de API não configurada. Adicione sua chave ao arquivo .env.local.");
      setLoading(false);
      setIsInitialLoad(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => {
        setError("Geolocalização negada. Use a busca.");
        setLoading(false);
        setIsInitialLoad(false);
      }
    );
  }, [fetchWeatherData]);

  const handleDayClick = (dayData: ForecastItem) => {
    setSelectedDay(dayData);
    setIsModalOpen(true);
  };

  const processedData = useMemo(() => {
    if (!weatherData || !forecastData) return null;
    const convert = (data: ForecastItem | WeatherData) => {
      const temp = (t: number) => convertTemp(t, unit);
      return {
        ...data,
        main: { ...data.main, temp: temp(data.main.temp), feels_like: temp(data.main.feels_like), temp_min: temp(data.main.temp_min), temp_max: temp(data.main.temp_max) },
      };
    };
    return {
      current: convert(weatherData) as WeatherData,
      hourly: forecastData.list.slice(0, 8).map(convert) as ForecastItem[],
      daily: forecastData.list.filter((item: ForecastItem) => new Date(item.dt * 1000).getDate() !== new Date(weatherData.dt * 1000).getDate()).filter((_item, i) => i % 8 === 0).slice(0, 5).map(convert) as ForecastItem[],
      allHourlyForDay: (dt: number) => forecastData.list.filter((item: ForecastItem) => new Date(item.dt * 1000).getDate() === new Date(dt * 1000).getDate()).map(convert) as ForecastItem[],
    };
  }, [weatherData, forecastData, unit]);

  const renderContent = () => {
    if (isInitialLoad) return <WeatherSkeleton />;
    if (error) return (
        <div className="bg-red-500/50 backdrop-blur-sm border border-red-700 text-white p-6 rounded-xl mt-8 text-center shadow-lg">
            <FiAlertTriangle className="mx-auto text-4xl mb-4" />
            <p className="font-bold text-xl">Oops! Algo deu errado.</p>
            <p>{error}</p>
        </div>
    );
    if (processedData) return (
        <div className="mt-8 grid grid-cols-1 gap-8 animate-fade-in">
            <CurrentWeather data={processedData.current} />
            <HourlyForecast data={processedData.hourly} />
            <DailyForecast data={processedData.daily} onDayClick={handleDayClick} />
        </div>
    );
    return null;
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <LocationSearch onSearch={(city) => fetchWeatherData({ city })} disabled={loading} />
            <div className="flex items-center bg-black/20 rounded-full p-1">
                <button onClick={() => setUnit('C')} className={`px-4 py-1 rounded-full text-sm font-bold ${unit === 'C' ? 'bg-white/30' : ''}`}>°C</button>
                <button onClick={() => setUnit('F')} className={`px-4 py-1 rounded-full text-sm font-bold ${unit === 'F' ? 'bg-white/30' : ''}`}>°F</button>
            </div>
        </div>
        {renderContent()}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedDay && processedData && <DetailedForecast dayData={selectedDay} hourlyData={processedData.allHourlyForDay(selectedDay.dt)} />}
      </Modal>
      <Footer />
    </main>
  );
}