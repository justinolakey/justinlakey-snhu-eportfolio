// Admin panel modal for managing user accounts.
// Displays a table of all registered users with their roles and approval status.
// Provides Approve/Reject/Reset buttons to change each user's status.

import { useState, useEffect } from 'react';
import { fetchAdminUsers, updateUserStatus } from '../../services/api';
import './AdminPanel.css';

// Maps user status enum values to display labels
const STATUS_LABEL = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' };

export default function AdminPanel({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the user list on mount
  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Updates a user's status and refreshes their row in the table
  async function handleStatus(id, status) {
    try {
      const updated = await updateUserStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box admin-panel-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">User Management</h2>

        {loading && <p className="admin-loading">Loading…</p>}
        {error && <p className="modal-error">{error}</p>}

        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`status-badge status-${u.status.toLowerCase()}`}>
                      {STATUS_LABEL[u.status]}
                    </span>
                  </td>
                  <td className="admin-actions">
                    {/* Show contextual actions based on current status */}
                    {u.status !== 'APPROVED' && (
                      <button className="btn-approve" onClick={() => handleStatus(u.id, 'APPROVED')}>
                        Approve
                      </button>
                    )}
                    {u.status !== 'REJECTED' && (
                      <button className="btn-reject" onClick={() => handleStatus(u.id, 'REJECTED')}>
                        Reject
                      </button>
                    )}
                    {u.status === 'REJECTED' && (
                      <button className="btn-approve" onClick={() => handleStatus(u.id, 'PENDING')}>
                        Reset
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
