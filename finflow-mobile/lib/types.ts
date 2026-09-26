export interface User {
  userId: string;
  email: string;
  fullName: string;
  role?: string;
}

export interface AuthenticationResponse {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
}

export interface Wallet {
  id: string;
  name: string;
  currency: string;
  balance: number;
  userId: string;
  createdAt: string;
  isActive: boolean;
  type: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: string;
  category?: string;
  description?: string;
  createdAt: string;
}
