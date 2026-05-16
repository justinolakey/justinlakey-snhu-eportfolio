import './FilterPanel.css';

export default function FilterPanel({ filters, onChange, onApply, onClear }) {
  function set(key, value) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="filter-panel">
      <h2 className="filter-heading">Search Filters</h2>

      <div className="filter-group">
        <label>Price Range ($)</label>
        <div className="range-row">
          <input type="number" placeholder="Min" value={filters.priceMin} onChange={(e) => set('priceMin', e.target.value)} min="0" />
          <span className="range-sep">–</span>
          <input type="number" placeholder="Max" value={filters.priceMax} onChange={(e) => set('priceMax', e.target.value)} min="0" />
        </div>
      </div>

      <div className="filter-group">
        <label>House Size (sqft)</label>
        <div className="range-row">
          <input type="number" placeholder="Min" value={filters.sqftMin} onChange={(e) => set('sqftMin', e.target.value)} min="0" />
          <span className="range-sep">–</span>
          <input type="number" placeholder="Max" value={filters.sqftMax} onChange={(e) => set('sqftMax', e.target.value)} min="0" />
        </div>
      </div>

      <div className="filter-group">
        <label>Lot Size (sqft)</label>
        <div className="range-row">
          <input type="number" placeholder="Min" value={filters.lotSizeMin} onChange={(e) => set('lotSizeMin', e.target.value)} min="0" />
          <span className="range-sep">–</span>
          <input type="number" placeholder="Max" value={filters.lotSizeMax} onChange={(e) => set('lotSizeMax', e.target.value)} min="0" />
        </div>
      </div>

      <div className="filter-row-2">
        <div className="filter-group">
          <label>Bedrooms (min)</label>
          <select value={filters.bedrooms} onChange={(e) => set('bedrooms', e.target.value)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Bathrooms (min)</label>
          <select value={filters.bathrooms} onChange={(e) => set('bathrooms', e.target.value)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-apply" onClick={onApply}>Apply Filters</button>
        <button className="btn-clear" onClick={onClear}>Clear All</button>
      </div>
    </div>
  );
}
