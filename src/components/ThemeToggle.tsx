import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useWeather();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-colors duration-200 
        bg-gray-200 dark:bg-gray-700 
        hover:bg-gray-300 dark:hover:bg-gray-600
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-indigo-700" />
      )}
    </button>
  );
};

export default ThemeToggle;