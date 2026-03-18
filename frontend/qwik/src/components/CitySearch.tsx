import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { searchCities, type City } from '~/data/capitals';

interface CitySearchProps {
  onSearch$: (city: string) => void;
  loading: boolean;
}

export const CitySearch = component$<CitySearchProps>((props) => {
  const query = useSignal('');
  const suggestions = useSignal<City[]>([]);
  const showSuggestions = useSignal(false);
  const selectedIndex = useSignal(-1);
  const wrapperRef = useSignal<HTMLDivElement>();

  const handleInputChange = $((value: string) => {
    query.value = value;
    selectedIndex.value = -1;
    if (value.trim()) {
      const results = searchCities(value);
      suggestions.value = results;
      showSuggestions.value = results.length > 0;
    } else {
      suggestions.value = [];
      showSuggestions.value = false;
    }
  });

  const handleSelectCity = $((city: City) => {
    query.value = city.name;
    showSuggestions.value = false;
    suggestions.value = [];
    props.onSearch$(city.name);
  });

  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
      handleSelectCity(suggestions.value[selectedIndex.value]);
    } else if (query.value.trim()) {
      props.onSearch$(query.value.trim());
      showSuggestions.value = false;
    }
  });

  const handleKeyDown = $((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex.value = selectedIndex.value < suggestions.value.length - 1 ? selectedIndex.value + 1 : selectedIndex.value;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : -1;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
        handleSelectCity(suggestions.value[selectedIndex.value]);
      } else if (query.value.trim()) {
        props.onSearch$(query.value.trim());
        showSuggestions.value = false;
      }
    } else if (e.key === 'Escape') {
      showSuggestions.value = false;
    }
  });

  useVisibleTask$(({ cleanup }) => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
        showSuggestions.value = false;
      }
    };
    document.addEventListener('click', handleClickOutside);
    cleanup(() => document.removeEventListener('click', handleClickOutside));
  });

  return (
    <div ref={wrapperRef} class="relative" data-cy="city-search">
      <form onSubmit$={handleSubmit} class="flex gap-2" data-cy="city-search-form">
        <div class="relative flex-1">
          <input
            type="text"
            value={query.value}
            onInput$={(e) => handleInputChange((e.target as HTMLInputElement).value)}
            onKeyDown$={handleKeyDown}
            onFocus$={() => query.value.trim() && suggestions.value.length > 0 && (showSuggestions.value = true)}
            placeholder="Search for a city..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-cy="city-input"
            autocomplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={props.loading || !query.value.trim()}
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          data-cy="search-button"
        >
          {props.loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showSuggestions.value && (
        <ul 
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          data-cy="city-suggestions"
        >
          {suggestions.value.map((city, index) => (
            <li
              key={city.name + city.countryCode}
              onClick$={() => handleSelectCity(city)}
              class={`px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between ${index === selectedIndex.value ? 'bg-blue-50' : ''}`}
              data-cy={`city-suggestion-${index}`}
              role="option"
              aria-selected={index === selectedIndex.value}
            >
              <div>
                <span class="font-medium text-gray-900">{city.name}</span>
                <span class="text-gray-500 text-sm ml-2">{city.country}</span>
              </div>
              <span class="text-xs text-gray-400">{city.countryCode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});