const BASE = '/api';

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
