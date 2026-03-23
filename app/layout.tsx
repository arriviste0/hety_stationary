import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Manrope, Playfair_Display } from "next/font/google";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "HETY STATIONERY - COPIER-ART & CRAFT",
  description:
    "HAPY FRANCHISE LLP runs HETY STATIONERY as a retailer, wholesaler, and franchise-focused business for stationery, copier, art and craft products."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
