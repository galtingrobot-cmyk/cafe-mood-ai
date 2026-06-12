"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { MenuItem } from "@/data/menu";

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod?: string;
  customerName?: string;
}

interface CheckoutOpts {
  paymentMethod?: string;
  customerName?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  checkout: (opts?: CheckoutOpts) => string | undefined;
  cancelOrder: (orderId: string) => void;
  orders: Order[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem("cafe-orders") || "[]"); } catch { return []; }
  });

  const addItem = useCallback((item: MenuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) return setItems(prev => prev.filter(i => i.id !== id));
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);
  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const checkout = useCallback((opts?: CheckoutOpts) => {
    if (items.length === 0) return undefined;
    const order: Order = {
      id: Date.now().toString(),
      items: [...items],
      total,
      date: new Date().toISOString(),
      paymentMethod: opts?.paymentMethod,
      customerName: opts?.customerName,
    };
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem("cafe-orders", JSON.stringify(newOrders));
    setItems([]);
    return order.id;
  }, [items, total, orders]);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => {
      const orderToCancel = prev.find(o => o.id === orderId);
      if (orderToCancel) {
        setItems(orderToCancel.items);
      }
      const newOrders = prev.filter(o => o.id !== orderId);
      localStorage.setItem("cafe-orders", JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, checkout, cancelOrder, orders }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
