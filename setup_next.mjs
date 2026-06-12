import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appDir = path.join(__dirname, 'src/app');

// Create src/app directory
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

// Mapping of src/pages to src/app directories
const pagesMap = {
  'Index.tsx': 'page.tsx', // goes to src/app/page.tsx
  'MenuPage.tsx': 'menu/page.tsx',
  'CartPage.tsx': 'cart/page.tsx',
  'CheckoutPage.tsx': 'checkout/page.tsx',
  'ChatPage.tsx': 'chat/page.tsx',
  'AdminLogin.tsx': 'admin-login/page.tsx',
  'AdminPage.tsx': 'admin/page.tsx',
};

// Move pages
for (const [pageFile, routePath] of Object.entries(pagesMap)) {
  const sourcePath = path.join(__dirname, 'src/pages', pageFile);
  if (fs.existsSync(sourcePath)) {
    const destPath = path.join(appDir, routePath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.renameSync(sourcePath, destPath);
    console.log(`Moved ${pageFile} to app/${routePath}`);
  }
}

// We need a layout.tsx for Next.js
const layoutContent = `
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kopi Mood',
  description: 'AI Cafe Application',
};

import Providers from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
              <p>© 2026 Kopi Mood. Dibuat dengan ☕ dan cinta.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
`;

fs.writeFileSync(path.join(appDir, 'layout.tsx'), layoutContent.trim());

// Providers component to wrap client contexts
const providersContent = `"use client";

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MenuProvider>
          <CartProvider>
            <FeedbackProvider>
              {children}
              <Toaster />
              <Sonner />
            </FeedbackProvider>
          </CartProvider>
        </MenuProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
`;

fs.writeFileSync(path.join(appDir, 'providers.tsx'), providersContent);

// Rename index.css to globals.css and move to src/app
if (fs.existsSync(path.join(__dirname, 'src/index.css'))) {
  fs.renameSync(path.join(__dirname, 'src/index.css'), path.join(appDir, 'globals.css'));
  console.log("Moved index.css to app/globals.css");
}

console.log("Setup completed.");
