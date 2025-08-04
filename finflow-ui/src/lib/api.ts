
export async function getWalletsByUser(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/user/${userId}`);
  if (!res.ok) throw new Error("No Wallets Information");
  return res.json();
}
