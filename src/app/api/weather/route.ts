import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');

  if (!API_KEY) {
    return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
  }

  try {
    let currentLat = lat;
    let currentLon = lon;
    let cityName = "";

    if (city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
      const geoResponse = await axios.get(geoUrl);
      if (geoResponse.data.length === 0) {
        return NextResponse.json({ error: `City "${city}" not found.` }, { status: 404 });
      }
      currentLat = geoResponse.data[0].lat;
      currentLon = geoResponse.data[0].lon;
      cityName = geoResponse.data[0].name;
    } else if (lat && lon) {
      const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
      const reverseGeoResponse = await axios.get(reverseGeoUrl);
      cityName = reverseGeoResponse.data[0]?.name || 'Localização Atual';
    } else {
      return NextResponse.json({ error: "Latitude, longitude or city is required." }, { status: 400 });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${API_KEY}&units=metric&lang=pt_br`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLat}&lon=${currentLon}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl),
    ]);

    const enrichedForecastList = forecastResponse.data.list.map((item: any) => ({
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
  } catch (error: any) {
    console.error("API Route error:", error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.message || "Failed to fetch weather data." }, { status: error.response.status });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}