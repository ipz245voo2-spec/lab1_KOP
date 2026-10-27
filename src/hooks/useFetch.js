import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useFetch(fetcherOrUrl, params = {}, options = {}) {
  const {
    initialData = null,
    enabled = true,
    transform = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const serializedParams = JSON.stringify(params);

  const refetch = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const parsedParams = JSON.parse(serializedParams);
        let result;

        if (typeof fetcherOrUrl === 'function') {
          result = await fetcherOrUrl(parsedParams, {
            signal: controller.signal,
          });
        } else if (typeof fetcherOrUrl === 'string') {
          const response = await axios.get(fetcherOrUrl, {
            params: parsedParams,
            signal: controller.signal,
          });
          result = response.data;
        } else {
          throw new Error('fetcherOrUrl повинен бути функцією або URL рядком');
        }

        if (isMounted) {
          const processedData = transform ? transform(result) : result;
          setData(processedData);
          setError(null);
        }
      } catch (err) {
        if (
          err.name === 'AbortError' ||
          err.name === 'CanceledError' ||
          axios.isCancel(err)
        ) {
          return;
        }

        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити дані.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetcherOrUrl, serializedParams, enabled, reloadTrigger, transform]);

  return {
    data,
    loading: enabled ? loading : false,
    error,
    refetch,
  };
}

export default useFetch;
