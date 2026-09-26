import { logout, refreshAccessToken } from "./auth";

// Shared across concurrent requests so a burst of 401s triggers a single refresh call.
let refreshInFlight: Promise<string | null> | null = null;

function refreshToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken()
      .then((data) => {
        localStorage.setItem("token", data.token);
        return data.token as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/**
 * fetch for JWT-protected API endpoints: sends the access token and, on a 401, refreshes it
 * once via the HttpOnly refresh-token cookie and retries. If the refresh fails the session is
 * over, so the user is sent back to the login page.
 */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const send = (token: string | null) => {
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  const res = await send(localStorage.getItem("token"));
  if (res.status !== 401) return res;

  const newToken = await refreshToken();
  if (!newToken) {
    localStorage.removeItem("finflow_user");
    logout();
    return res;
  }

  return send(newToken);
}
