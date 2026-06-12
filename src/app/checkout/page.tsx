"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";;
import { useCart } from "@/contexts/CartContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Banknote, QrCode } from "lucide-react";
import { toast } from "sonner";

const methods = [
  { value: "Tunai", label: "Tunai", icon: Banknote },
  { value: "QRIS", label: "QRIS", icon: QrCode },
  { value: "Transfer Bank", label: "Transfer Bank", icon: CreditCard },
  { value: "E-Wallet", label: "E-Wallet", icon: Wallet },
];

export default function CheckoutPage() {
  const { items, total, checkout } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [customerName, setCustomerName] = useState("");
  const [processing, setProcessing] = useState(false);

  if (items.length === 0 && !processing) {
    return (
      <>
      <div className="container mx-auto px-4 py-20 text-center max-w-md min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Tidak ada pesanan</h2>
        <p className="text-muted-foreground mb-6">Tambahkan item ke keranjang dulu ya.</p>
        <Button onClick={() => router.push("/menu")}>Lihat Menu</Button>
      </div>
      </>
    );
  }

  const handlePay = () => {
    if (!customerName.trim()) {
      toast.error("Nama pelanggan wajib diisi!");
      return;
    }
    setProcessing(true);
    const orderId = checkout({ paymentMethod, customerName });
    if (orderId) {
      toast.success(`Pesanan dibuat! Lanjut ke pembayaran...`);
      setTimeout(() => router.push(`/payment/${orderId}`), 600);
    } else {
      setProcessing(false);
    }
  };

  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[calc(100dvh-4rem)]">
      <h1 className="text-3xl font-bold text-primary mb-6">Checkout</h1>

      <Card className="p-5 mb-5">
        <h2 className="font-semibold text-primary mb-3">Ringkasan Pesanan</h2>
        <div className="space-y-2 text-sm">
          {items.map(i => (
            <div key={i.id} className="flex justify-between">
              <span className="text-muted-foreground">{i.name} <span className="text-xs">x{i.quantity}</span></span>
              <span className="font-medium">Rp {(i.price * i.quantity).toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-3 flex justify-between items-center">
          <span className="font-semibold text-primary">Total</span>
          <span className="text-xl font-bold text-accent">Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </Card>

      <Card className="p-5 mb-5">
        <Label className="font-semibold text-primary">Nama Pelanggan</Label>
        <Input
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          placeholder="Nama untuk pesanan"
          className="mt-2"
        />
      </Card>

      <Card className="p-5 mb-6">
        <Label className="font-semibold text-primary mb-3 block">Metode Pembayaran</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
          {methods.map(m => (
            <label
              key={m.value}
              htmlFor={m.value}
              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${paymentMethod === m.value ? "border-accent bg-accent/10" : "hover:bg-muted/50"}`}
            >
              <RadioGroupItem value={m.value} id={m.value} />
              <m.icon className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{m.label}</span>
            </label>
          ))}
        </RadioGroup>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => router.push("/cart")}>Kembali</Button>
        <Button onClick={handlePay} disabled={processing} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
          {processing ? "Memproses..." : `Bayar Rp ${total.toLocaleString("id-ID")}`}
        </Button>
      </div>
    </div>
    </>
  );
}
