import { useState, useEffect } from 'react';
import { fetchCommunities } from '../services/api';

export function useCommunities(filters) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;

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
  }, [filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { communities, loading, error };
}
