import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { WeatherData, ForecastData, ForecastItem, GeoData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// Configuração de retentativa
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 segundo

async function makeRequestWithRetry(url: string, retries = 0) {
  try {
    return await axios.get(url);
  } catch (error: unknown) {
    if (retries < MAX_RETRIES && (axios.isAxiosError(error) && error.response && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.response.status >= 500))) {
      console.warn(`Retrying ${url} (${retries + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return makeRequestWithRetry(url, retries + 1);
    } else {
      throw error;
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');

  if (!API_KEY) {
    return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
  }

  try {
    let currentLat: number | null = lat ? parseFloat(lat) : null;
    let currentLon: number | null = lon ? parseFloat(lon) : null;
    let cityName = "";

    if (city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
      const geoResponse = await makeRequestWithRetry(geoUrl) as { data: GeoData[] };
      if (geoResponse.data.length === 0) {
        return NextResponse.json({ error: `City "${city}" not found.` }, { status: 404 });
      }
      currentLat = geoResponse.data[0].lat;
      currentLon = geoResponse.data[0].lon;
      cityName = geoResponse.data[0].name;
    } else if (lat && lon) {
      const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
      const reverseGeoResponse = await makeRequestWithRetry(reverseGeoUrl) as { data: GeoData[] };
      cityName = reverseGeoResponse.data[0]?.name || 'Localização Atual';
    } else {
      return NextResponse.json({ error: "Latitude, longitude or city is required." }, { status: 400 });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${API_KEY}&units=metric&lang=pt_br`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLat}&lon=${currentLon}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      makeRequestWithRetry(weatherUrl) as Promise<{ data: WeatherData }>,
      makeRequestWithRetry(forecastUrl) as Promise<{ data: ForecastData }>,
    ]);

    const enrichedForecastList = forecastResponse.data.list.map((item: ForecastItem) => ({
      ...item,
      sunrise: weatherResponse.data.sys.sunrise,
      sunset: weatherResponse.data.sys.sunset,
    }));

    return NextResponse.json({
      weather: weatherResponse.data,
      forecast: { ...forecastResponse.data, list: enrichedForecastList },
      cityName: cityName,
    }, {
      headers: {
        'Cache-Control': 's-maxage=600, stale-while-revalidate=300', // Cache por 10 minutos, revalida em 5 minutos
      },
    });
  } catch (error: unknown) {
    console.error("API Route error:", error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.message || "Failed to fetch weather data." }, { status: error.response.status });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
