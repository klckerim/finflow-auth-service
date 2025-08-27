export interface Card {
    id: string;
    brand: string;
    last4: string;
    cardHolderName: string;
    expMonth: number;
    expYear: number;
    isActive: boolean,
    isDefault: boolean,
    createdAt: Date,
    stripePaymentMethodId: string,
    currency: string
}