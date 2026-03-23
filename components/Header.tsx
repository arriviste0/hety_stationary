"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Stores", href: "/stores" },
  { label: "Franchise", href: "/franchise" },
  { label: "Contact", href: "/contact" }
];

const fallbackMegaMenus: Record<string, MegaMenuGroup[]> = {
  Products: [
    {
      title: "Retail and Wholesale",
      items: [
        { label: "All Products", href: "/products" },
        { label: "All kind of stationery items", href: "/#categories" },
        { label: "Copier products", href: "/#categories" },
        { label: "Art materials", href: "/#categories" },
        { label: "Craft supplies", href: "/#categories" }
      ]
    },
    {
      title: "Featured Brands",
      items: [
        { label: "HETY Stationery", href: "/#brands" },
        { label: "Flair", href: "/#brands" },
        { label: "DOMS", href: "/#brands" },
        { label: "Saino", href: "/#brands" }
      ]
    },
    {
      title: "Popular Range",
      items: [
        { label: "Camlin", href: "/#brands" },
        { label: "Aerotix", href: "/#brands" },
        { label: "Officemate", href: "/#brands" },
        { label: "Customized products", href: "/#brands" }
      ]
    }
  ],
  Categories: [
    {
      title: "Business Segments",
      items: [
        { label: "All Categories", href: "/categories" },
        { label: "Branding Items", href: "/#categories" },
        { label: "Writing Instruments", href: "/#categories" },
        { label: "School Supplies", href: "/#categories" },
        { label: "Art and Craft", href: "/#categories" }
      ]
    },
    {
      title: "Store Demand",
      items: [
        { label: "Office Supplies", href: "/#categories" },
        { label: "Copier Solutions", href: "/#categories" },
        { label: "Premium Stationery", href: "/#categories" }
      ]
    }
  ]
};

type MegaMenuGroup = {
  title: string;
  items: Array<{
    label: string;
    href: string;
  }>;
};

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [megaMenus, setMegaMenus] = useState<Record<string, MegaMenuGroup[]>>(
    fallbackMegaMenus
  );
  const { cartCount, toggleCart, wishlist } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function loadNavigation() {
      try {
        const response = await fetch("/api/site/navigation", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          megaMenus?: Record<string, MegaMenuGroup[]>;
        };

        if (!cancelled && data.megaMenus) {
          setMegaMenus(data.megaMenus);
        }
      } catch {
        // Keep fallback navigation if admin data is not available.
      }
    }

    loadNavigation();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="border-b border-brand-100 py-2 text-xs text-accent-pink sm:text-sm">
        <div className="section-padding mx-auto flex items-center justify-center gap-2">
          <span>Retailer, wholesaler, and franchise opportunities across India</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Open daily from 9:30 AM to 9:00 PM</span>
        </div>
      </div>

      <div className="section-padding mx-auto flex items-center justify-between gap-3 py-3 sm:py-4">
        <div className="flex items-center gap-3 xl:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="icon-btn p-2 text-brand-700"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/images/logo.png"
              alt="HETY STATIONERY logo"
              width={56}
              height={56}
              className="h-9 w-9 rounded-lg object-contain sm:h-14 sm:w-14 sm:rounded-xl"
            />
            <div>
              <p className="text-base font-display leading-tight text-brand-700 sm:text-2xl">
                HETY STATIONERY
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">
                Copier-Art & Craft
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="hidden items-center gap-6 text-sm font-medium text-slate-700 xl:flex"
        >
          {navLinks.map((link) => {
            const mega = megaMenus[link.label as keyof typeof megaMenus];
            return (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className="link-underline inline-flex items-center gap-1 text-brand-600"
                >
                  {link.label}
                  {mega && <ChevronDown size={14} className="text-brand-600" />}
                </Link>
                {mega && (
                  <div className="invisible absolute left-1/2 top-full z-20 mt-5 w-[760px] -translate-x-1/2 rounded-2xl border border-brand-100 bg-white p-6 shadow-soft opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100">
                    <div className={`grid gap-6 ${mega.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                      {mega.map((group) => (
                        <div key={group.title}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-accent-pink">
                            {group.title}
                          </p>
                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            {group.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block rounded-lg px-2 py-1 transition-all duration-200 ease-out hover:bg-accent-pink/10 hover:text-brand-700"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 sm:gap-4"
        >
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="icon-btn p-2 text-brand-700"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <Link
            href="/wishlist"
            className="icon-btn relative p-2 text-brand-700"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-yellow text-[10px] text-slate-900">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className="icon-btn p-2 text-brand-700"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
        </motion.div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close navigation overlay"
          />
          <div className="absolute left-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/images/logo.png"
                  alt="HETY STATIONERY logo"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-xl object-contain"
                />
                <div>
                  <p className="text-base font-display text-brand-700">HETY STATIONERY</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Copier-Art & Craft
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="icon-btn p-2 text-brand-700"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {navLinks.map((link) => {
                const mega = megaMenus[link.label as keyof typeof megaMenus];
                const isOpen = openMobileSection === link.label;

                if (!mega) {
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <div key={link.label} className="rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between px-3 py-3">
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-semibold text-slate-700"
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileSection((current) =>
                            current === link.label ? null : link.label
                          )
                        }
                        className="rounded-lg p-1 text-brand-700"
                        aria-label={`Toggle ${link.label} menu`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="border-t border-slate-200 px-3 py-3">
                        <div className="space-y-4">
                          {mega.map((group) => (
                            <div key={group.title}>
                              <p className="text-xs font-semibold uppercase tracking-wide text-accent-pink">
                                {group.title}
                              </p>
                              <div className="mt-2 space-y-2">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleCart}
        className="btn-primary fixed right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center shadow-card sm:right-6 sm:h-14 sm:w-14"
        aria-label="Open cart"
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-yellow text-[11px] font-semibold text-slate-900">
            {cartCount}
          </span>
        )}
      </button>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <AuthModal />
    </header>
  );
}
