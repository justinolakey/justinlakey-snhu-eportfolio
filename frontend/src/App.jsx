import { useState } from 'react';
import { useCommunities } from './hooks/useCommunities';
import { useAuth } from './contexts/AuthContext';
import FilterPanel from './components/FilterPanel/FilterPanel';
import CommunityList from './components/CommunityList/CommunityList';
import MapView from './components/Map/MapView';
import AuthModal from './components/Auth/AuthModal';
import AddCommunityModal from './components/AddCommunity/AddCommunityModal';
import AdminPanel from './components/AdminPanel/AdminPanel';
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
  const [modal, setModal] = useState(null); // 'auth' | 'add' | 'admin'

  const { communities, loading, error, refetch } = useCommunities(appliedFilters);
  const { user, logout } = useAuth();

  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleCreated() {
    refetch();
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
            {loading ? 'Searching…' : `${communities.length} communit${communities.length === 1 ? 'y' : 'ies'} found`}
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

      {modal === 'auth' && <AuthModal onClose={() => setModal(null)} />}
      {modal === 'add' && (
        <AddCommunityModal onClose={() => setModal(null)} onCreated={handleCreated} />
      )}
      {modal === 'admin' && <AdminPanel onClose={() => setModal(null)} />}
    </div>
  );
}
