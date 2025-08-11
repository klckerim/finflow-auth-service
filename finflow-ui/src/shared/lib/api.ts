import { Wallet as WalletType } from "@/shared/types/wallet";
import { parseApiResponseError, parseUnknownError } from "./api-error-handler";


export async function getWalletsByUser(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/user/${userId}`);
  if (!res.ok) throw new Error("No Wallets Information");
  return res.json();
}

export async function getTransactionsByWalletId(walletId: string, limit: number = 20) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/wallet/${walletId}?limit=${limit}`);
  if (!res.ok) throw new Error("No Transactions Information");
  return res.json();
}

export async function getTransactionsByUserId(userId: string, limit: number = 20) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/user/${userId}?limit=${limit}`);
  if (!res.ok) throw new Error("No Transactions Information");
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
    const msg = await parseApiResponseError(res);
    throw new Error(msg);
  }

  return res;
}

export async function getWalletById(id: string): Promise<WalletType | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const msg = await parseApiResponseError(res);
      throw new Error(msg);
    }

    return await res.json();
  } catch (error) {
    parseUnknownError(error);
    return null;
  }
}


export async function updateWalletById(id: string, data: { name: string; balance: number }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletId: id,
        name: data.name,
        balance: data.balance
      }),
    });

    if (!res.ok) {
      const msg = await parseApiResponseError(res);
      throw new Error(msg);
    }

    return await res.json();
  } catch (error) {
    parseUnknownError(error);
    return null;
  }
}

export const deleteWalletById = async (id: string) => {

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Deletion failed");
    }

    if (!res.ok) {
      const msg = await parseApiResponseError(res);
      throw new Error(msg);
    }

    return res.status === 204 ? true : await res.json();
  } catch (error) {
    parseUnknownError(error);
    return null;
  }
};

