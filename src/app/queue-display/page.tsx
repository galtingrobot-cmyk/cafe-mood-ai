"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function QueueDisplayPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('orders_id, status, nama_pelanggan')
        .order('create_at', { ascending: false })
        .limit(40);

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Gagal mengambil data antrian", err);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Refresh setiap 5 detik agar responsif di layar
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter(o => o.status !== 'selesai').reverse();
  const completedOrders = orders.filter(o => o.status === 'selesai').slice(0, 12); // Tampilkan maks 12 terakhir yang selesai

  return (
    <>
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-[#1A1A1A] text-white selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-4 lg:py-6 bg-[#262626] border-b border-stone-800 shadow-xl shrink-0 z-10 gap-4 sm:gap-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="relative w-12 h-12 lg:w-16 lg:h-16 overflow-hidden rounded-full border-2 border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.3)] bg-[#262626]">
            <Image src="/favicon-96x96.png" alt="Kopi Mood Logo" fill className="object-cover" sizes="64px" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-amber-50 tracking-wide">Kopi Mood</h1>
            <p className="text-amber-500/80 font-medium tracking-widest uppercase text-xs lg:text-sm">Status Antrian</p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 bg-stone-900/50 px-4 py-2 lg:px-5 lg:py-2.5 rounded-2xl border border-stone-800">
          <MonitorPlay className="w-5 h-5 text-stone-400" />
          <div className="flex gap-2 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-stone-300 font-medium tracking-wide uppercase text-sm">Live System</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden relative">
        {/* Garis pemisah tengah yang elegan */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-stone-800 to-transparent -translate-x-1/2 z-0"></div>

        {/* Kolom Kiri: Sedang Disiapkan */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 z-10 relative">
          <div className="flex items-center justify-center lg:justify-start gap-3 lg:gap-4 mb-6 lg:mb-10 pb-4 lg:pb-6 border-b border-stone-800/60">
            <div className="p-2 lg:p-3 bg-amber-500/10 rounded-xl lg:rounded-2xl">
              <Clock className="w-6 h-6 lg:w-10 lg:h-10 text-amber-500" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-amber-400 uppercase tracking-widest">Sedang Disiapkan</h2>
          </div>

          <div className="flex-1 lg:overflow-y-auto overflow-visible pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 content-start">
              <AnimatePresence>
                {pendingOrders.map((order) => (
                  <motion.div
                    key={order.orders_id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="aspect-video bg-stone-900/40 rounded-3xl border border-amber-900/30 flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 to-transparent"></div>
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-50 font-mono tracking-tighter relative z-10">
                      {order.orders_id}
                    </span>
                    <span className="text-xs sm:text-sm lg:text-base text-amber-200/80 mt-1 relative z-10 uppercase tracking-widest font-semibold truncate max-w-[90%] text-center">
                      {order.nama_pelanggan || "Anonim"}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Silakan Diambil */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 z-10 bg-stone-950/20 border-t lg:border-t-0 border-stone-800/50">
          <div className="flex items-center justify-center lg:justify-start gap-3 lg:gap-4 mb-6 lg:mb-10 pb-4 lg:pb-6 border-b border-stone-800/60">
            <div className="p-2 lg:p-3 bg-emerald-500/10 rounded-xl lg:rounded-2xl">
              <CheckCircle2 className="w-6 h-6 lg:w-10 lg:h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-emerald-400 uppercase tracking-widest">Silakan Diambil</h2>
          </div>

          <div className="flex-1 lg:overflow-y-auto overflow-visible pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 content-start">
              <AnimatePresence>
                {completedOrders.map((order, idx) => (
                  <motion.div
                    key={order.orders_id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20,
                    }}
                    className={`aspect-video rounded-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden ${
                      idx === 0 
                        ? "bg-emerald-900/40 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" 
                        : "bg-stone-900 border border-stone-800"
                    }`}
                  >
                    {idx === 0 && (
                      <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500"
                      />
                    )}
                    <span className={`font-black font-mono tracking-tighter relative z-10 ${
                      idx === 0 ? "text-5xl sm:text-6xl lg:text-7xl text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "text-4xl sm:text-5xl lg:text-6xl text-stone-300"
                    }`}>
                      {order.orders_id}
                    </span>
                    <span className={`text-xs sm:text-sm lg:text-base mt-1 relative z-10 uppercase tracking-widest font-semibold truncate max-w-[90%] text-center ${
                      idx === 0 ? "text-emerald-200" : "text-stone-400"
                    }`}>
                      {order.nama_pelanggan || "Anonim"}
                    </span>
                    {idx === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 lg:mt-2 text-center text-[10px] lg:text-xs font-bold text-emerald-300 uppercase tracking-widest relative z-10"
                      >
                        Pesanan Baru
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Ticker (Optional touch) */}
      <div className="bg-stone-900 border-t border-stone-800 py-2 lg:py-3 overflow-hidden shrink-0">
        <div className="whitespace-nowrap flex animate-[marquee_20s_linear_infinite]">
          <span className="text-stone-400 font-medium tracking-widest uppercase text-xs lg:text-sm mx-4">
            Terima kasih telah mengunjungi AI Cafe • Harap perhatikan nomor antrian Anda • Pengambilan pesanan berada di kasir utama • Selamat menikmati hidangan kami
          </span>
          <span className="text-stone-400 font-medium tracking-widest uppercase text-xs lg:text-sm mx-4">
            Terima kasih telah mengunjungi AI Cafe • Harap perhatikan nomor antrian Anda • Pengambilan pesanan berada di kasir utama • Selamat menikmati hidangan kami
          </span>
        </div>
      </div>
    </div>

    <style dangerouslySetInnerHTML={{__html: `
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
    `}} />
    </>
  );
}
