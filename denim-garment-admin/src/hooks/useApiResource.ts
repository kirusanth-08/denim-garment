import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

type ApiResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export const useApiResource = <T,>(path: string): ApiResourceState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    apiFetch<T>(path, controller.signal)
      .then((nextData) => {
        setData(nextData);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(reason instanceof Error ? reason.message : 'Something went wrong while loading data.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [path]);

  return { data, loading, error };
};
