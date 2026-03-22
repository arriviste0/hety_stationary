"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer />
    </>
  );
}
