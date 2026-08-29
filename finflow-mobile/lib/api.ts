import axios, { AxiosError } from "axios";
import { AuthenticationResponse, Transaction, Wallet } from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

// Kept in memory and synced by AuthContext (loaded from SecureStore on launch).
// The API's refresh-token flow relies on an HttpOnly cookie, which browsers persist
// automatically but React Native does not — so for now, an expired access token
// just signs the user out instead of silently refreshing.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export interface ApiErrorPayload {
  title?: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorPayload>;
  const data = axiosError?.response?.data;

  if (data?.errors) {
    const firstError = Object.values(data.errors)[0]?.[0];
    if (firstError) return firstError;
  }

  return data?.errorCode ?? data?.title ?? "Something went wrong. Please try again.";
}

export async function login(email: string, password: string): Promise<AuthenticationResponse> {
  const { data } = await api.post<AuthenticationResponse>("/auth/login", { email, password });
  return data;
}

export async function register(input: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): Promise<{ userId: string }> {
  const { data } = await api.post<{ userId: string }>("/auth/register", input);
  return data;
}

export async function getMe(): Promise<{
  userId: string;
  email: string;
  fullName: string;
  role: string;
}> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function getWalletsByUser(userId: string): Promise<Wallet[]> {
  const { data } = await api.get<Wallet[]>(`/wallets/user/${userId}`);
  return data;
}

export async function getTransactionsByWallet(walletId: string, limit = 20): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>(`/transactions/wallet/${walletId}`, {
    params: { limit },
  });
  return data;
}
