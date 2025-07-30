export const getWallets = async () => {
  const res = await fetch('http://localhost:5001/api/wallets');
  return res.json();
};

export async function getMe() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Kullanıcı bilgisi alınamadı");
  }

  return res.json();
}
