"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { MenuItem } from "@/data/menu";

interface MenuContextType {
  menuItems: MenuItem[];
  isLoading: boolean;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // 1. Fetch data dari Supabase
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu").select("*").order("menu_id", { ascending: true });
      if (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Gagal mengambil data menu dari database");
        throw error;
      }
      
      // Mapping dari database Supabase (nama, deskripsi, harga, gambar_url) ke frontend (name, description, price, image)
      return data.map((item: any) => ({
        id: item.menu_id.toString(),
        name: item.nama,
        description: item.deskripsi || "",
        price: Number(item.harga),
        category: (item.kategori || "kopi").toLowerCase(),
        image: item.gambar_url || undefined,
      })) as MenuItem[];
    },
  });

  // 2. Add item ke Supabase
  const addMutation = useMutation({
    mutationFn: async (item: Omit<MenuItem, "id">) => {
      const payload = {
        nama: item.name,
        deskripsi: item.description,
        harga: item.price,
        kategori: item.category,
        gambar_url: item.image,
      };
      const { data, error } = await supabase.from("menu").insert([payload]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu berhasil ditambahkan");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menambahkan menu");
    }
  });

  // 3. Update item di Supabase
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => {
      const payload: any = {};
      if (updates.name !== undefined) payload.nama = updates.name;
      if (updates.description !== undefined) payload.deskripsi = updates.description;
      if (updates.price !== undefined) payload.harga = updates.price;
      if (updates.category !== undefined) payload.kategori = updates.category;
      if (updates.image !== undefined) payload.gambar_url = updates.image;

      const { data, error } = await supabase.from("menu").update(payload).eq("menu_id", Number(id)).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu berhasil diupdate");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal mengupdate menu");
    }
  });

  // 4. Delete item di Supabase
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu").delete().eq("menu_id", Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu berhasil dihapus");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menghapus menu");
    }
  });

  const addMenuItem = (item: Omit<MenuItem, "id">) => addMutation.mutate(item);
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => updateMutation.mutate({ id, updates });
  const deleteMenuItem = (id: string) => deleteMutation.mutate(id);

  return (
    <MenuContext.Provider value={{ menuItems, isLoading, addMenuItem, updateMenuItem, deleteMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
};
