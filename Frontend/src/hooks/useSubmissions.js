import { useCallback, useEffect, useState } from "react";
import { submissionsApi } from "../lib/api";

/** `bucket` is one of "contact" | "quote" | "jobApplication", matching the
 * keys submissionsApi.list/setHandled/delete already expect. */
export function useSubmissions(bucket) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    submissionsApi
      .list(bucket)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [bucket]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
