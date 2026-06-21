// API service layer — all HTTP calls to the backend.
// The Vite dev server proxies /api requests to the Express backend.

const BASE = '/api';

// Returns an Authorization header if the user has a stored JWT token.
function authHeaders() {
  const token = localStorage.getItem('nhc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fetches communities from the backend, optionally filtered by price, size, etc.
// Non-empty filter values are sent as query string parameters.
export async function fetchCommunities(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  const qs = params.toString();
  const res = await fetch(`${BASE}/communities${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch communities');
  return (await res.json()).data;
}

// Authenticates a user and returns their JWT token + user profile.
export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Login failed');
  return body;
}

// Registers a new user account. Returns a success message (account starts as PENDING).
export async function registerUser(email, password) {
  const res = await fetch(`${BASE}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Registration failed');
  return body;
}

// Creates a new community listing (requires an authenticated + approved user).
export async function createCommunity(data) {
  const res = await fetch(`${BASE}/communities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to create community');
  return body.data;
}

// Admin: fetches the list of all registered users.
export async function fetchAdminUsers() {
  const res = await fetch(`${BASE}/admin/users`, {
    headers: authHeaders(),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to fetch users');
  return body.data;
}

// Admin: updates a user's approval status (PENDING, APPROVED, or REJECTED).
export async function updateUserStatus(id, status) {
  const res = await fetch(`${BASE}/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to update user');
  return body.data;
}
