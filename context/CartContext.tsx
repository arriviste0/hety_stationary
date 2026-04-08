"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isAuthOpen: boolean;
  isLoggedIn: boolean;
  customer: { id: string; name: string; email: string; phone?: string } | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openAuth: () => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string; requiresVerification?: boolean; email?: string }>;
  logout: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = "hety_cart";
const WISHLIST_KEY = "hety_wishlist";

function normalizeWishlist(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null>(null);

  const persistWishlist = useCallback(async (nextWishlist: string[]) => {
    const response = await fetch("/api/account/wishlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: nextWishlist })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Could not save wishlist.");
    }

    return normalizeWishlist(data.wishlist);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCart = window.localStorage.getItem(CART_KEY);
    const storedWishlist = window.localStorage.getItem(WISHLIST_KEY);
    const localWishlist = storedWishlist ? normalizeWishlist(JSON.parse(storedWishlist)) : [];

    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
    setWishlist(localWishlist);

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (data) => {
        if (data?.isAuthenticated && data.customer) {
          setIsLoggedIn(true);
          setCustomer({
            id: data.customer.id,
            name: data.customer.name,
            email: data.customer.email,
            phone: data.customer.phone
          });

          const serverWishlist = normalizeWishlist(data.customer.wishlist);
          const mergedWishlist = normalizeWishlist([...serverWishlist, ...localWishlist]);

          setWishlist(mergedWishlist);

          if (mergedWishlist.join("|") !== serverWishlist.join("|")) {
            try {
              const savedWishlist = await persistWishlist(mergedWishlist);
              setWishlist(savedWishlist);
            } catch {
              setWishlist(mergedWishlist);
            }
          }
        } else {
          setIsLoggedIn(false);
          setCustomer(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCustomer(null);
      });
  }, [persistWishlist]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  }, [isLoggedIn]);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.product.id === id ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    setWishlist((prev) => {
      const nextWishlist = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      void persistWishlist(nextWishlist).catch(() => {
        setWishlist(prev);
      });

      return nextWishlist;
    });
  }, [isLoggedIn, persistWishlist]);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const openAuth = useCallback(() => setIsAuthOpen(true), []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);
  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, error: data.error || "Login failed." };
    }

    const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
    const sessionData = await sessionResponse.json();
    setIsLoggedIn(true);
    setCustomer(
      sessionData.customer
        ? {
            id: sessionData.customer.id,
            name: sessionData.customer.name,
            email: sessionData.customer.email,
            phone: sessionData.customer.phone
          }
        : null
    );
    const mergedWishlist = normalizeWishlist([
      ...normalizeWishlist(sessionData.customer?.wishlist),
      ...wishlist
    ]);
    setWishlist(mergedWishlist);
    await persistWishlist(mergedWishlist).catch(() => undefined);
    setIsAuthOpen(false);
    return { ok: true };
  }, [persistWishlist, wishlist]);
  const signup = useCallback(async (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, error: data.error || "Signup failed." };
    }

    if (data.requiresVerification) {
      return {
        ok: true,
        requiresVerification: true,
        email: String(data.email || payload.email || "").trim().toLowerCase()
      };
    }

    const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
    const sessionData = await sessionResponse.json();
    setIsLoggedIn(true);
    setCustomer(
      sessionData.customer
        ? {
            id: sessionData.customer.id,
            name: sessionData.customer.name,
            email: sessionData.customer.email,
            phone: sessionData.customer.phone
          }
        : null
    );
    const mergedWishlist = normalizeWishlist([
      ...normalizeWishlist(sessionData.customer?.wishlist),
      ...wishlist
    ]);
    setWishlist(mergedWishlist);
    await persistWishlist(mergedWishlist).catch(() => undefined);
    setIsAuthOpen(false);
    return { ok: true };
  }, [persistWishlist, wishlist]);
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setCustomer(null);
    setWishlist([]);
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      wishlist,
      isCartOpen,
      isAuthOpen,
      isLoggedIn,
      customer,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      cartCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      openAuth,
      closeAuth,
      login,
      signup,
      logout
    }),
    [
      items,
      wishlist,
      isCartOpen,
      isAuthOpen,
      isLoggedIn,
      customer,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      cartCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      openAuth,
      closeAuth,
      login,
      signup,
      logout
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
