// src/utils/cache.ts

import { CachedWeather } from "@/types/weather";

const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutos

export const getCache = (key: string): CachedWeather | null => {
  if (typeof window === 'undefined') return null;

  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value as CachedWeather;
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
};

export const setCache = (key: string, value: CachedWeather) => {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + CACHE_EXPIRATION_MS,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
};
