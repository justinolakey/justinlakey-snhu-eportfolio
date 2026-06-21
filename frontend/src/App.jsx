// Root application component.
// Renders the full-page layout: header with auth controls, a sidebar with
// location search + filters + sort + community list, and the interactive map.

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

// Calculates the great-circle distance (in miles) between two lat/lng points.
// Used to sort communities by proximity to a searched location.
function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth's radius in miles
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Default empty state for all filter inputs
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
  // Filter state: pendingFilters are the form inputs, appliedFilters are sent to the API
  const [pendingFilters, setPendingFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  // Location search state
  const [locationInput, setLocationInput] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');

  const [sortBy, setSortBy] = useState('default');
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null); // 'auth' | 'add' | 'admin'

  const { communities, loading, error, refetch } = useCommunities(appliedFilters);
  const { user, logout } = useAuth();

  // Toggle selection — clicking the same community deselects it
  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  // Communities whose city, state, or ZIP match the location search term.
  // Used for both distance sorting and map focus bounds.
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

  // Lat/lng bounds of matching communities — passed to MapView to zoom into the region
  const focusBounds = useMemo(() => {
    if (locationMatches.length === 0) return null;
    return locationMatches.map((c) => [c.latitude, c.longitude]);
  }, [locationMatches]);

  // Sorts communities based on the selected sort option.
  // "distance" computes the geographic center of matching communities
  // and sorts all communities by distance from that center.
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
    return communities; // Default: alphabetical (server-side order)
  }, [communities, sortBy, locationMatches]);

  // Refresh the community list after a new one is created
  function handleCreated() {
    refetch();
  }

  // Apply the current location search input and switch to distance sort
  function applyLocation() {
    const trimmed = locationInput.trim();
    setAppliedLocation(trimmed);
    if (trimmed) setSortBy('distance');
  }

  // Clear location search and reset sort to default
  function clearLocation() {
    setLocationInput('');
    setAppliedLocation('');
    setSortBy('default');
  }

  return (
    <div className="app">
      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">⌂</span>
          <h1>New Home Communities</h1>
        </div>

        <div className="header-right">
          <span className="header-count">
            {loading ? 'Searching…' : `${sortedCommunities.length} communit${sortedCommunities.length === 1 ? 'y' : 'ies'} found`}
          </span>

          {/* Show user controls when logged in, or a Sign In button when not */}
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

      {/* ─── Main content: sidebar + map ─── */}
      <div className="app-body">
        <aside className="sidebar">
          {/* Location search bar */}
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

          {/* Property filters (price, sqft, lot, beds, baths) */}
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

          {/* Sort dropdown */}
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

          {/* Scrollable community list */}
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

        {/* Interactive Leaflet map */}
        <main className="map-area">
          <MapView
            communities={sortedCommunities}
            selectedId={selectedId}
            onSelect={handleSelect}
            focusBounds={focusBounds}
          />
        </main>
      </div>

      {/* Modals, rendered conditionally based on authentication status */}
      {modal === 'auth' && <AuthModal onClose={() => setModal(null)} />}
      {modal === 'add' && (
        <AddCommunityModal onClose={() => setModal(null)} onCreated={handleCreated} />
      )}
      {modal === 'admin' && <AdminPanel onClose={() => setModal(null)} />}
    </div>
  );
}
