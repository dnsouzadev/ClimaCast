"use client";

import Image from 'next/image';
import { ForecastItem } from "@/types/weather";

interface DailyForecastProps {
  data: ForecastItem[];
  onDayClick: (dayData: ForecastItem) => void;
}

export default function DailyForecast({ data, onDayClick }: DailyForecastProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">Próximos 5 Dias</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {data.map((item: ForecastItem, index: number) => (
          <div 
            key={index} 
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg text-center text-white cursor-pointer hover:bg-white/20 transition-all duration-300"
            onClick={() => onDayClick(item)}
          >
            <h5 className="font-semibold text-lg">
              {new Date(item.dt * 1000).toLocaleDateString("pt-BR", {
                weekday: "short",
              })}
            </h5>
            <Image
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              width={80} // 2x icon size
              height={80} // 2x icon size
              className="mx-auto filter drop-shadow-lg"
            />
            <p className="text-xl font-bold">{item.main.temp_max.toFixed(0)}°C</p>
            <p className="text-gray-300 text-sm">{item.main.temp_min.toFixed(0)}°C</p>
            <p className="text-xs text-capitalize mt-2 text-gray-200">{item.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
