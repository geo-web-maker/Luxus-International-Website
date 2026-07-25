import { useCallback, useEffect, useState } from "react";
import { clientsApi } from "../lib/api";

/** Public hook — active clients only, in display order. Pass
 * includeInactive=true from admin screens to also see toggled-off clients. */
export function useClients(includeInactive = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    clientsApi
      .list(includeInactive)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [includeInactive]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
