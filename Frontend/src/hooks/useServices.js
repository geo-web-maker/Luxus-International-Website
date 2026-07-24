import { useCallback, useEffect, useState } from "react";
import { servicesApi } from "../lib/api";

export function useServices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    servicesApi
      .list()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
