import { Wallet as WalletType } from "@/types/wallet";


export async function getWalletsByUser(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/user/${userId}`);
  if (!res.ok) throw new Error("No Wallets Information");
  return res.json();
}

export async function transferAmount(walletId: string, data: {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${walletId}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Transfer failed");
  }

  return res;
}


export async function getLastTransfers(walletId: string) {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${walletId}/transactions?limit=5`, {
    cache: "no-store" 
  });

  return res.json();
}


export async function getWalletById(id: string): Promise<WalletType | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
}

