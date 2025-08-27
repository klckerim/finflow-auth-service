
export type Transaction = {
  id: string;
  walletId: string;
  paymentMethodId: string,
  description: string;
  type: string;
  amount: number;
  createdAt: string;
  currency: string
};