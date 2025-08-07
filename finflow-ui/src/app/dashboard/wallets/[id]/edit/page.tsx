"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Wallet } from "@/types/wallet";
import { getWalletById, updateWalletById } from "@/lib/api";
import { Loader2 } from "lucide-react";

const EditWalletPage = () => {
    const { id } = useParams();
    const router = useRouter();

    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        balance: "",
        currency: "",
        isActive: true,
    });

    useEffect(() => {
        if (!id) return;

        getWalletById(id as string)
            .then((data) => {
                if (!data) {
                    toast.error("Wallet not found");
                    router.push("/dashboard/wallets");
                    return;
                }

                setWallet(data);
                setFormData({
                    name: data.name,
                    balance: data.balance.toString(),
                    currency: data.currency,
                    isActive: data.isActive,
                });
            })
            .catch(() => {
                toast.error("Wallet information not found");
                router.push("/dashboard/wallets");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        if (!wallet) return;

        try {
            setUpdating(true);
            const payload = {
                ...formData,
                balance: parseFloat(formData.balance),
                name: formData.name
            };

            await updateWalletById(wallet.id, payload);
            toast.success("Wallet updated successfully");
            router.push(`/dashboard/wallets/${wallet.id}/details`);
        } catch (error) {
            toast.error("Wallet could not be updated");
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !wallet) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Wallet</CardTitle>
                    <CardDescription>Update wallet information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Wallet Name</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Main Account" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="balance">Balance</Label>
                        <Input
                            name="balance"
                            type="number"
                            value={formData.balance}
                            onChange={handleChange}
                            placeholder="Örn: 1000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="TRY">TRY - Turkish Lira</option>
                            <option value="USD">USD - USD Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            id="isActive"
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>

                    <Button onClick={handleSubmit} disabled={updating} className="w-full">
                        {updating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Update
                    </Button>
                </CardContent>
            </Card>

            {/* Bilgilendirici Panel */}
            <Card className="bg-muted/30 border-muted">
                <CardHeader>
                    <CardTitle>Notes For User</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Wallet name and balance can be changed.</p>
                    <p>• Changes are automatically applied to the system after the update.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditWalletPage;