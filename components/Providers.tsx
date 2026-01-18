"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import PageTransition from "@/components/PageTransition";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <PageTransition>{children}</PageTransition>
    </CartProvider>
  );
}
