"use client";

import { FiSunrise, FiSunset, FiWind, FiBarChart2, FiDroplet } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ForecastItem } from "@/types/weather";

interface DetailedForecastProps {
  dayData: ForecastItem;
  hourlyData: ForecastItem[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/50 p-2 border border-white/20 rounded-md">
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Temp: ${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

export default function DetailedForecast({ dayData, hourlyData }: DetailedForecastProps) {
  if (!dayData) return null;

  const chartData = hourlyData.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    temp: item.main.temp.toFixed(1),
  }));

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-4">
        Previsão para {new Date(dayData.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Variação da Temperatura</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white/10 p-4 rounded-lg">
          <FiDroplet className="mx-auto text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-bold">{(dayData.pop * 100).toFixed(0)}%</p>
          <p className="text-gray-300">Precipitação</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <FiWind className="mx-auto text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-bold">{dayData.wind.speed.toFixed(1)} km/h</p>
          <p className="text-gray-300">Vento</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <FiBarChart2 className="mx-auto text-3xl text-sky-300 mb-2" />
          <p className="text-xl font-bold">{dayData.main.pressure} hPa</p>
          <p className="text-gray-300">Pressão</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg col-span-2 md:col-span-3 grid grid-cols-2 gap-4">
            <div>
                <FiSunrise className="mx-auto text-3xl text-yellow-300 mb-2" />
                <p className="text-xl font-bold">{new Date(dayData.sunrise! * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-gray-300">Nascer do Sol</p>
            </div>
            <div>
                <FiSunset className="mx-auto text-3xl text-orange-400 mb-2" />
                <p className="text-xl font-bold">{new Date(dayData.sunset! * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-gray-300">Pôr do Sol</p>
            </div>
        </div>
      </div>
    </div>
  );
}