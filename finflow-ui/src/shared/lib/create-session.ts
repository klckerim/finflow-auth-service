"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export async function CreatePaymentSession(walletId: string, amount: number = 20, currency: string = "usd") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId, amount, currency })
    });

    const { sessionId } = await res.json();

    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId });


    if (!res.ok) throw new Error("No Payment Session Information");
    return res.json();
}

