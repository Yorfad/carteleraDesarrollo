// src/hooks/useCartelera.js
import { useEffect, useState } from 'react';
import { getCartelera } from '../services/cartelera';

export function useCartelera(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    getCartelera(filters, { signal: ctrl.signal })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [filters?.title, filters?.ubication]);

  return { data, loading, error };
}
