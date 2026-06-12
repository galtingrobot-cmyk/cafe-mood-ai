"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Banknote, QrCode } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { orders, cancelOrder } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (id && orders) {
      const found = orders.find(o => o.id === id);
      if (found) {
        setOrder(found);
      } else {
        toast.error("Pesanan tidak ditemukan");
        router.push("/");
      }
    }
  }, [id, orders, router]);

  if (!order) return <><div className="p-8 text-center text-muted-foreground min-h-[60vh] flex items-center justify-center">Memuat data pesanan...</div></>;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

  const handleCancel = () => {
    if (id) {
      cancelOrder(id as string);
      toast.info("Pembayaran dibatalkan. Mengembalikan pesanan...");
      router.push("/cart");
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          nama_pelanggan: order.customerName || "Anonim",
          method_payment: order.paymentMethod || "Tunai",
          status: "pending",
          total_harga: order.total
        }])
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      const orderItems = order.items.map((item: any) => ({
        order_id: orderData.orders_id,
        menu_id: Number(item.id),
        jumlah: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('orders_item')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;

      setIsPaid(true);
      toast.success("Pembayaran Berhasil! Pesanan Anda sedang diproses.");
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan pesanan ke database");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return (
      <>
      <div className="container mx-auto px-4 py-20 text-center max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-24 h-24 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-2">Pembayaran Berhasil!</h2>
        <p className="text-muted-foreground mb-8">
          Terima kasih telah memesan di AI Cafe. Barista kami sedang menyiapkan pesanan Anda. Silakan pantau antrian Anda.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => router.push("/waiting-list")}>
            Lihat Antrian Saya
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={() => router.push("/")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
      </>
    );
  }

  const renderPaymentInstructions = () => {
    switch (order.paymentMethod) {
      case "QRIS":
        return (
          <div className="flex flex-col items-center justify-center p-6 border rounded-2xl bg-white text-center shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-slate-800">Scan QRIS</h3>
            <div className="bg-slate-100 p-6 rounded-xl mb-4 w-56 h-56 flex items-center justify-center border-2 border-dashed border-slate-300">
              <QrCode className="w-32 h-32 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 max-w-[250px]">Scan menggunakan aplikasi E-Wallet atau M-Banking Anda untuk menyelesaikan pembayaran</p>
          </div>
        );
      case "Transfer Bank":
        return (
          <div className="space-y-4">
            <div className="p-5 border rounded-2xl bg-slate-50 relative shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">BCA (Bank Central Asia)</p>
              <p className="text-2xl font-bold tracking-widest mt-2 text-slate-800">123 456 7890</p>
              <p className="text-sm text-slate-600 mt-1">a.n AI Cafe Official</p>
              <Button variant="ghost" size="icon" className="absolute top-5 right-5 hover:bg-slate-200" onClick={() => handleCopy("1234567890")}>
                <Copy className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
            <div className="p-5 border rounded-2xl bg-slate-50 relative shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mandiri</p>
              <p className="text-2xl font-bold tracking-widest mt-2 text-slate-800">098 765 4321</p>
              <p className="text-sm text-slate-600 mt-1">a.n AI Cafe Official</p>
              <Button variant="ghost" size="icon" className="absolute top-5 right-5 hover:bg-slate-200" onClick={() => handleCopy("0987654321")}>
                <Copy className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
          </div>
        );
      case "E-Wallet":
        return (
          <div className="space-y-4">
            <div className="p-5 border rounded-2xl bg-slate-50 relative shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">GoPay / OVO / Dana</p>
              <p className="text-2xl font-bold tracking-widest mt-2 text-slate-800">0812 3456 7890</p>
              <p className="text-sm text-slate-600 mt-1">a.n AI Cafe Official</p>
              <Button variant="ghost" size="icon" className="absolute top-5 right-5 hover:bg-slate-200" onClick={() => handleCopy("081234567890")}>
                <Copy className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
          </div>
        );
      case "Tunai":
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 border border-amber-200 rounded-2xl bg-amber-50 text-center shadow-sm">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-5">
              <Banknote className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="font-bold text-xl text-amber-900 mb-3">Pembayaran Tunai</h3>
            <p className="text-amber-700/90 leading-relaxed max-w-[300px]">Silakan lakukan pembayaran sebesar <strong className="text-amber-900 text-lg">Rp {order.total.toLocaleString("id-ID")}</strong> di kasir kami dengan menunjukkan ID Pesanan ini.</p>
          </div>
        );
    }
  };

  return (
    <>
    <div className="container mx-auto px-4 py-10 max-w-xl animate-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-4rem)]">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Selesaikan Pembayaran</h1>
          <p className="text-muted-foreground mt-1 text-sm">Lakukan pembayaran untuk memproses pesanan Anda</p>
        </div>
        <span className="text-sm font-mono bg-muted/80 px-3 py-1.5 rounded-lg text-muted-foreground font-medium self-start md:self-auto border">ID: {order.id.slice(-8)}</span>
      </div>

      <Card className="p-6 mb-8 shadow-sm border-0 ring-1 ring-black/5 bg-gradient-to-br from-background to-muted/30">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Tagihan</p>
            <p className="text-4xl font-black text-primary tracking-tight">Rp {order.total.toLocaleString("id-ID")}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center text-sm font-medium bg-accent/10 p-3.5 rounded-xl text-primary border border-accent/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          Menunggu pembayaran via <span className="font-bold text-accent">{order.paymentMethod}</span>
        </div>
      </Card>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-5 text-primary flex items-center gap-2">
          Instruksi Pembayaran
        </h2>
        {renderPaymentInstructions()}
      </div>

      <div className="flex gap-4 flex-col bg-background p-4 -mx-4 md:mx-0 md:p-0 border-t md:border-0 sticky bottom-0 md:static z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] md:shadow-none">
        <Button
          onClick={handleConfirm}
          disabled={isProcessing}
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 h-14 text-base font-semibold rounded-xl"
        >
          {isProcessing ? "Memverifikasi Pembayaran..." : "Saya Sudah Bayar"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-12 text-muted-foreground hover:text-destructive border-muted hover:border-destructive hover:bg-destructive/10 rounded-xl"
          onClick={handleCancel}
          disabled={isProcessing}
        >
          Batalkan Pesanan
        </Button>
      </div>
    </div>
    </>
  );
}
