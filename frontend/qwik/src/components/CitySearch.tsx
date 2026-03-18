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

  const handleInput = $((e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    query.value = value;
    selectedIndex.value = -1;
    if (value.trim()) {
      suggestions.value = searchCities(value);
      showSuggestions.value = suggestions.value.length > 0;
    } else {
      suggestions.value = [];
      showSuggestions.value = false;
    }
  });

  const selectCity = $((city: City) => {
    query.value = city.name;
    showSuggestions.value = false;
    suggestions.value = [];
    props.onSearch$(city.name);
  });

  const doSearch = $((value: string) => {
    if (props.loading) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    props.onSearch$(trimmed);
  });

  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
      selectCity(suggestions.value[selectedIndex.value]);
    } else {
      doSearch(query.value);
    }
  });

  const handleButtonClick = $((e: MouseEvent) => {
    e.preventDefault();
    if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
      selectCity(suggestions.value[selectedIndex.value]);
    } else {
      doSearch(query.value);
    }
  });

  const handleKeyDown = $((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
        selectCity(suggestions.value[selectedIndex.value]);
      } else if (query.value.trim()) {
        doSearch(query.value);
      }
    } else if (e.key === 'Escape') {
      showSuggestions.value = false;
    }
  });

  useVisibleTask$(({ cleanup }) => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
        showSuggestions.value = false;
      }
    };
    document.addEventListener('click', handler);
    cleanup(() => document.removeEventListener('click', handler));
  });

  return (
    <div ref={wrapperRef} class="relative" data-cy="city-search">
      <form onSubmit$={handleSubmit} class="flex gap-2" data-cy="city-search-form">
        <div class="relative flex-1">
          <input
            type="text"
            value={query.value}
            onInput$={handleInput}
            onKeyDown$={handleKeyDown}
            placeholder="Search for a city..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-cy="city-input"
            autocomplete="off"
          />
        </div>
        <button
          type="button"
          onClick$={handleButtonClick}
          disabled={props.loading || !query.value.trim()}
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          data-cy="search-button"
        >
          {props.loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showSuggestions.value && suggestions.value.length > 0 && (
        <ul class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto" data-cy="city-suggestions">
          {suggestions.value.map((city, i) => (
            <li
              key={city.name + city.countryCode}
              onClick$={() => selectCity(city)}
              class={`px-4 py-3 cursor-pointer hover:bg-blue-50 ${i === selectedIndex.value ? 'bg-blue-50' : ''}`}
              data-cy={`city-suggestion-${i}`}
            >
              <span class="font-medium">{city.name}</span>
              <span class="text-gray-500 text-sm ml-2">{city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
