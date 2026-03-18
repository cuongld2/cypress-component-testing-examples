<script lang="ts">
  import { searchCities, type City } from '$lib/data/capitals';

  interface Props {
    onSearch: (city: string) => void;
    loading: boolean;
  }

  let { onSearch, loading }: Props = $props();

  let query = $state('');
  let suggestions = $state<City[]>([]);
  let showSuggestions = $state(false);
  let selectedIndex = $state(-1);
  let inputRef: HTMLInputElement;
  let wrapperRef: HTMLDivElement;

  function handleInputChange(value: string) {
    query = value;
    selectedIndex = -1;
    if (value.trim()) {
      const results = searchCities(value);
      suggestions = results;
      showSuggestions = results.length > 0;
    } else {
      suggestions = [];
      showSuggestions = false;
    }
  }

  function handleSelectCity(city: City) {
    query = city.name;
    showSuggestions = false;
    suggestions = [];
    onSearch(city.name);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectCity(suggestions[selectedIndex]);
    } else if (query.trim()) {
      onSearch(query.trim());
      showSuggestions = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : selectedIndex;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectCity(suggestions[selectedIndex]);
      } else if (query.trim()) {
        onSearch(query.trim());
        showSuggestions = false;
      }
    } else if (e.key === 'Escape') {
      showSuggestions = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (wrapperRef && !wrapperRef.contains(event.target as Node)) {
      showSuggestions = false;
    }
  }

  $effect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<div bind:this={wrapperRef} class="relative" data-cy="city-search">
  <form onsubmit={handleSubmit} class="flex gap-2" data-cy="city-search-form">
    <div class="relative flex-1">
      <input
        bind:this={inputRef}
        type="text"
        value={query}
        oninput={(e) => handleInputChange(e.currentTarget.value)}
        onkeydown={handleKeyDown}
        onfocus={() => query.trim() && suggestions.length > 0 && (showSuggestions = true)}
        placeholder="Search for a city..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-cy="city-input"
        autocomplete="off"
      />
    </div>
    <button
      type="submit"
      disabled={loading || !query.trim()}
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      data-cy="search-button"
    >
      {loading ? 'Searching...' : 'Search'}
    </button>
  </form>

  {#if showSuggestions}
    <ul 
      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
      data-cy="city-suggestions"
    >
      {#each suggestions as city, index (city.name + city.countryCode)}
        <li
          onclick={() => handleSelectCity(city)}
          onkeydown={(e) => e.key === 'Enter' && handleSelectCity(city)}
          class="px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between {index === selectedIndex ? 'bg-blue-50' : ''}"
          data-cy="city-suggestion-{index}"
          role="option"
          aria-selected={index === selectedIndex}
          tabindex="0"
        >
          <div>
            <span class="font-medium text-gray-900">{city.name}</span>
            <span class="text-gray-500 text-sm ml-2">{city.country}</span>
          </div>
          <span class="text-xs text-gray-400">{city.countryCode}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>