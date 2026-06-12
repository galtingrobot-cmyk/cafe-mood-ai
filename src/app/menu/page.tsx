"use client";

import { useState } from "react";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { categories } from "@/data/menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Coffee } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function MenuPage() {
  const { menuItems } = useMenu();
  const { addItem } = useCart();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? menuItems : menuItems.filter(i => i.category === filter);

  const handleAdd = (item: typeof menuItems[0]) => {
    addItem(item);
    toast.success(`${item.name} ditambahkan ke keranjang`);
  };

  return (
    <>
    <div className="min-h-[calc(100dvh-4rem)]">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-6 sm:py-8 pb-12 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Menu Kami</h1>
        <p className="text-muted-foreground">Pilih minuman & camilan favoritmu</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(c => (
          <Button key={c.key} variant={filter === c.key ? "default" : "outline"} size="sm" onClick={() => setFilter(c.key)} className="rounded-full">
            {c.label}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="h-full">
            <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col group border-primary/10">
              <div className="h-48 overflow-hidden bg-white relative p-4 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary"><Coffee className="h-12 w-12 text-muted-foreground/30" /></div>
                )}
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-primary">{item.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1 capitalize">{item.category}</Badge>
                  </div>
                  <span className="font-bold text-accent whitespace-nowrap">Rp {item.price.toLocaleString("id-ID")}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>
                <Button onClick={() => handleAdd(item)} size="sm" className="w-full bg-primary text-primary-foreground mt-auto">
                  <Plus className="h-4 w-4 mr-1" /> Tambah
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
    </div>
    <Footer />
    </>
  );
}
