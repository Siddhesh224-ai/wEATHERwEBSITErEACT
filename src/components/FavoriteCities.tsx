import React, { useState } from 'react';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const FavoriteCities: React.FC = () => {
  const { favorites, searchCity } = useWeather();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCityClick = (city: string) => {
    searchCity(city);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 md:static md:mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center max-w-xs">
          <Star className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={24} />
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Add cities to your favorites for quick access
          </p>
        </div>
      </div>
    );
  }

  // Mobile sidebar toggle
  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-20"
        aria-label={isExpanded ? "Close favorites" : "Open favorites"}
      >
        {isExpanded ? <ChevronRight size={24} /> : <Star size={24} />}
      </button>

      {/* Favorites sidebar */}
      <div
        className={`
          fixed md:static top-0 right-0 h-full md:h-auto
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800 shadow-lg md:shadow-none
          z-10 md:z-0
          ${isExpanded ? 'w-64' : 'w-0 md:w-full overflow-hidden md:overflow-visible'}
          md:mt-8
        `}
      >
        <div className="p-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Star className="mr-2 text-yellow-500" size={18} />
              Favorite Cities
            </h3>
            {/* Close button for mobile only */}
            <button
              onClick={() => setIsExpanded(false)}
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Close favorites"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {favorites.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCityClick(city.name)}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Star className="mr-2 text-yellow-500" size={16} fill="currentColor" />
                  <span className="text-gray-800 dark:text-white">
                    {city.name}, {city.country}
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FavoriteCities;