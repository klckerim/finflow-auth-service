"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wallet, CreditCard, CheckCircle2, Receipt } from "lucide-react";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import { useLocale } from "@/context/locale-context";
import { useAuth } from "@/context/auth-context";
import { getCardsByUserId, getWalletsByUser } from "@/shared/lib/api";
import { formatAmount } from "@/shared/lib/utils";

export default function PayBillPage() {
    const { user } = useAuth();
    const { t } = useLocale();

    const [step, setStep] = useState(1);
    const [billAmount, setBillAmount] = useState<number | null>(null);
    const [billReference, setBillReference] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [wallets, setWallets] = useState<{ id: string; balance: number; currency: string }[]>([]);
    const [cards, setCards] = useState<{ id: string; brand: string; last4: string }[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);

    const handleSetPaymentMethod = (method: "wallet" | "card" | null) => {
        setPaymentMethod(method);
        setSelectedWallet(null);
        setSelectedCard(null);
        setIsPaymentMethodSelected(false);
    };

    useEffect(() => {
        if (paymentMethod === "wallet" && selectedWallet) {
            setIsPaymentMethodSelected(true);
        } else if (paymentMethod === "card" && selectedCard) {
            setIsPaymentMethodSelected(true);
        } else {
            setIsPaymentMethodSelected(false);
        }
    }, [selectedWallet, selectedCard, paymentMethod]);

    useEffect(() => {
        const userId = user?.userId;
        if (!userId) return;

        if (paymentMethod === "wallet") {
            (async () => {
                try {
                    const wallets = await getWalletsByUser(userId);
                    setWallets(wallets);
                } catch (err) {
                    parseUnknownError(err);
                }
            })();
        }

        if (paymentMethod === "card") {
            (async () => {
                try {
                    const data = await getCardsByUserId(userId);
                    setCards(data);
                } catch (err) {
                    parseUnknownError(err);
                }
            })();
        }
    }, [paymentMethod, user?.userId]);

    const handlePay = async () => {
        if (!billAmount || !billReference || !paymentMethod) return;
        if (paymentMethod === "wallet" && !selectedWallet) return;
        if (paymentMethod === "card" && !selectedCard) return;

        setIsProcessing(true);

        try {
            const payload: any = {
                Email: user?.email,
                BillId: billReference,
                Amount: billAmount,
                PaymentType: paymentMethod === "wallet" ? 0 : 1,
                Currency: "USD"
            };

            if (paymentMethod === "wallet") payload.WalletId = selectedWallet;
            if (paymentMethod === "card") payload.CardId = selectedCard;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/bill`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(t("common.str_PaymentFailed"));

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
        setSelectedWallet(null);
        setSelectedCard(null);
        setIsSuccess(false);
        setTransactionId(null);
        setIsPaymentMethodSelected(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 py-8">
            <div className="max-w-lg mx-auto p-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4 shadow-sm"
                    >
                        <Receipt className="w-7 h-7 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
                        {t("common.str_PayBill")}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {t("common.str_QuickBillPayments")}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 -z-10" />
                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="relative flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${step >= stepNumber
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "bg-background border-muted"
                                    }`}
                            >
                                {step > stepNumber ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-semibold">{stepNumber}</span>
                                )}
                            </div>
                            <span className="text-xs mt-2 text-muted-foreground font-medium">
                                {stepNumber === 1
                                    ? t("common.details")
                                    : stepNumber === 2
                                        ? t("common.payment")
                                        : t("common.confirm")}
                            </span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1 */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="shadow-lg rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t("common.str_BillInformation")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">{t("common.str_BillAmount")}</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={formatAmount(billAmount ?? 0)}
                                            onChange={(e) => setBillAmount(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reference">{t("common.str_BillReference")}</Label>
                                        <Input
                                            id="reference"
                                            placeholder={t("common.str_EnterBillReference")}
                                            value={billReference}
                                            onChange={(e) => setBillReference(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => setStep(2)}
                                        disabled={!billAmount || billAmount <= 0 || !billReference}
                                    >
                                        {t("common.str_ContinueToPayment")}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="shadow-lg rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t("common.str_SelectPaymentMethod")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "wallet"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-muted hover:border-primary/50"
                                                    }`}
                                                onClick={() => handleSetPaymentMethod("wallet")}
                                            >
                                                <Wallet className="w-8 h-8 mb-2 text-primary" />
                                                <p className="font-medium">{t("common.str_Wallet")}</p>
                                                <p className="text-xs text-muted-foreground">{t("common.str_UseBalance")}</p>
                                            </div>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "card"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-muted hover:border-primary/50"
                                                    }`}
                                                onClick={() => handleSetPaymentMethod("card")}
                                            >
                                                <CreditCard className="w-8 h-8 mb-2 text-primary" />
                                                <p className="font-medium">{t("common.str_Card")}</p>
                                                <p className="text-xs text-muted-foreground">{t("common.str_UseCard")}</p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> {t("common.str_Back")}
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() => setStep(3)}
                                            disabled={!paymentMethod}
                                        >
                                            {t("common.str_Continue")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 3 (Confirm) */}
                    {step === 3 && !isSuccess && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="shadow-lg rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t("common.str_ConfirmPayment")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t("common.str_BillReference")}</span>
                                            <span className="font-medium">{billReference}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t("common.str_Amount")}</span>
                                            <span className="font-bold text-lg">{formatAmount(billAmount ?? 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t("common.str_PaymentMethod")}</span>
                                            <span className="font-medium">
                                                {paymentMethod === "wallet" ? t("common.str_Wallet") : t("common.str_Card")}
                                            </span>
                                        </div>

                                        {paymentMethod === "wallet" && (
                                            <select
                                                className="w-full border rounded-md p-2 mt-2"
                                                value={selectedWallet ?? ""}
                                                onChange={(e) => {
                                                    setSelectedWallet(e.target.value);
                                                    setIsPaymentMethodSelected(!!e.target.value);
                                                }}
                                            >
                                                <option value="" disabled>
                                                    {t("common.str_SelectWallet")}
                                                </option>
                                                {wallets.map((w) => (
                                                    <option key={w.id} value={w.id}>
                                                        {w.currency} {t("common.str_Wallet")} – {t("common.str_Balance")}: {w.balance}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {paymentMethod === "card" && (
                                            <select
                                                className="w-full border rounded-md p-2 mt-2"
                                                value={selectedCard ?? ""}
                                                onChange={(e) => {
                                                    setSelectedCard(e.target.value);
                                                    setIsPaymentMethodSelected(!!e.target.value);
                                                }}
                                            >
                                                <option value="" disabled>
                                                    {t("common.str_SelectCard")}
                                                </option>
                                                {cards.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.brand.toUpperCase()} •••• {c.last4}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> {t("common.str_Back")}
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={handlePay}
                                            disabled={isProcessing || !isPaymentMethodSelected}
                                        >
                                            {isProcessing ? t("common.str_Processing") : t("common.str_PayNow")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Success */}
                    {isSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="text-center shadow-lg rounded-2xl">
                                <CardContent className="pt-8 pb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-2">{t("common.str_PaymentSuccess")}</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {t("common.str_BillProcessed", { amount: formatAmount(billAmount ?? 0) })}
                                    </p>
                                    <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                                        <div className="flex justify-between mb-2">
                                            <span>{t("common.str_BillReference")}:</span>
                                            <span className="font-medium">{billReference}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t("common.str_TransactionId")}:</span>
                                            <span className="font-mono text-sm">{transactionId}</span>
                                        </div>
                                    </div>
                                    <Button onClick={resetFlow} className="w-full">
                                        {t("common.str_MakeAnotherPayment")}
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
