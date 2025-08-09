
export interface Wallet {
  id: string;
  name: string;
  currency: string;
  balance: number;
  userId: string;
  createdAt: Date,
  isActive: boolean,
  type: string
}
