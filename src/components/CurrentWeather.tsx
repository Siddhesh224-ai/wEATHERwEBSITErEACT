import React from 'react';
import { Droplets, Wind, Thermometer, Cloud, Compass, Sunrise, Sunset } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from './WeatherCard';

const CurrentWeather: React.FC = () => {
  const { weatherData, loading, error, favorites } = useWeather();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-pulse">
        <div className="text-center">
          <Cloud size={48} className="mx-auto mb-4 text-blue-500 dark:text-blue-400" />
          <p className="text-gray-500 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error</h3>
        <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">Please try a different city name.</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">No Weather Data</h3>
        <p className="mt-2 text-blue-700 dark:text-blue-300">Search for a city to get weather information.</p>
      </div>
    );
  }

  // Check if this city is in favorites
  const isFavorite = favorites.some(
    fav => fav.id === `${weatherData.name}-${weatherData.sys.country}`
  );

  // Format sunrise and sunset times
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  // Get weather background color based on temperature
  const getWeatherGradient = () => {
    const temp = weatherData.main.temp;
    if (temp > 30) return 'from-red-400 to-orange-500'; // Hot
    if (temp > 20) return 'from-yellow-400 to-orange-400'; // Warm
    if (temp > 10) return 'from-blue-400 to-indigo-500'; // Cool
    return 'from-blue-500 to-indigo-600'; // Cold
  };

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      {/* Main weather card */}
      <WeatherCard 
        weather={weatherData} 
        isFavorite={isFavorite}
        isCurrent={true}
      />

      {/* Additional weather details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Temperature Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3">
            <div className="flex items-center">
              <Thermometer size={18} className="mr-2 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Feels Like</p>
                <p className="font-medium dark:text-white">{Math.round(weatherData.main.feels_like)}°C</p>
              </div>
            </div>
            <div className="flex items-center">
              <Compass size={18} className="mr-2 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pressure</p>
                <p className="font-medium dark:text-white">{weatherData.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Sun Schedule
          </h3>
          <div className="grid grid-cols-2 gap-y-3">
            <div className="flex items-center">
              <Sunrise size={18} className="mr-2 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sunrise</p>
                <p className="font-medium dark:text-white">{formatTime(weatherData.sys.sunrise)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Sunset size={18} className="mr-2 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sunset</p>
                <p className="font-medium dark:text-white">{formatTime(weatherData.sys.sunset)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;