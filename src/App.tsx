import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import FavoriteCities from './components/FavoriteCities';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Weather Dashboard
              </h1>
              <ThemeToggle />
            </div>
            <SearchBar />
          </header>

          <main className="md:flex md:gap-8">
            <div className="md:flex-grow">
              <CurrentWeather />
            </div>
            <div className="md:w-64">
              <FavoriteCities />
            </div>
          </main>
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;