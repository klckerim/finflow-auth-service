
import { refreshAccessToken } from './auth';


let accessToken = ''; // uygulama içinde saklanacak

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  if (!accessToken) {
    const refreshed = await refreshAccessToken();
    accessToken = refreshed.token;
  }

  const finalHeaders = {
    ...init?.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await fetch(input, {
    ...init,
    headers: finalHeaders,
    credentials: 'include',
  });

  // Eğer token expired ise otomatik yenileme
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    accessToken = refreshed.token;

    return fetch(input, {
      ...init,
      headers: {
        ...finalHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
  }

  return res;
}
