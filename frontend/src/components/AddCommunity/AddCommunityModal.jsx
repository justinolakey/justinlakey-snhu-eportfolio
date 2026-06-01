import { useState } from 'react';
import { createCommunity } from '../../services/api';
import './AddCommunityModal.css';

const EMPTY = {
  name: '', builder: '', description: '',
  address: '', city: '', state: '', zipCode: '',
  latitude: '', longitude: '', website: '',
};

export default function AddCommunityModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

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
