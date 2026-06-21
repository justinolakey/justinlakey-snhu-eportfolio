// Renders a single community as a card in the sidebar list.
// Shows the community name, builder, status badge, location, and
// a 4-stat grid (price range, sqft range, bedrooms, bathrooms).

import { fmt } from '../../utils/format';
import './CommunityList.css';

// Maps community status enum values to display labels and CSS badge classes
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
      {/* Header row: name/builder on the left, status badge on the right */}
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

      {/* Stats grid: shows ranges (e.g. "$280K – $520K") or single values */}
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
