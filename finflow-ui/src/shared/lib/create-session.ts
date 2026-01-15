"use client";

import { loadStripe } from "@stripe/stripe-js";
import { generateIdempotencyKey } from "./idempotency";

export async function CreatePaymentSession(walletId: string, amount: number = 20, currency: string = "usd") {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const idempotencyKey = generateIdempotencyKey();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify({ walletId, amount, currency })
    });

    const { sessionId } = await res.json();

    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId });


    if (!res.ok) throw new Error("No Payment Session Information");
    return res.json();
}

export async function startCardSetup(userId: string) {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-setup-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }) //customerEmail optional
    });

    const { sessionId } = await res.json();

    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId });

    if (!res.ok) throw new Error("No Payment Setup Session Information");
    return res.json();
}

