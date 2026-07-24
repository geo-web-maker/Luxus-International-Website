import { useCallback, useEffect, useState } from "react";
import { jobsApi } from "../lib/api";

/** Pass { keyword, location, filled } to filter server-side (see backend
 * Phase 3's query-param support on GET /api/jobs). Omit for the full list. */
export function useJobs(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    jobsApi
      .list(params)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
