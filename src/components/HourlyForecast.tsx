"use client";

import Image from 'next/image';
import { ForecastItem } from "@/types/weather";

interface HourlyForecastProps {
  data: ForecastItem[];
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">Próximas Horas</h3>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {data.map((item: ForecastItem, index: number) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg w-36 text-center text-white"
          >
            <h5 className="font-semibold text-lg">
              {new Date(item.dt * 1000).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h5>
            <Image
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              width={64} // 2x icon size
              height={64} // 2x icon size
              className="mx-auto filter drop-shadow-lg"
            />
            <p className="text-2xl font-bold">{item.main.temp.toFixed(1)}°C</p>
            <p className="text-sm text-gray-300 text-capitalize">{item.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
