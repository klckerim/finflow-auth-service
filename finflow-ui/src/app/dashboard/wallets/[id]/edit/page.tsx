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
                    toast.error("Cüzdan bilgisi bulunamadı");
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
                toast.error("Cüzdan bilgisi getirilemedi");
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
            toast.success("Cüzdan başarıyla güncellendi");
            router.push(`/dashboard/wallets/${wallet.id}/details`);
        } catch (error) {
            toast.error("Cüzdan güncellenemedi");
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !wallet) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cüzdanı Düzenle</CardTitle>
                    <CardDescription>Cüzdan bilgilerini güncelleyin</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Cüzdan Adı</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Ana Hesap" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="balance">Bakiye</Label>
                        <Input
                            name="balance"
                            type="number"
                            value={formData.balance}
                            onChange={handleChange}
                            placeholder="Örn: 1000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Para Birimi</Label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="TRY">TRY - Türk Lirası</option>
                            <option value="USD">USD - Amerikan Doları</option>
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
                        <Label htmlFor="isActive">Aktif Durumda</Label>
                    </div>

                    <Button onClick={handleSubmit} disabled={updating} className="w-full">
                        {updating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Güncelle
                    </Button>
                </CardContent>
            </Card>

            {/* Bilgilendirici Panel */}
            <Card className="bg-muted/30 border-muted">
                <CardHeader>
                    <CardTitle>Kullanıcıya Notlar</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Cüzdan adı, bakiyesi ve para birimi değiştirilebilir.</p>
                    <p>• Cüzdan durumu aktif/pasif olarak ayarlanabilir.</p>
                    <p>• Güncelleme sonrası sistemde otomatik olarak değişiklik uygulanır.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditWalletPage;