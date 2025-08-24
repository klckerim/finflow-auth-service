import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useLocale } from "@/context/locale-context";

const AddMoneyModal = ({ walletId, currency, onTopUp }: any) => {
    const [amount, setAmount] = useState<number>(0);
    const { t } = useLocale();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>{t("common.str_AddMoney")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("common.str_AddMoneyToWallet")}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        id="topup-amount"
                        type="number"
                        min={1}
                        step={0.01}
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        placeholder={t("dashboard.amountIn", { currency: currency })}
                        className="border rounded px-2 py-1 w-full"
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={amount <= 0}
                        onClick={() => {
                            onTopUp(walletId, amount);
                        }}
                    >
                        {t("common.str_PayNow")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMoneyModal;
