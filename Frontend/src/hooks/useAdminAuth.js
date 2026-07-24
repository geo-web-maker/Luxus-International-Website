import { useCallback, useState } from "react";
import { getAdminToken, setAdminToken, request } from "../lib/apiClient";

/** Tracks whether an admin token is present and exposes login/logout.
 * Does not verify the token is still valid server-side on mount — an
 * expired token just causes the next admin API call to 401, which
 * AdminLayout's request error handling redirects back to login on. */
export function useAdminAuth() {
  const [token, setToken] = useState(() => getAdminToken());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const body = await request("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(body.access_token);
      setToken(body.access_token);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAdminToken(null);
    setToken(null);
  }, []);

  return { isAuthenticated: Boolean(token), login, logout, loading, error };
}
