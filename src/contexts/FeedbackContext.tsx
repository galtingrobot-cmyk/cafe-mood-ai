"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Feedback {
  id: string;
  name: string;
  message: string;
  date: string;
}

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (name: string, message: string) => void;
  isLoading: boolean;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["saran_menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saran_menu")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching saran_menu:", error);
        return []; // Jangan throw agar web tidak crash kalau error
      }
      
      return data.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        name: "Pelanggan AI Barista", // Karena di tabel saran_menu tidak ada kolom nama
        message: item.pesan_asli || "", 
        date: item.created_at || new Date().toISOString(),
      })) as Feedback[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ message }: { name: string; message: string }) => {
      const { error } = await supabase
        .from("saran_menu")
        .insert([{ 
           pesan_asli: message,
           status: "Pending" 
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saran_menu"] });
    },
    onError: (error) => {
      console.error("Gagal menyimpan saran:", error);
      toast.error("Gagal menyimpan saran ke database");
    }
  });

  const addFeedback = (name: string, message: string) => {
    addMutation.mutate({ name, message });
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, isLoading }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
};
