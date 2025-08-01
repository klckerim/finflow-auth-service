

export async function getMe() {


  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });


  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include', // Refresh token cookie için gerekli 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Login failed');
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // Cookie’den alacak
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  return await res.json();
}
