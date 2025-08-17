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

const AddMoneyModal = ({ walletId, currency, onTopUp }: any) => {
    const [amount, setAmount] = useState<number>(0);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Money</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Money to Wallet</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        id="topup-amount"
                        type="number"
                        min={1}
                        step={0.01}
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        placeholder={`Amount in ${currency}`}
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
                        Pay Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMoneyModal;
