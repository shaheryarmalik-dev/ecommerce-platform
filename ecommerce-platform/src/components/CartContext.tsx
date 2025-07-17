"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  itemCount: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_KEY = "cart_items";

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from API or localStorage
  const fetchCart = async () => {
    if (session && session.user) {
      // Logged-in: fetch from API
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(
          data.map((item: any) => ({
            id: item.productId || item.id,
            productId: item.productId || item.id,
            name: item.product?.name || item.name || "",
            price: item.product?.price ?? item.price ?? 0,
            imageUrl: item.product?.imageUrl || item.imageUrl || "",
            quantity: item.quantity,
          }))
        );
      }
    } else {
      // Guest: load from localStorage
      const local = localStorage.getItem(LOCAL_KEY);
      setItems(local ? JSON.parse(local) : []);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [session?.user]);

  // Save to localStorage for guests
  useEffect(() => {
    if (!session || !session.user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    }
  }, [items, session]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (session && session.user) {
      // API for logged-in
      const existing = items.find((i) => i.id === item.id);
      const quantity = existing ? existing.quantity + 1 : 1;
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, quantity }),
      });
      if (res.ok) {
        await fetchCart();
      }
    } else {
      // Local for guest
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (id: string) => {
    if (session && session.user) {
      // API for logged-in
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      if (res.ok) {
        await fetchCart();
      }
    } else {
      // Local for guest
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, itemCount, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
} 