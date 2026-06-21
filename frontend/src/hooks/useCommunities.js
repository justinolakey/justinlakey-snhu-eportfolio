// Custom hook that fetches and caches the community list from the backend.
// Re-fetches automatically when the applied filters change.
// Provides a `refetch` function to manually trigger a reload (e.g. after creating a community).

import { useState, useEffect, useCallback } from 'react';
import { fetchCommunities } from '../services/api';

export function useCommunities(filters) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0); // Increment to force a re-fetch
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false; // Prevents state updates if the component unmounts mid-fetch

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCommunities(filters);
        if (!cancelled) setCommunities(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [filterKey, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { communities, loading, error, refetch };
}
