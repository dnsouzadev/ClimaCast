"use client";

import Image from 'next/image';
import { FiWind, FiDroplet, FiThermometer, FiEye } from "react-icons/fi";
import { WeatherData } from "@/types/weather";

interface CurrentWeatherProps {
  data: WeatherData;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  if (!data) return null;

  const lastUpdated = data.dt ? new Date(data.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            {data.name}, {data.sys.country}
          </h2>
          <p className="text-md text-gray-200">
            {new Date().toLocaleDateString("pt-BR", { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <Image
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].description}
            width={96} // 4x icon size
            height={96} // 4x icon size
            className="-mt-4 filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-7xl md:text-8xl font-extrabold tracking-tighter">{data.main.temp.toFixed(1)}°C</p>
        <p className="text-xl md:text-2xl text-capitalize text-gray-200">
          {data.weather[0].description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div className="flex items-center justify-center flex-col">
          <FiThermometer className="text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-semibold">{data.main.feels_like.toFixed(1)}°C</p>
          <p className="text-gray-300 text-sm">Sensação</p>
        </div>
        <div className="flex items-center justify-center flex-col">
          <FiDroplet className="text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-semibold">{data.main.humidity}%</p>
          <p className="text-gray-300 text-sm">Umidade</p>
        </div>
        <div className="flex items-center justify-center flex-col">
          <FiWind className="text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-semibold">{data.wind.speed.toFixed(1)} km/h</p>
          <p className="text-gray-300 text-sm">Vento</p>
        </div>
        <div className="flex items-center justify-center flex-col">
          <FiEye className="text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-semibold">{(data.visibility / 1000).toFixed(1)} km</p>
          <p className="text-gray-300 text-sm">Visibilidade</p>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-400 text-center mt-6">
          Atualizado às {lastUpdated}
        </p>
      )}
    </div>
  );
}