"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface LocationSearchProps {
  onSearch: (city: string) => void;
  disabled: boolean;
}

export default function LocationSearch({ onSearch, disabled }: LocationSearchProps) {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && !disabled) {
      onSearch(city.trim());
      setCity("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-lg mx-auto">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Pesquise por uma cidade..."
        disabled={disabled}
        className="w-full px-6 py-3 text-white bg-black/20 border border-white/20 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-300 transition-all duration-300 ease-in-out"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-6 py-3 text-white bg-black/30 border border-white/20 rounded-r-full hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 ease-in-out disabled:opacity-50"
      >
        <FiSearch size={20} />
      </button>
    </form>
  );
}