import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SearchBar: React.FC = () => {
  const { searchCity, loading } = useWeather();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCity(query);
    }
  };

  // Focus search input on mount
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-md mx-auto group transition-all duration-300"
    >
      <input
        ref={searchRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="w-full py-3 pl-4 pr-12 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 dark:text-white"
        disabled={loading}
      />
      <button 
        type="submit" 
        disabled={loading || !query.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 transition-colors duration-300"
        aria-label="Search"
      >
        <Search size={20} className={loading ? 'animate-pulse' : ''} />
      </button>
    </form>
  );
};

export default SearchBar;