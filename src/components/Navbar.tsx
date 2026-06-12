"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Coffee, ShoppingCart, MessageCircle, Menu, X, Settings } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { to: "/", label: "Beranda", icon: Coffee },
  { to: "/menu", label: "Menu", icon: Coffee },
  { to: "/chat", label: "AI Barista", icon: MessageCircle },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // 64px is the height of the navbar (h-16). Make it transparent when footer is behind it.
        setIsAtFooter(footerRect.top <= 64);
      } else {
        setIsAtFooter(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initially
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === "/queue-display") {
    return null;
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${isAtFooter ? 'bg-transparent border-transparent' : 'border-b bg-card/80 backdrop-blur-md'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 overflow-hidden rounded-full border border-accent/20">
            <Image src="/favicon-96x96.png" alt="Kopi Mood Logo" fill className="object-cover" sizes="32px" />
          </div>
          <span className={`text-xl font-bold font-serif transition-colors duration-500 ease-in-out ${isAtFooter ? 'text-white' : 'text-primary'}`}>Kopi Mood</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.to} href={l.to} className={`text-sm font-medium transition-colors hover:text-accent ${pathname === l.to ? "text-accent" : "text-muted-foreground"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">{itemCount}</Badge>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">{itemCount}</Badge>
            )}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map(l => (
                  <Link key={l.to} href={l.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 text-lg font-medium py-2 ${pathname === l.to ? "text-accent" : "text-foreground"}`}>
                    <l.icon className="h-5 w-5" /> {l.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
