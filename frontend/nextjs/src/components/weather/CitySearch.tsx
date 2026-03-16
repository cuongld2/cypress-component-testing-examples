'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { searchCities, City } from '@/data/capitals';

interface CitySearchProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export function CitySearch({ onSearch, loading }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (value.trim()) {
      const results = searchCities(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: City) => {
    setQuery(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(city.name);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectCity(suggestions[selectedIndex]);
    } else if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectCity(suggestions[selectedIndex]);
      } else if (query.trim()) {
        onSearch(query.trim());
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative" data-cy="city-search">
      <form onSubmit={handleSubmit} className="flex gap-2" data-cy="city-search-form">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-cy="city-input"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          data-cy="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showSuggestions && (
        <ul 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          data-cy="city-suggestions"
        >
          {suggestions.map((city, index) => (
            <li
              key={`${city.name}-${city.countryCode}`}
              onClick={() => handleSelectCity(city)}
              className={`px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              data-cy={`city-suggestion-${index}`}
            >
              <div>
                <span className="font-medium text-gray-900">{city.name}</span>
                <span className="text-gray-500 text-sm ml-2">{city.country}</span>
              </div>
              <span className="text-xs text-gray-400">{city.countryCode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
