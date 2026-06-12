"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, RefreshCw, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function WaitingListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('create_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      toast.error("Gagal mengambil data antrian");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    // Auto-refresh setiap 10 detik
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  // Membalik array agar yang paling lama (pertama antri) ada di atas
  const pendingOrders = orders.filter(o => o.status !== 'selesai').reverse();
  const completedOrders = orders.filter(o => o.status === 'selesai').slice(0, 5); // Tampilkan 5 terakhir yang sudah selesai

  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-4rem)] animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Daftar Antrian</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQueue} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Perbarui
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Kolom Sedang Disiapkan */}
        <div>
          <div className="flex items-center gap-2 mb-4 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-900">Sedang Disiapkan</h2>
            <span className="ml-auto bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 bg-slate-50 rounded-xl border border-dashed">Belum ada antrian</p>
            ) : (
              pendingOrders.map(order => (
                <Card key={order.orders_id} className="p-4 border-l-4 border-l-amber-500 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(order.create_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="font-semibold text-primary text-lg">{order.nama_pelanggan || "Anonim"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">No. Antrian</p>
                    <p className="font-mono text-xl font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                      #{order.orders_id}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Kolom Silakan Diambil */}
        <div>
          <div className="flex items-center gap-2 mb-4 bg-green-50 p-3 rounded-xl border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-900">Silakan Diambil</h2>
          </div>

          <div className="space-y-3">
            {completedOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 bg-slate-50 rounded-xl border border-dashed">Belum ada pesanan selesai</p>
            ) : (
              completedOrders.map(order => (
                <Card key={order.orders_id} className="p-4 border-l-4 border-l-green-500 shadow-sm flex justify-between items-center opacity-80 transition-all">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(order.create_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="font-semibold text-primary text-lg line-through text-muted-foreground">{order.nama_pelanggan || "Anonim"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">No. Antrian</p>
                    <p className="font-mono text-xl font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                      #{order.orders_id}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
