"use client";

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { LenisProvider } from "@/components/LenisProvider";
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MenuProvider>
          <CartProvider>
            <FeedbackProvider>
              <LenisProvider>
                {children}
                <Toaster />
                <Sonner />
              </LenisProvider>
            </FeedbackProvider>
          </CartProvider>
        </MenuProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
