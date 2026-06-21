// Modal form for adding a new community listing.
// Only accessible to authenticated users with APPROVED status.
// Collects community info, location, and home specification ranges,
// then submits to the backend API.

import { useState } from 'react';
import { createCommunity } from '../../services/api';
import './AddCommunityModal.css';

// Default empty form state for all fields
const EMPTY = {
  name: '', builder: '', description: '',
  address: '', city: '', state: '', zipCode: '',
  latitude: '', longitude: '', website: '',
  priceMin: '', priceMax: '',
  sqftMin: '', sqftMax: '',
  lotSizeSqftMin: '', lotSizeSqftMax: '',
  bedroomsMin: '', bedroomsMax: '',
  bathroomsMin: '', bathroomsMax: '',
  status: 'AVAILABLE',
};

export default function AddCommunityModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generic change handler for all form inputs (keyed by input name attribute)
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Submits the form data to the API and triggers a list refresh on success
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const community = await createCommunity(form);
      onCreated(community);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box add-community-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Add Community</h2>

        <form onSubmit={handleSubmit} className="add-community-form">
          {/* Basic info */}
          <div className="form-row">
            <label>
              Community Name *
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Builder *
              <input name="builder" value={form.builder} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </label>

          {/* Location info */}
          <label>
            Street Address *
            <input name="address" value={form.address} onChange={handleChange} required />
          </label>

          <div className="form-row">
            <label>
              City *
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label className="label-short">
              State *
              <input name="state" value={form.state} onChange={handleChange} required maxLength={2} placeholder="TX" />
            </label>
            <label className="label-short">
              ZIP *
              <input name="zipCode" value={form.zipCode} onChange={handleChange} required />
            </label>
          </div>

          <div className="form-row">
            <label>
              Latitude *
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                required
                placeholder="e.g. 30.2672"
              />
            </label>
            <label>
              Longitude *
              <input
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                required
                placeholder="e.g. -97.7431"
              />
            </label>
          </div>

          <label>
            Website
            <input name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://…" />
          </label>

          {/* Home specification ranges (min/max pairs) */}
          <div className="form-group">
            <label>Price Range ($) *</label>
            <div className="range-row">
              <input name="priceMin" type="number" placeholder="Min" value={form.priceMin} onChange={handleChange} required min="0" />
              <span className="range-sep">–</span>
              <input name="priceMax" type="number" placeholder="Max" value={form.priceMax} onChange={handleChange} required min="0" />
            </div>
          </div>

          <div className="form-group">
            <label>House Size (sqft) *</label>
            <div className="range-row">
              <input name="sqftMin" type="number" placeholder="Min" value={form.sqftMin} onChange={handleChange} required min="0" />
              <span className="range-sep">–</span>
              <input name="sqftMax" type="number" placeholder="Max" value={form.sqftMax} onChange={handleChange} required min="0" />
            </div>
          </div>

          <div className="form-group">
            <label>Lot Size (sqft) *</label>
            <div className="range-row">
              <input name="lotSizeSqftMin" type="number" placeholder="Min" value={form.lotSizeSqftMin} onChange={handleChange} required min="0" />
              <span className="range-sep">–</span>
              <input name="lotSizeSqftMax" type="number" placeholder="Max" value={form.lotSizeSqftMax} onChange={handleChange} required min="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms *</label>
              <div className="range-row">
                <input name="bedroomsMin" type="number" placeholder="Min" value={form.bedroomsMin} onChange={handleChange} required min="0" />
                <span className="range-sep">–</span>
                <input name="bedroomsMax" type="number" placeholder="Max" value={form.bedroomsMax} onChange={handleChange} required min="0" />
              </div>
            </div>

            <div className="form-group">
              <label>Bathrooms *</label>
              <div className="range-row">
                <input name="bathroomsMin" type="number" step="0.5" placeholder="Min" value={form.bathroomsMin} onChange={handleChange} required min="0" />
                <span className="range-sep">–</span>
                <input name="bathroomsMax" type="number" step="0.5" placeholder="Max" value={form.bathroomsMax} onChange={handleChange} required min="0" />
              </div>
            </div>
          </div>

          {/* Community availability status */}
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="AVAILABLE">Available</option>
              <option value="COMING_SOON">Coming Soon</option>
              <option value="SOLD_OUT">Sold Out</option>
            </select>
          </label>

          {error && <p className="modal-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Add Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
