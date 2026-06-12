"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <>
      <div className="container mx-auto px-4 py-20 text-center max-w-md min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Keranjang Kosong</h2>
        <p className="text-muted-foreground mb-6">Yuk pilih minuman favoritmu dulu!</p>
        <Button asChild><Link href="/menu">Lihat Menu</Link></Button>
      </div>
      </>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[calc(100dvh-4rem)]">
      <h1 className="text-3xl font-bold text-primary mb-6">Keranjang</h1>
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="flex justify-between items-start w-full sm:w-auto sm:flex-1 min-w-0">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-semibold text-primary truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Rp {item.price.toLocaleString("id-ID")}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 sm:hidden text-muted-foreground hover:text-destructive -mr-1 -mt-1" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-accent sm:w-24 text-right">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 shrink-0" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-primary">Total</span>
        <span className="text-xl font-bold text-accent">Rp {total.toLocaleString("id-ID")}</span>
      </Card>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={clearCart} className="flex-1">Kosongkan</Button>
        <Button onClick={handleCheckout} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Checkout</Button>
      </div>
    </div>
    </>
  );
}
