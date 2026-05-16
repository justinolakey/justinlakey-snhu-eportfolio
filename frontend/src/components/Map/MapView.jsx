import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import './MapView.css';

function fmt(n) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;
}

function FitBounds({ communities }) {
  const map = useMap();
  const prevKey = useRef('');

  useEffect(() => {
    if (communities.length === 0) return;
    const key = communities.map((c) => c.id).join(',');
    if (key === prevKey.current) return;
    prevKey.current = key;
    const bounds = communities.map((c) => [c.latitude, c.longitude]);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
  }, [communities, map]);

  return null;
}

function PanToSelected({ communities, selectedId }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;
    const c = communities.find((x) => x.id === selectedId);
    if (c) map.panTo([c.latitude, c.longitude], { animate: true, duration: 0.5 });
  }, [selectedId, communities, map]);

  return null;
}

function CommunityMarker({ community, selected, onSelect }) {
  const markerRef = useRef(null);
  const homes = community.homes ?? [];
  const prices = homes.map((h) => h.priceMin);
  const beds = homes.map((h) => h.bedrooms);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const minBed = beds.length ? Math.min(...beds) : null;
  const maxBed = beds.length ? Math.max(...beds) : null;

  useEffect(() => {
    if (selected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [selected]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[community.latitude, community.longitude]}
      radius={selected ? 14 : 10}
      pathOptions={{
        fillColor: selected ? '#e63946' : '#0f3460',
        fillOpacity: 0.88,
        color: '#fff',
        weight: 2,
      }}
      eventHandlers={{ click: () => onSelect(community.id) }}
    >
      <Popup>
        <div className="map-popup">
          <strong className="popup-name">{community.name}</strong>
          <span className="popup-builder">{community.builder}</span>
          <span className="popup-location">{community.city}, {community.state}</span>
          {minPrice && (
            <span className="popup-price">From {fmt(minPrice)}</span>
          )}
          {minBed && (
            <span className="popup-detail">
              {minBed === maxBed ? `${minBed} bed` : `${minBed}–${maxBed} beds`}
              &nbsp;· {homes.length} model{homes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default function MapView({ communities, selectedId, onSelect }) {
  return (
    <MapContainer center={[31.5, -97.5]} zoom={6} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds communities={communities} />
      <PanToSelected communities={communities} selectedId={selectedId} />
      {communities.map((c) => (
        <CommunityMarker
          key={c.id}
          community={c}
          selected={selectedId === c.id}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  );
}
