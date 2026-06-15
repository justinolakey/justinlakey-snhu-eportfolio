import { useState, useMemo } from 'react';
import { useCommunities } from './hooks/useCommunities';
import { useAuth } from './contexts/AuthContext';
import FilterPanel from './components/FilterPanel/FilterPanel';
import CommunityList from './components/CommunityList/CommunityList';
import MapView from './components/Map/MapView';
import AuthModal from './components/Auth/AuthModal';
import AddCommunityModal from './components/AddCommunity/AddCommunityModal';
import AdminPanel from './components/AdminPanel/AdminPanel';
import './App.css';

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
  const [locationInput, setLocationInput] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null); // 'auth' | 'add' | 'admin'

  const { communities, loading, error, refetch } = useCommunities(appliedFilters);
  const { user, logout } = useAuth();

  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  const locationMatches = useMemo(() => {
    if (!appliedLocation) return [];
    const term = appliedLocation.toLowerCase();
    return communities.filter(
      (c) =>
        c.city.toLowerCase().includes(term) ||
        c.state.toLowerCase().includes(term) ||
        c.zipCode.includes(term)
    );
  }, [communities, appliedLocation]);

  const focusBounds = useMemo(() => {
    if (locationMatches.length === 0) return null;
    return locationMatches.map((c) => [c.latitude, c.longitude]);
  }, [locationMatches]);

  const sortedCommunities = useMemo(() => {
    if (sortBy === 'price-asc') return [...communities].sort((a, b) => a.priceMin - b.priceMin);
    if (sortBy === 'price-desc') return [...communities].sort((a, b) => b.priceMax - a.priceMax);
    if (sortBy === 'distance' && locationMatches.length > 0) {
      const centerLat = locationMatches.reduce((s, c) => s + c.latitude, 0) / locationMatches.length;
      const centerLng = locationMatches.reduce((s, c) => s + c.longitude, 0) / locationMatches.length;
      return [...communities].sort(
        (a, b) =>
          haversine(a.latitude, a.longitude, centerLat, centerLng) -
          haversine(b.latitude, b.longitude, centerLat, centerLng)
      );
    }
    return communities;
  }, [communities, sortBy, locationMatches]);

  function handleCreated() {
    refetch();
  }

  function applyLocation() {
    const trimmed = locationInput.trim();
    setAppliedLocation(trimmed);
    if (trimmed) setSortBy('distance');
  }

  function clearLocation() {
    setLocationInput('');
    setAppliedLocation('');
    setSortBy('default');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">⌂</span>
          <h1>New Home Communities</h1>
        </div>

        <div className="header-right">
          <span className="header-count">
            {loading ? 'Searching…' : `${sortedCommunities.length} communit${sortedCommunities.length === 1 ? 'y' : 'ies'} found`}
          </span>

          {user ? (
            <>
              <span className="header-user">{user.email}</span>
              {user.status === 'APPROVED' && (
                <button className="btn-header btn-header-accent" onClick={() => setModal('add')}>
                  + Add Community
                </button>
              )}
              {user.role === 'ADMIN' && (
                <button className="btn-header" onClick={() => setModal('admin')}>
                  Admin
                </button>
              )}
              <button className="btn-header" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <button className="btn-header" onClick={() => setModal('auth')}>Sign In</button>
          )}
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="location-search-bar">
            <div className="location-search-input-wrap">
              <input
                type="text"
                placeholder="Search by city, state, or ZIP…"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyLocation()}
              />
              {appliedLocation && (
                <button className="location-clear-btn" onClick={clearLocation} title="Clear location search">✕</button>
              )}
            </div>
            <button className="location-search-btn" onClick={applyLocation}>Search</button>
          </div>
          {appliedLocation && (
            <p className="location-label">Showing results near "{appliedLocation}"</p>
          )}

          <FilterPanel
            filters={pendingFilters}
            onChange={setPendingFilters}
            onApply={() => setAppliedFilters({ ...pendingFilters })}
            onClear={() => {
              setPendingFilters(EMPTY_FILTERS);
              setAppliedFilters(EMPTY_FILTERS);
              setLocationInput('');
              setAppliedLocation('');
            }}
          />
          <div className="sort-bar">
            <label htmlFor="sort-select">Sort</label>
            <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default (A–Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="distance" disabled={!appliedLocation}>
                {appliedLocation ? 'Closest to Location' : 'Closest to Location (search a location first)'}
              </option>
            </select>
          </div>

          <div className="list-scroll">
            {error && <p className="error-notice">{error}</p>}
            <CommunityList
              communities={sortedCommunities}
              loading={loading}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </aside>

        <main className="map-area">
          <MapView
            communities={sortedCommunities}
            selectedId={selectedId}
            onSelect={handleSelect}
            focusBounds={focusBounds}
          />
        </main>
      </div>

      {modal === 'auth' && <AuthModal onClose={() => setModal(null)} />}
      {modal === 'add' && (
        <AddCommunityModal onClose={() => setModal(null)} onCreated={handleCreated} />
      )}
      {modal === 'admin' && <AdminPanel onClose={() => setModal(null)} />}
    </div>
  );
}
