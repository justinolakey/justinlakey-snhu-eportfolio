import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
        onClose();
      } else {
        const res = await register(email, password);
        setSuccessMsg(res.message);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-tabs">
          <button
            className={tab === 'login' ? 'active' : ''}
            onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
          >
            Sign In
          </button>
          <button
            className={tab === 'register' ? 'active' : ''}
            onClick={() => { setTab('register'); setError(''); setSuccessMsg(''); }}
          >
            Register
          </button>
        </div>

        {successMsg ? (
          <div className="modal-success">
            <p>{successMsg}</p>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>

            {error && <p className="modal-error">{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {tab === 'register' && (
              <p className="modal-hint">
                New accounts require admin approval before you can add communities.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
