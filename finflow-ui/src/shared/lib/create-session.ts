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

    const payload = await res.json();

    if (!res.ok) {
        const errorMessage = payload?.message ?? "No Payment Session Information";
        throw new Error(errorMessage);
    }

    const { sessionId } = payload as { sessionId?: string };
    if (!sessionId) {
        throw new Error("Stripe sessionId missing from response.");
    }

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });

    return payload;
}

export async function startCardSetup(userId: string) {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-setup-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }) //customerEmail optional
    });

    const payload = await res.json();

    if (!res.ok) {
        const errorMessage = payload?.message ?? "No Payment Setup Session Information";
        throw new Error(errorMessage);
    }

    const { sessionId } = payload as { sessionId?: string };
    if (!sessionId) {
        throw new Error("Stripe setup sessionId missing from response.");
    }

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });

    return payload;
}

