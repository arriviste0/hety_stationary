"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import PageTransition from "@/components/PageTransition";
import RouteTracker from "@/components/RouteTracker";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <RouteTracker />
      <PageTransition>{children}</PageTransition>
    </CartProvider>
  );
}
