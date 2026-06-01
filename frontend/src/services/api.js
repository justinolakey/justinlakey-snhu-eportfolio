const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('nhc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export async function fetchCommunityById(id) {
  const res = await fetch(`${BASE}/communities/${id}`);
  if (!res.ok) throw new Error('Community not found');
  return (await res.json()).data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Login failed');
  return body;
}

export async function registerUser(email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Registration failed');
  return body;
}

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

export async function fetchAdminUsers() {
  const res = await fetch(`${BASE}/admin/users`, {
    headers: authHeaders(),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to fetch users');
  return body.data;
}

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
