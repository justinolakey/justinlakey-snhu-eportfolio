import { useState } from 'react';
import { useCommunities } from './hooks/useCommunities';
import FilterPanel from './components/FilterPanel/FilterPanel';
import CommunityList from './components/CommunityList/CommunityList';
import MapView from './components/Map/MapView';
import './App.css';

const EMPTY_FILTERS = {
  priceMin: '',
  priceMax: '',
  sqftMin: '',
  sqftMax: '',
  lotSizeMin: '',
  lotSizeMax: '',
  bedrooms: '',
  bathrooms: '',
};

export default function App() {
  const [pendingFilters, setPendingFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState(null);

  const { communities, loading, error } = useCommunities(appliedFilters);

  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">⌂</span>
          <h1>New Home Communities</h1>
        </div>
        <span className="header-count">
          {loading ? 'Searching…' : `${communities.length} communit${communities.length === 1 ? 'y' : 'ies'} found`}
        </span>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <FilterPanel
            filters={pendingFilters}
            onChange={setPendingFilters}
            onApply={() => setAppliedFilters({ ...pendingFilters })}
            onClear={() => {
              setPendingFilters(EMPTY_FILTERS);
              setAppliedFilters(EMPTY_FILTERS);
            }}
          />
          <div className="list-scroll">
            {error && <p className="error-notice">{error}</p>}
            <CommunityList
              communities={communities}
              loading={loading}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </aside>

        <main className="map-area">
          <MapView
            communities={communities}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </main>
      </div>
    </div>
  );
}
