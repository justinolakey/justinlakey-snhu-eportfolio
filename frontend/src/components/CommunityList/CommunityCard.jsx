import './CommunityList.css';

function fmt(n) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
}

const STATUS_LABEL = {
  AVAILABLE: { text: 'Available', cls: 'badge-available' },
  COMING_SOON: { text: 'Coming Soon', cls: 'badge-soon' },
  SOLD_OUT: { text: 'Sold Out', cls: 'badge-sold' },
};

export default function CommunityCard({ community, selected, onClick }) {
  const homes = community.homes ?? [];
  const prices = homes.map((h) => h.priceMin);
  const beds = homes.map((h) => h.bedrooms);
  const baths = homes.map((h) => h.bathrooms);

  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const minBed = beds.length ? Math.min(...beds) : null;
  const maxBed = beds.length ? Math.max(...beds) : null;
  const minBath = baths.length ? Math.min(...baths) : null;
  const maxBath = baths.length ? Math.max(...baths) : null;

  const statuses = [...new Set(homes.map((h) => h.status))];

  return (
    <li className={`community-card${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="card-top">
        <div>
          <p className="card-name">{community.name}</p>
          <p className="card-builder">{community.builder}</p>
        </div>
        <div className="card-badges">
          {statuses.map((s) => (
            <span key={s} className={`badge ${STATUS_LABEL[s]?.cls}`}>
              {STATUS_LABEL[s]?.text ?? s}
            </span>
          ))}
        </div>
      </div>

      <p className="card-location">
        📍 {community.city}, {community.state} {community.zipCode}
      </p>

      {homes.length > 0 && (
        <div className="card-stats">
          <div className="stat">
            <span className="stat-val">{minPrice ? fmt(minPrice) : '—'}{maxPrice && maxPrice !== minPrice ? ` – ${fmt(maxPrice)}` : ''}</span>
            <span className="stat-lbl">Price</span>
          </div>
          <div className="stat">
            <span className="stat-val">{minBed === maxBed ? minBed : `${minBed}–${maxBed}`}</span>
            <span className="stat-lbl">Beds</span>
          </div>
          <div className="stat">
            <span className="stat-val">{minBath === maxBath ? minBath : `${minBath}–${maxBath}`}</span>
            <span className="stat-lbl">Baths</span>
          </div>
          <div className="stat">
            <span className="stat-val">{homes.length}</span>
            <span className="stat-lbl">Models</span>
          </div>
        </div>
      )}
    </li>
  );
}
