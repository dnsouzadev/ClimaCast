import React from 'react';

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-pulse ${className}`} />
);

export default function WeatherSkeleton() {
  return (
    <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 gap-8">
      {/* Current Weather Skeleton */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-10 w-64 bg-gray-500/50 rounded-md mb-2"></div>
            <div className="h-6 w-48 bg-gray-500/50 rounded-md"></div>
          </div>
          <div className="w-24 h-24 bg-gray-500/50 rounded-full"></div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div className="h-28 w-56 bg-gray-500/50 rounded-md"></div>
          <div className="h-8 w-40 bg-gray-500/50 rounded-md"></div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-20 bg-gray-500/50 rounded-md"></div>
          <div className="h-20 bg-gray-500/50 rounded-md"></div>
          <div className="h-20 bg-gray-500/50 rounded-md"></div>
          <div className="h-20 bg-gray-500/50 rounded-md"></div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div>
        <div className="h-8 w-64 bg-gray-500/50 rounded-md mb-4"></div>
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} className="w-36 h-48" />
          ))}
        </div>
      </div>

      {/* Daily Forecast Skeleton */}
      <div>
        <div className="h-8 w-80 bg-gray-500/50 rounded-md mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} className="h-56" />
          ))}
        </div>
      </div>
    </div>
  );
}
