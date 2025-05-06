import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type WeatherData = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
};

export type FavoriteCity = {
  id: string;
  name: string;
  country: string;
};

type WeatherContextType = {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  searchCity: (city: string) => Promise<void>;
  favorites: FavoriteCity[];
  addToFavorites: (city: string, country: string) => void;
  removeFromFavorites: (id: string) => void;
  lastSearched: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Helper function to get weather icon based on WMO code
const getWeatherIcon = (code: number): string => {
  // Map WMO codes to OpenWeatherMap icon codes for compatibility
  const wmoToOwmMap: { [key: number]: string } = {
    0: '01d', // Clear sky
    1: '02d', // Mainly clear
    2: '03d', // Partly cloudy
    3: '04d', // Overcast
    45: '50d', // Foggy
    48: '50d', // Depositing rime fog
    51: '09d', // Light drizzle
    53: '09d', // Moderate drizzle
    55: '09d', // Dense drizzle
    61: '10d', // Slight rain
    63: '10d', // Moderate rain
    65: '10d', // Heavy rain
    71: '13d', // Slight snow
    73: '13d', // Moderate snow
    75: '13d', // Heavy snow
    95: '11d', // Thunderstorm
  };
  return wmoToOwmMap[code] || '01d';
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [lastSearched, setLastSearched] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true'
  );

  // Load favorites and initialize weather data
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    // Check for last searched city
    const lastCity = localStorage.getItem('lastSearched');
    if (lastCity) {
      setLastSearched(lastCity);
      searchCity(lastCity);
    } else {
      // Get user's location with proper error handling
      const getUserLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            } catch (err) {
              console.error('Error fetching weather for current location:', err);
              // Fallback to default city
              await searchCity('London');
            } finally {
              setLoading(false);
            }
          },
          async (err) => {
            console.warn('Geolocation error:', err.message);
            setError('Location access denied. Showing default city.');
            // Fallback to default city
            await searchCity('London');
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      };

      if (navigator.geolocation) {
        getUserLocation();
      } else {
        searchCity('London');
      }
    }
    
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle dark mode toggle
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const searchCity = async (city: string) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First, get coordinates for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      
      if (!geoResponse.ok) {
        throw new Error('City not found');
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results?.[0]) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name, country_code } = geoData.results[0];
      
      // Then get weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      // Transform the data to match our WeatherData type
      const transformedData: WeatherData = {
        name: name,
        main: {
          temp: current.temperature_2m,
          feels_like: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          pressure: current.pressure_msl,
        },
        weather: [{
          id: current.weather_code,
          main: 'Weather',
          description: 'Current weather',
          icon: getWeatherIcon(current.weather_code),
        }],
        wind: {
          speed: current.wind_speed_10m,
          deg: 0,
        },
        sys: {
          country: country_code,
          sunrise: Math.floor(Date.now() / 1000),
          sunset: Math.floor(Date.now() / 1000 + 43200),
        },
        dt: Math.floor(Date.now() / 1000),
        timezone: 0,
        coord: {
          lat: latitude,
          lon: longitude,
        },
      };

      setWeatherData(transformedData);
      setLastSearched(city);
      localStorage.setItem('lastSearched', city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get weather data for coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code&timezone=auto`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      // Get city name from reverse geocoding
      const reverseGeoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`
      );
      
      if (!reverseGeoResponse.ok) {
        throw new Error('Location not found');
      }

      const geoData = await reverseGeoResponse.json();
      const locationInfo = geoData.results?.[0] || { name: 'Unknown', country_code: 'UN' };

      const transformedData: WeatherData = {
        name: locationInfo.name,
        main: {
          temp: current.temperature_2m,
          feels_like: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          pressure: current.pressure_msl,
        },
        weather: [{
          id: current.weather_code,
          main: 'Weather',
          description: 'Current weather',
          icon: getWeatherIcon(current.weather_code),
        }],
        wind: {
          speed: current.wind_speed_10m,
          deg: 0,
        },
        sys: {
          country: locationInfo.country_code,
          sunrise: Math.floor(Date.now() / 1000),
          sunset: Math.floor(Date.now() / 1000 + 43200),
        },
        dt: Math.floor(Date.now() / 1000),
        timezone: 0,
        coord: {
          lat,
          lon,
        },
      };

      setWeatherData(transformedData);
      setLastSearched(locationInfo.name);
      localStorage.setItem('lastSearched', locationInfo.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
      throw err; // Re-throw to handle in the calling function
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (city: string, country: string) => {
    const id = `${city}-${country}`;
    // Check if already in favorites
    if (!favorites.some(fav => fav.id === id)) {
      const newFavorite = { id, name: city, country };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(city => city.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const value = {
    weatherData,
    loading,
    error,
    searchCity,
    favorites,
    addToFavorites,
    removeFromFavorites,
    lastSearched,
    darkMode,
    toggleDarkMode
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};