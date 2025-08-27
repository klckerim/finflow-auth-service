"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, CreditCard, CheckCircle2, Receipt } from "lucide-react";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import { toast } from "sonner";
import { useLocale } from "@/context/locale-context";
import { useAuth } from "@/context/auth-context";
import { getCardsByUserId, getWalletsByUser } from "@/shared/lib/api";

export default function PayBillPage() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [billAmount, setBillAmount] = useState<number | null>(null);
    const [billReference, setBillReference] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [wallets, setWallets] = useState<{ id: string; balance: number; currency: string }[]>([]);
    const [cards, setCards] = useState<{ id: string, brand: string; last4: string }[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    const { t } = useLocale();


    useEffect(() => {
        const userId = user?.userId;

        if (paymentMethod === "wallet") {
            (async () => {
                try {
                    const wallets = await getWalletsByUser(userId as string);
                    setWallets(wallets);
                } catch (err) {
                    parseUnknownError(err);
                }
            })();
        }

        if (paymentMethod === "card") {
            (async () => {
                try {
                    const data = await getCardsByUserId(userId as string);
                    setCards(data);
                } catch (err) {
                    parseUnknownError(err);
                }
            })();



        }
    }, [paymentMethod]);


    const handlePay = async () => {
        if (!billAmount || !billReference || !paymentMethod) return;

        setIsProcessing(true);

        try {
            const payload: any = {
                Email: user?.email,
                BillId: billReference,
                Amount: billAmount,
                PaymentType: paymentMethod === "wallet" ? 0 : 1,
                Currency: "USD"
            };

            if (paymentMethod === "wallet" && selectedWallet) {
                payload.WalletId = selectedWallet;
            }

            if (paymentMethod === "card" && selectedCard) {
                payload.CardId = selectedCard;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/bill`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("common.str_PaymentFailed");

            const data = await response.json();
            setTransactionId(data.paymentId);
            setIsSuccess(true);
        } catch (error) {
            parseUnknownError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setBillAmount(null);
        setBillReference("");
        setPaymentMethod(null);
        setIsSuccess(false);
        setTransactionId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
            <div className="max-w-md mx-auto p-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4"
                    >
                        <Receipt className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Pay Your Bill</h1>
                    <p className="text-muted-foreground">Quick and secure bill payments</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 -z-10" />
                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="relative flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= stepNumber
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "bg-background border-muted"
                                    }`}
                            >
                                {step > stepNumber ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <span className="text-sm font-medium">{stepNumber}</span>
                                )}
                            </div>
                            <span className="text-xs mt-2 text-muted-foreground">
                                {stepNumber === 1 ? "Details" : stepNumber === 2 ? "Payment" : "Confirm"}
                            </span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Bill Details */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Bill Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Bill Amount</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₺</span>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="0.00"
                                                value={billAmount ?? ""}
                                                onChange={(e) => setBillAmount(Number(e.target.value))}
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reference">Reference Number</Label>
                                        <Input
                                            id="reference"
                                            placeholder="Enter bill reference number"
                                            value={billReference}
                                            onChange={(e) => setBillReference(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => setStep(2)}
                                        disabled={!billAmount || billAmount <= 0 || !billReference}
                                    >
                                        Continue to Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2: Payment Method */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Select Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "wallet"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-muted hover:border-primary/50"
                                                    }`}
                                                onClick={() => setPaymentMethod("wallet")}
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <Wallet className="w-8 h-8 mb-2 text-primary" />
                                                    <span className="font-medium">Wallet</span>
                                                    <span className="text-xs text-muted-foreground mt-1">Use your balance</span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "card"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-muted hover:border-primary/50"
                                                    }`}
                                                onClick={() => setPaymentMethod("card")}
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <CreditCard className="w-8 h-8 mb-2 text-primary" />
                                                    <span className="font-medium">Card</span>
                                                    <span className="text-xs text-muted-foreground mt-1">Credit/Debit card</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() => setStep(3)}
                                            disabled={!paymentMethod}
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && !isSuccess && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Confirm Payment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bill Reference</span>
                                            <span className="font-medium">{billReference}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span className="font-bold text-lg">{billAmount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment Method</span>
                                            {/* Eğer wallet seçildiyse wallet dropdown */}
                                            {paymentMethod === "wallet" && (
                                                <div className="mt-4 space-y-2">
                                                    <select
                                                        className="w-full border rounded-md p-2"
                                                        value={selectedWallet ?? ""}
                                                        onChange={(e) => setSelectedWallet(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select your wallet</option>
                                                        {wallets.map(w => (
                                                            <option key={w.id} value={w.id}>
                                                                {w.currency} Wallet - Balance: {w.balance}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Eğer card seçildiyse card dropdown */}
                                            {paymentMethod === "card" && (
                                                <div className="mt-4 space-y-2">
                                                    <Label>Select Card</Label>
                                                    <select
                                                        className="w-full border rounded-md p-2"
                                                        value={selectedCard ?? ""}
                                                        onChange={(e) => setSelectedCard(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select your card</option>
                                                        {cards.map(c => (
                                                            <option key={c.id} value={c.id}>
                                                                {c.brand.toUpperCase()} •••• {c.last4}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={handlePay}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? "Processing..." : "Pay Now"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Success State */}
                    {isSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="text-center">
                                <CardContent className="pt-8 pb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Your bill payment of ₺{billAmount?.toFixed(2)} has been processed successfully.
                                    </p>
                                    <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                                        <div className="flex justify-between mb-2">
                                            <span>Reference:</span>
                                            <span className="font-medium">{billReference}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Transaction ID:</span>
                                            <span className="font-mono text-sm">{transactionId}</span>
                                        </div>
                                    </div>
                                    <Button onClick={resetFlow} className="w-full">
                                        Make Another Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
