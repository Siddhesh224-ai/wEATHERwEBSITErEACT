import React from 'react';
import { Cloud, Droplets, Wind, Star, Trash2 } from 'lucide-react';
import { WeatherData, FavoriteCity, useWeather } from '../context/WeatherContext';

type WeatherCardProps = {
  weather: WeatherData;
  isFavorite?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weather, 
  isFavorite = false,
  isCurrent = false,
  onClick 
}) => {
  const { addToFavorites, removeFromFavorites } = useWeather();
  
  // Generate a date string based on the timezone offset
  const getLocalTime = () => {
    const date = new Date(weather.dt * 1000);
    // Adjust for timezone offset (convert seconds to milliseconds)
    const localTime = new Date(date.getTime() + (weather.timezone * 1000));
    return localTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  // Get appropriate weather icon
  const getWeatherIcon = () => {
    const iconCode = weather.weather[0].icon;
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(`${weather.name}-${weather.sys.country}`);
    } else {
      addToFavorites(weather.name, weather.sys.country);
    }
  };

  return (
    <div 
      className={`
        relative 
        p-4 
        rounded-lg 
        shadow-md 
        transition-all 
        duration-500
        ${isCurrent ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 'bg-white dark:bg-gray-800 dark:text-white hover:shadow-lg cursor-pointer'}
        ${onClick ? 'transform hover:-translate-y-1' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            {weather.name}, {weather.sys.country}
          </h3>
          <p className="text-sm opacity-80">{getLocalTime()}</p>
        </div>
        <button 
          onClick={handleFavoriteToggle}
          className={`
            p-2 
            rounded-full 
            transition-colors
            ${isCurrent && !isFavorite ? 'hover:bg-blue-700 text-white' : ''}
            ${isCurrent && isFavorite ? 'text-yellow-300 hover:bg-blue-700' : ''}
            ${!isCurrent && !isFavorite ? 'text-gray-400 hover:text-yellow-500 dark:text-gray-300 dark:hover:text-yellow-300' : ''}
            ${!isCurrent && isFavorite ? 'text-yellow-500 hover:text-red-500 dark:text-yellow-300 dark:hover:text-red-400' : ''}
          `}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            isCurrent ? <Star size={20} fill="currentColor" /> : <Trash2 size={20} />
          ) : (
            <Star size={20} />
          )}
        </button>
      </div>

      <div className="flex items-center mt-4">
        <img 
          src={getWeatherIcon()} 
          alt={weather.weather[0].description} 
          className="w-16 h-16"
        />
        <div className="ml-2">
          <h2 className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</h2>
          <p className="capitalize">{weather.weather[0].description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center">
          <Droplets size={18} className="mr-2 text-blue-400" />
          <span>{weather.main.humidity}% Humidity</span>
        </div>
        <div className="flex items-center">
          <Wind size={18} className="mr-2 text-blue-400" />
          <span>{Math.round(weather.wind.speed)} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;