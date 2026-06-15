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
  const {
    priceMin, priceMax, sqftMin, sqftMax, bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax, status,
  } = community;

  return (
    <li className={`community-card${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="card-top">
        <div>
          <p className="card-name">{community.name}</p>
          <p className="card-builder">{community.builder}</p>
        </div>
        <div className="card-badges">
          <span className={`badge ${STATUS_LABEL[status]?.cls}`}>
            {STATUS_LABEL[status]?.text ?? status}
          </span>
        </div>
      </div>

      <p className="card-location">
        📍 {community.city}, {community.state} {community.zipCode}
      </p>

      <div className="card-stats">
        <div className="stat">
          <span className="stat-val">{fmt(priceMin)}{priceMax !== priceMin ? ` – ${fmt(priceMax)}` : ''}</span>
          <span className="stat-lbl">Price</span>
        </div>
        <div className="stat">
          <span className="stat-val">{sqftMin === sqftMax ? sqftMin.toLocaleString() : `${sqftMin.toLocaleString()}–${sqftMax.toLocaleString()}`}</span>
          <span className="stat-lbl">Sqft</span>
        </div>
        <div className="stat">
          <span className="stat-val">{bedroomsMin === bedroomsMax ? bedroomsMin : `${bedroomsMin}–${bedroomsMax}`}</span>
          <span className="stat-lbl">Beds</span>
        </div>
        <div className="stat">
          <span className="stat-val">{bathroomsMin === bathroomsMax ? bathroomsMin : `${bathroomsMin}–${bathroomsMax}`}</span>
          <span className="stat-lbl">Baths</span>
        </div>
      </div>
    </li>
  );
}
