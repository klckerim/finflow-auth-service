import { parseApiResponseError } from "./api-error-handler";


export async function getMe() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });


  if (!res.ok) {
    const msg = await parseApiResponseError(res);
    throw new Error(msg);
  }

  return res.json();
}


export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    credentials: 'include', // Refresh token cookie için gerekli 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });


  if (!res.ok) {
    const msg = await parseApiResponseError(res);
    throw new Error(msg);
  }

  return await res.json();
}


export const logout = () => {
  try {
    localStorage.removeItem("token")
    window.location.href = "/login"
  } catch (err) {
    console.error(err);
  }
}


export async function refreshAccessToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // Cookie’den alacak
  });

  if (!res.ok) {
    const msg = await parseApiResponseError(res);
    throw new Error(msg);
  }

  return await res.json();
}
